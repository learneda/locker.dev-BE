const db = require('../../dbConfig');
const faker = require('faker');

module.exports = {
  async getAllUsers(req, res, next) {
    const user = req.user;
    if (user) {
      try {
        const users = await db('users');
        // console.log('users', users);
        return res.status(200).json(users);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      res.status(400).json({ err: 'not allowed' });
    }
  },
  async editProfile(req, res, next) {
    const user = req.body.id;
    const {
      profile_picture,
      display_name,
      username,
      bio,
      location,
      website_url
    } = req.body;
    // console.log('REQ.BODY', req.body);
    if (user) {
      try {
        const postPromise = await db('users')
          .where({ id: user })
          .update({
            profile_picture,
            display_name,
            username,
            bio,
            location,
            website_url
          });
        if (postPromise) {
          res.status(200).json({ msg: 'success' });
        } else {
          res.status(400).json({ err: 'something went wrong' });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      res.status(400).json({ err: 'not allowed' });
    }
  },
  async getUserDetailsById(req, res, next) {
    const id = req.params.id;
    // console.log(typeof id);
    try {
      const selectPromise = await db('users')
        .where({ id: id })
        .select(
          'username',
          'display_name',
          'profile_picture',
          'bio',
          'location',
          'website_url',
          'created_at'
        );
      const selectCountPromise = await db('posts')
        .where({ user_id: id })
        .count()
        .first();

      const totalUserFollowers = await db('friendships')
        .where('friend_id', id)
        .countDistinct('user_id', 'friend_id')
        .first();

      const totalUserFollowing = await db('friendships')
        .where('user_id', id)
        .countDistinct('user_id', 'friend_id')
        .first();

      selectPromise[0].post_count = selectCountPromise.count;
      selectPromise[0].followers_count = totalUserFollowers.count;
      selectPromise[0].following_count = totalUserFollowing.count;

      if (selectPromise) {
        res.status(200).json(selectPromise);
      } else {
        res.status(404).json({ msg: 'user not found..' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async getUserDetailsByUserName(req, res, next) {
    const username = req.params.username;
    try {
      const selectPromise = await db('users')
        .where({ username: username })
        .select(
          'username',
          'display_name',
          'profile_picture',
          'bio',
          'location',
          'website_url'
        );
      if (selectPromise) {
        res.status(200).json(selectPromise);
      } else {
        res.status(404).json({ msg: 'user not found..' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async subscribetoUser(req, res, next) {
    const user_id = req.body.user_id;
    const friend_id = req.body.friend_id;
    try {
      const insertPromise = await db('friendships').insert({
        user_id,
        friend_id
      });
      if (insertPromise) {
        res.status(200).json({ msg: 'success' });
      } else {
        res.status(404).json({ msg: 'something went wrong ..' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async unsubscribetoUser(req, res, next) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id;
    const friend_id = req.body.friend_id;
    try {
      const deletePromise = await db('friendships')
        .where({ user_id, friend_id })
        .del();
      if (deletePromise) {
        res.status(200).json({ msg: 'success' });
      } else {
        res.status(404).json({ msg: 'something went wrong ..' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async getUserNewsFeed(req, res, next) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id;
    const offset = req.query.offset;
    console.log(req.query.offset);
    try {
      let friends = await db('friendships').where({user_id}).select('friend_id')
      
      friends = friends.map(friend => friend.friend_id)

      const friendsAndCurrentUser = [ ...friends, Number(user_id)]

      console.log(friends, 'friends')

      const newsFeed = await db('newsfeed_posts')
      .whereIn('newsfeed_posts.user_id', friendsAndCurrentUser)
      .join('users', 'newsfeed_posts.user_id', '=', 'users.id')
      .join('posts', 'newsfeed_posts.post_id', '=', 'posts.id' )
      .orderBy('posts.created_at', 'desc')
      .offset(req.query.offset)
      .limit(5);
      
      const commentLoop = async () => {
        for (let post of newsFeed) {
          post.comments = []

          const commentArray = await db('comments as c')
          .where('c.post_id', '=', post.post_id)
          .join('users as u', 'c.user_id', 'u.id')
          post.comments.push(...commentArray)

          const likeCount = await db('posts_likes')
            .where('post_id', post.post_id)
            .countDistinct('user_id');
          post.likes = Number(likeCount[0].count);

        }
        if (newsFeed) {
          res.status(200).json(newsFeed)
        }
        else {
          throw new Error('newsFeedError');
        }
      }
      commentLoop()

    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  /* ===== USER FOLLOWERS AND FOLLOWING COUNT ===== */
  async getUserFollowStats(req, res, next) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id;
    try {
      const totalUserFollowers = await db('friendships')
        .where('friend_id', user_id)
        .countDistinct('user_id', 'friend_id')
        .first();

      const totalUserFollowing = await db('friendships')
        .where('user_id', user_id)
        .countDistinct('user_id', 'friend_id')
        .first();

      if (totalUserFollowers) {
        res.status(200).json({
          followers: totalUserFollowers.count,
          following: totalUserFollowing.count
        });
      } else {
        res.status(201).json({ error: 'BROKEN' });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getFollowing(req, res, next) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id;
    const friend_id = req.params.id;
    try {
      const following = await db('friendships').where({
        user_id: user_id,
        friend_id: friend_id
      });
      if (following.length) {
        res.status(200).json({
          following: true
        });
      } else {
        res.status(200).json({ following: false });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async recommendedFollow(req, res, next) {
    // console.log('🛰', req.query.id);
    const user_id = req.query.id;
    let friendsOfFriends = [];

    // makes an array with user_id's that I follow
    const friends = await db('friendships').where('user_id', user_id);
    const friendsId = friends.map(friend => friend.friend_id);
    const friendsIdWithUserId = [...friendsId, user_id];

    //* Creates a new array with random elements from ARR (no duplicates) [should be a utily import]
    const pickRandom = (arr, count) => {
      let _arr = [...arr];
      return [...Array(count)].map(
        () => _arr.splice(Math.floor(Math.random() * _arr.length), 1)[0]
      );
    };

    if (friendsId.length) {
      // generates an array of users that people I follow are following
      for (let i = 0; i < friendsId.length; i++) {
        const friendsOfFriend = await db('friendships')
          .select(
            'friendships.friend_id as recommended_follow_id',
            'friendships.user_id as followed_by_id',
            'users.profile_picture as image',
            'users.display_name',
            'users.username',
            'users.bio',
            'users.location'
          )
          .join('users', 'friendships.friend_id', 'users.id') // joins user table
          .where('user_id', friendsId[i])
          .whereNotIn('friend_id', friendsIdWithUserId);
        friendsOfFriends = [...friendsOfFriends, ...friendsOfFriend];
      }
      for (let i = 0; i < friendsOfFriends.length; i++) {
        const friendOfFriendsDetails = await db('users')
          .where('id', friendsOfFriends[i].followed_by_id)
          .first();
        friendsOfFriends[i].followed_by_username =
          friendOfFriendsDetails.username;
        friendsOfFriends[i].followed_by_display_name =
          friendOfFriendsDetails.followed_by_display_name;
      }
      res.json(pickRandom(friendsOfFriends, 3));
    } else {
      // base case for a user that doesn't follow anyone
      const users = await db('friendships')
        .select(
          'friendships.friend_id as recommended_follow_id',
          'users.display_name',
          'users.profile_picture as image',
          'users.username'
        )
        .join('users', 'friendships.friend_id', 'users.id')
        .groupBy(
          'friendships.friend_id',
          'users.display_name',
          'users.username',
          'users.profile_picture'
        )
        .having('friendships.friend_id', '>', '2')
        .count('friendships.friend_id as followers')
        .limit(20);
      res.json(pickRandom(users, 3));
    }
  },

  // gets all user following with user data
  async getUserFollowing(req, res) {
    const id = req.query.id;

    try {
      const following = await db('friendships')
        .select(
          'users.id',
          'users.profile_picture',
          'users.display_name',
          'users.username'
        )
        .join('users', 'friendships.friend_id', '=', 'users.id')
        .where('friendships.user_id', id)
        .orderBy('friendships.created_at', 'desc');
      res.status(200).json(following);
    } catch (err) {
      res.status(400).json({ error: 'There was an error' });
    }
  },

  // gets all user followers with user data
  async getUserFollowers(req, res) {
    const id = req.query.id;

    try {
      const followers = await db('friendships')
        .select(
          'users.id',
          'users.profile_picture',
          'users.display_name',
          'users.username',
          'friendships.created_at'
        )
        .join('users', 'friendships.user_id', '=', 'users.id')
        .where('friendships.friend_id', id)
        .orderBy('friendships.created_at', 'desc');
      res.status(200).json(followers);
    } catch (err) {
      res.status(400).json({ error: 'There was an error' });
    }
  },

  async fixAvatars(req, res) {
    const users = await db('users');
    users.forEach(user => {
      if (!user.github_id && !user.google_id) {
        const avatarImageURL = faker.image.avatar();
        db('users')
          .update({ profile_picture: avatarImageURL })
          .where({ id: user.id })
          .returning('id')
          .then(user => console.log(user));
      }
    });
    res.send('done');
  }
};
