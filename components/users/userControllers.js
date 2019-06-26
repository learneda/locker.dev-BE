const db = require('../../dbConfig')
const faker = require('faker')

module.exports = {
  async getAllUsers(req, res, next) {
    const user = req.user
    if (user) {
      try {
        const users = await db('users')
        // console.log('users', users);
        return res.status(200).json(users)
      } catch (err) {
        console.log(err)
        res.status(500).json(err)
      }
    } else {
      res.status(400).json({ err: 'not allowed' })
    }
  },
  async editProfile(req, res, next) {
    const { id } = req.body
    const {
      profile_picture,
      displayName,
      username,
      bio,
      location,
      websiteUrl,
      email,
    } = req.body
    if (id) {
      try {
        const user = await db('users')
          .where({ id })

          .update({
            display_name: displayName,
            website_url: websiteUrl,
            profile_picture,
            username,
            bio,
            location,
            email,
          })
          .returning([
            'username',
            'display_name',
            'profile_picture',
            'bio',
            'email',
            'location',
            'website_url',
            'created_at as createdAt',
            'header_picture',
          ])
        if (user) {
          res.status(200).json(user[0])
        } else {
          res.status(400).json({ err: 'something went wrong' })
        }
      } catch (err) {
        console.log(err)
        res.status(500).json(err)
      }
    } else {
      res.status(400).json({ err: 'not allowed' })
    }
  },
  async getUserById(req, res, next) {
    const id = req.params.id || req.user.id
    // console.log(typeof id);
    try {
      const user = await db('users')
        .where({ id: id })
        .select(
          'id',
          'username',
          'display_name',
          'profile_picture',
          'bio',
          'email',
          'location',
          'website_url',
          'created_at as createdAt',
          'header_picture'
        )
        .first()
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ msg: 'user not found..' })
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },
  async getUserDetailsByUserName(req, res, next) {
    const username = req.params.username
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
        )
      if (selectPromise) {
        res.status(200).json(selectPromise)
      } else {
        res.status(404).json({ msg: 'user not found..' })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  async subscribeToUser(req, res, next) {
    const user_id = req.body.user_id
    const friend_id = req.body.friend_id
    try {
      const insertPromise = await db('friendships')
        .insert({
          user_id,
          friend_id,
        })
        .returning('*')
        .then(result => {
          const data = result[0]
          console.log(data)
          res.status(200).json(data)
        })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  async unsubscribeToUser(req, res, next) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id
    const friend_id = req.body.friend_id
    try {
      const deletePromise = await db('friendships')
        .where({ user_id, friend_id })
        .del()
        .returning('*')
        .then(result => {
          console.log(result[0])
          res.status(200).json(result[0])
        })
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },

  /* ===== USER FOLLOWERS AND FOLLOWING COUNT ===== */
  async getUserFollowStats(req, res, next) {
    const user_id = Number(req.params.id)
    try {
      const totalUserFollowers = await db('friendships')
        .where('friend_id', user_id)
        .countDistinct('user_id', 'friend_id')
        .first()

      const totalUserFollowing = await db('friendships')
        .where('user_id', user_id)
        .countDistinct('user_id', 'friend_id')
        .first()

      if (totalUserFollowers) {
        res.status(200).json({
          followers: totalUserFollowers.count,
          following: totalUserFollowing.count,
        })
      } else {
        res.status(201).json({ error: 'BROKEN' })
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },

  async getFollowing(req, res, next) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id
    const friend_id = req.params.id
    try {
      const following = await db('friendships').where({
        user_id: user_id,
        friend_id: friend_id,
      })
      if (following.length) {
        res.status(200).json({
          following: true,
        })
      } else {
        res.status(200).json({ following: false })
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },

  async recommendedFollow(req, res, next) {
    const user_id = req.query.id
    const count = Number(req.query.count) || 3
    let friendsOfFriends = []
    // makes an array with user_id's that I follow
    const friends = await db('friendships').where('user_id', user_id)
    const friendsId = friends.map(friend => friend.friend_id)
    const friendsIdWithUserId = [...friendsId, user_id]

    //* Creates a new array with random elements from ARR (no duplicates) [should be a utility import]
    const pickRandom = (arr, count) => {
      let _arr = [...arr]
      return [...Array(count)].map(
        () => _arr.splice(Math.floor(Math.random() * _arr.length), 1)[0]
      )
    }
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
          .whereNotIn('friend_id', friendsIdWithUserId)
        friendsOfFriends = [...friendsOfFriends, ...friendsOfFriend]
      }
      for (let i = 0; i < friendsOfFriends.length; i++) {
        const friendOfFriendsDetails = await db('users')
          .where('id', friendsOfFriends[i].followed_by_id)
          .first()
        friendsOfFriends[i].followed_by_username =
          friendOfFriendsDetails.username
        friendsOfFriends[i].followed_by_display_name =
          friendOfFriendsDetails.followed_by_display_name
      }
      if (friendsOfFriends.length < count) {
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
          // .count('friendships.friend_id as followers')
          .limit(20)
        return res.json(pickRandom(users, count))
      }
      const randomSuggestions = pickRandom(friendsOfFriends, count)
      return res.json(pickRandom(friendsOfFriends, count))
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
        .limit(20)

      res.json(pickRandom(users, count))
    }
  },

  // gets all user following with user data
  async getUserFollowing(req, res) {
    const id = req.query.id

    try {
      const following = await db('friendships')
        .select(
          'users.id',
          'users.profile_picture',
          'users.display_name',
          'users.username',
          'users.bio'
        )
        .join('users', 'friendships.friend_id', '=', 'users.id')
        .where('friendships.user_id', id)
        .orderBy('friendships.created_at', 'desc')
      res.status(200).json(following)
    } catch (err) {
      res.status(400).json({ error: 'There was an error' })
    }
  },

  // gets all user followers with user data
  async getUserFollowers(req, res) {
    const id = req.query.id

    try {
      const followers = await db('friendships')
        .select(
          'users.id',
          'users.profile_picture',
          'users.display_name',
          'users.username',
          'users.bio',
          'friendships.created_at'
        )
        .join('users', 'friendships.user_id', '=', 'users.id')
        .where('friendships.friend_id', id)
        .orderBy('friendships.created_at', 'desc')
      res.status(200).json(followers)
    } catch (err) {
      res.status(400).json({ error: 'There was an error' })
    }
  },

  async fixAvatars(req, res) {
    const users = await db('users')
    users.forEach(user => {
      if (!user.github_id && !user.google_id) {
        const avatarImageURL = faker.image.avatar()
        db('users')
          .update({ profile_picture: avatarImageURL })
          .where({ id: user.id })
          .returning('id')
          .then(user => console.log(user))
      }
    })
    res.send('done')
  },
  async getSavedPostIds(req, res) {
    const user_id = req.query.user_id
    const saved_from_id = req.query.saved_from_id
    try {
      const savedPostIds = await db('saved_post_id')
        .where('user_id', user_id)
        .andWhere('saved_from_id', saved_from_id)

      res.json(savedPostIds)
    } catch (err) {
      res
        .status(400)
        .json({ error: 'there was an error due to my sloppy code' })
      console.log(err)
    }
  },
  async savePostId(req, res) {
    const user_id = req.user ? req.user.id : req.body.user_id
    const { post_id, saved_from_id, created_post_id } = req.body
    const post = {
      post_id,
      user_id,
      saved_from_id,
      created_post_id: Number(created_post_id),
    }
    try {
      const saveNewPostId = await db('saved_post_id').insert(post)
      res.status(200).json('post saved')
    } catch (err) {
      res.status(400).json(err)
      console.log(err)
    }
  },
  async deleteSavedPostIds(req, res, next) {
    const deletion = await db('saved_post_id')
      .del()
      .where('created_post_id', req.params.id)
    if (deletion) {
      res.status(200).json('post deleted')
    } else {
      res.status(500).json('something went wrong')
    }
  },
  async getPostsCount(req, res, next) {
    const userId = Number(req.params.id)
    if (userId) {
      try {
        const count = await db('newsfeed_posts as n')
          .where('n.user_id', userId)
          .count()
          .first()
        if (count) {
          res.status(200).json(count)
        }
      } catch (err) {
        res.status(500).json(err)
      }
    } else {
      res.status(400).json({msg: 'bad request'})
    }
  },
}
