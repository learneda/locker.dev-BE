const faker = require('faker')
const db = require('../../dbConfig')

module.exports = {
  async getAllUsers(req, res, next) {
    const { user } = req
    if (user) {
      try {
        const users = await db('users')
        return res.status(200).json(users)
      } catch (err) {
        return res.status(500).json(err)
      }
    } else {
      return res.status(400).json({ err: 'not allowed' })
    }
  },
  async editProfile(req, res, next) {
    const { id } = req.body
    const { profile_picture, display_name, username, bio, location, website_url, email } = req.body
    if (id) {
      try {
        const user = await db('users')
          .where({ id })

          .update({
            display_name,
            website_url,
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
        res.status(500).json(err)
      }
    } else {
      res.status(400).json({ err: 'not allowed' })
    }
  },
  async getUserById(req, res, next) {
    const id = req.params.id || req.user.id
    try {
      const user = await db('users')
        .where({ id })
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
    const { username } = req.params
    try {
      const selectPromise = await db('users')
        .where({ username })
        .select('username', 'display_name', 'profile_picture', 'bio', 'location', 'website_url')
      if (selectPromise) {
        res.status(200).json(selectPromise)
      } else {
        res.status(404).json({ msg: 'user not found..' })
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },
  async subscribeToUser(req, res, next) {
    const { user_id } = req.body
    const { friend_id } = req.body
    try {
      const insertPromise = await db('friendships')
        .insert({
          user_id,
          friend_id,
        })
        .returning('*')
        .then(result => {
          const data = result[0]
          res.status(200).json(data)
        })
    } catch (err) {
      res.status(500).json(err)
    }
  },
  async unsubscribeToUser(req, res, next) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id
    const { friend_id } = req.body
    try {
      const deletePromise = await db('friendships')
        .where({ user_id, friend_id })
        .del()
        .returning('*')
        .then(result => {
          res.status(200).json(result[0])
        })
    } catch (err) {
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

  async getFollowing(req, res) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id
    const friend_id = req.params.id
    try {
      const following = await db('friendships').where({
        user_id,
        friend_id,
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
    // makes an array with user_id's that I follow
    const friends = await db('friendships').where('user_id', user_id)
    const friendsId = friends.map(friend => friend.friend_id)
    const friendsIdWithUserId = [...friendsId, user_id]

    //* Creates a new array with random elements from ARR (no duplicates) [should be a utility import]
    const pickRandom = (arr, arrLength) => {
      return [...Array(arrLength)].map(() => arr.splice(Math.floor(Math.random() * arr.length), 1)[0])
    }
    if (friendsId.length) {
      const promises = []
      // generates an array of users that people I follow are following
      for (let i = 0; i < friendsId.id; i += 1) {
        const friendsOfFriend = db('friendships')
          .select(
            'friendships.friend_id as recommended_follow_id',
            'friendships.user_id as followed_by_id',
            'u2.username as followed_by_username',
            'u2.display_name as followed_by_display_name',
            'u1.profile_picture as image',
            'u1.display_name',
            'u1.username',
            'u1.bio',
            'u1.location'
          )
          .join('users as u1', 'friendships.friend_id', 'u1.id') // joins user table
          .join('users as u2', 'friendships.user_id', 'u2.id')
          .where('user_id', friendsId[i])
          .whereNotIn('friend_id', friendsIdWithUserId)
        promises.push(friendsOfFriend)
      }

      const resolvedPromises = await Promise.all(promises)
      // if current user doesn't follow more than 3 people to ensure some suggestions, lets just get some random users to suggest
      if (resolvedPromises.length < count) {
        const users = await db('friendships')
          .select(
            'friendships.friend_id as recommended_follow_id',
            'users.display_name',
            'users.profile_picture as image',
            'users.username'
          )
          .join('users', 'friendships.friend_id', 'users.id')
          .groupBy('friendships.friend_id', 'users.display_name', 'users.username', 'users.profile_picture')
          .having('friendships.friend_id', '>', '2')
          .limit(20)
        return res.json(pickRandom(users, count))
      }
      // else lets use our resolvePromises arr
      const friendsOfFriends = pickRandom(resolvedPromises.flat(), count)
      return res.json(friendsOfFriends)
    }
    // base case for a user that doesn't follow anyone
    const users = await db('friendships')
      .select(
        'friendships.friend_id as recommended_follow_id',
        'users.display_name',
        'users.profile_picture as image',
        'users.username'
      )
      .join('users', 'friendships.friend_id', 'users.id')
      .groupBy('friendships.friend_id', 'users.display_name', 'users.username', 'users.profile_picture')
      .having('friendships.friend_id', '>', '2')
      .count('friendships.friend_id as followers')
      .limit(20)

    return res.json(pickRandom(users, count))
  },

  // gets all user following with user data
  async getUserFollowing(req, res) {
    const { id } = req.query

    try {
      const following = await db('friendships')
        .select('users.id', 'users.profile_picture', 'users.display_name', 'users.username', 'users.bio')
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
    const { id } = req.query

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
      }
    })
    res.send('done')
  },
  async getSavedPostIds(req, res) {
    const { user_id } = req.query
    const { saved_from_id } = req.query
    try {
      const savedPostIds = await db('saved_post_id')
        .where('user_id', user_id)
        .andWhere('saved_from_id', saved_from_id)

      res.json(savedPostIds)
    } catch (err) {
      res.status(400).json({ error: 'there was an error due to my sloppy code' })
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
      res.status(400).json({ msg: 'bad request' })
    }
  },
}
