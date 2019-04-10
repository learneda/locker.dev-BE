const db = require('../../dbConfig');
module.exports = {
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
        .join('users', 'users.id', 'posts.user_id');

      let friendArray = await db('friendships').where('user_id', user_id).select('friend_id')
      friendArray = friendArray.map(friend => friend.friend_id)
      friendArray.push(user_id)
      console.log(friendArray, user_id)
      const commentsPromise = await db('comments').join('users','comments.user_id', 'users.id').whereIn('user_id', friendArray)
      

      const newResponse = newsFeedPromise.map((post, index) => {
        post.comments = [];
        for (let i = 0; i < commentsPromise.length; i++) {
          if (commentsPromise[i].post_id === post.post_id) {
            console.log('HERE ERHERE HRERE',commentsPromise[i])
            post.comments.push(commentsPromise[i])
          }
        }
        return post
      });
 
      if (commentsPromise && newsFeedPromise) {
        res.status(200).json({newResponse});
      } else {
        res.status(404).json({ msg: 'looks like you need some friends' });
      }
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
  }

  // /* ===== TOTAL USER FOLLOWING ===== */
  // async getUserTotalFollowing(req, res, next) {
  //   const user_id = req.user === undefined ? req.body.user_id : req.user.id;
  //   // const friend_id = req.body.user_id;
  //   if (user_id) {
  //     try {
  //       const totalUserFollowing = await db('friendships')
  //         .where('user_id', user_id)
  //         .countDistinct('user_id', 'friend_id')
  //         .first();

  //       if (totalUserFollowing) {
  //         console.log(totalUserFollowing);
  //         res.status(200).json({ following: totalUserFollowing.count });
  //       } else {
  //         console.log(totalUserFollowing);
  //         res.status(201).json({ error: 'dis shit broke' });
  //       }
  //     } catch (err) {
  //       console.log('broken yo');
  //       console.log(err);
  //       res.status(500).json(err);
  //     }
  //   } else {
  //     console.log('not auth');
  //   }
  // }
};

// A USER'S TOTAL FOLLOWERS COUNT = SELECT COUNT(DISTINCT user_id) FROM public.friendships WHERE friend_id = 503

// A USER'S TOTAL FOLLOWING COUNT = SELECT COUNT(DISTINCT friend_id) FROM public.friendships WHERE user_id = 503
