const db = require('../../dbConfig');
module.exports = {
  async getAllUsers(req, res, next) {
    const user = req.user;
    if (user) {
      try {
        const users = await db('users');
        console.log('users', users);
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
    console.log('REQ.BODY', req.body);
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
    console.log(typeof id);
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
    try {
      const newsFeedPromise = await db('friendships')
        .join('posts', function() {
          this.on('friendships.friend_id', '=', 'posts.user_id').orOn(
            'posts.user_id',
            '=',
            user_id
          );
        })
        .where('friendships.user_id', user_id)
        .orWhere('posts.user_id', '=', user_id)
        .select(
          'users.username',
          'posts.id as post_id',
          'users.profile_picture',
          'posts.user_id',
          'post_url',
          'title',
          'description',
          'thumbnail_url',
          'posts.created_at',
          'posts.updated_at'
        )
        .distinct()
        .join('users', 'users.id', 'posts.user_id')
        .orderBy('created_at', 'desc');

      let friendArray = await db('friendships')
        .where('user_id', user_id)
        .select('friend_id');
      friendArray = friendArray.map(friend => friend.friend_id);
      friendArray.push(user_id);
      console.log(friendArray, user_id);

      const commentsPromise = await db('comments')
        .select(
          'comments.id',
          'comments.content',
          'posts.id as post_id',
          'users.id as user_id',
          'users.username',
          'comments.created_at'
        )
        .join('posts', 'posts.id', 'comments.post_id')
        .join('users', 'users.id', 'comments.user_id');

      const newResponse = newsFeedPromise.map((post, index) => {
        post.comments = [];
        for (let i = 0; i < commentsPromise.length; i++) {
          if (commentsPromise[i].post_id === post.post_id) {
            post.comments.push(commentsPromise[i]);
          }
        }
        return post;
      });

      const likeLoop = async () => {
        for (let post of newsFeedPromise) {
          const likeCount = await db('posts_likes')
            .where('post_id', post.post_id)
            .countDistinct('user_id');
          post.likes = Number(likeCount[0].count);
        }
        if (newResponse) {
          console.log(newResponse);
          res.status(200).json({ newResponse });
        } else {
          res.status(404).json({ msg: 'looks like you need some friends' });
        }
      };
      likeLoop();
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
      if (following) {
        res.status(200).json({
          following: following
        });
      } else {
        res.status(201).json({ error: 'BROKEN' });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async recommendedFollow(req, res, next) {
    const user_id = req.query.id;
    let recommendedFollowArray = [];
    let followArray = [];

    // makes an array with user_id's that I follow
    const following = await db('friendships')
      .where('user_id', user_id)
      .then(users => {
        users.map(user => followArray.push(user.friend_id));
      });

    if (followArray.length > 0) {
      // generates an array of users that people I follow are following
      for (let i = 0; i < followArray.length; i++) {
        let randomIndex = Math.floor(Math.random() * followArray.length);

        // picks a random user that I follow
        let randomFollowing = followArray[randomIndex];

        // checks the following of the random person that I follow
        randomRecommendedFollow = await db('friendships')
          .select(
            'friendships.friend_id as recommended_follow_id',
            'friendships.user_id as followed_by_id',
            'users.profile_picture',
            'users.display_name',
            'users.username',
            'users.bio',
            'users.location'
          )
          .join('users', 'friendships.friend_id', 'users.id') // joins user table
          .where('user_id', randomFollowing)
          .distinct()

          .then(data => {
            // creates object and pushed to array with needed data
            data.map(user => {
              db('users')
                .where('id', user.followed_by_id)
                .then(followedByData => {
                  followedByData.forEach(followedBy => {
                    recommendedFollowArray.push({
                      recommended_follow_id: user.recommended_follow_id,
                      followed_by_id: user.followed_by_id,
                      followed_by_username: followedBy.username,
                      followed_by_display_name: followedBy.display_name,
                      image: user.profile_picture,
                      display_name: user.display_name,
                      username: user.username,
                      bio: user.bio,
                      location: user.location
                    });
                  });
                });
            });
          });
      }

      //  uses Fisher-Yates shuffle algorithm to generate 3 unique indexes
      let recommendedFollow = [];
      const n1 = recommendedFollowArray.length;
      let pool = [...Array(n1).keys()];

      while (recommendedFollow.length < 3) {
        let randomIndex = Math.floor(Math.random() * pool.length);
        recommendedFollow.push(
          recommendedFollowArray[pool.splice(randomIndex, 1)]
        );
      }

      res.json(recommendedFollow);
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

      users.map(user => console.log(user), recommendedFollowArray.push(user));
      let recommendedFollow = [];
      for (let i = 0; i < 3; i++) {
        let randomIndex = Math.floor(
          Math.random() * recommendedFollowArray.length
        );
        recommendedFollow.push(recommendedFollowArray[randomIndex]);
      }
      res.json(recommendedFollow);
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
  }
};
