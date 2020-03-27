const db = require('../../dbConfig')
const urlMetadata = require('url-metadata')
const helpers = require('./postHelpers')

module.exports = {
  async getAllCurrentUserPost(req, res, next) {
    try {
      if (req.user) {
        const posts = await db('posts')
          .where({ user_id: req.user.id })
          .orderBy('id', 'desc')
        return res.status(200).json(posts)
      }
    } catch (err) {
      throw new Error('something went wrong')
    }
  },
  async getAllUserPosts(req, res, next) {
    const user_id = req.params.id
    try {
      const posts = await db('posts AS p')
        .select(
          'p.id',
          'p.post_url',
          'p.user_id',
          'p.title',
          'p.description',
          'p.user_thoughts',
          'p.created_at',
          'p.updated_at',
          'p.thumbnail_url',
          'p.root_url',
          'sp.saved_to_profile'
        )
        // joins saved_post_id boolean
        .leftJoin('saved_post_id AS sp', function() {
          this.on('p.id', 'sp.post_id')
        })
        .where({ 'p.user_id': user_id })
        .orderBy('p.id', 'desc')

      return res.status(200).json(posts)
    } catch (err) {
      throw new Error('something went wrong')
    }
  },

  async getPost(req, res, next) {
    const { id } = req.params
    try {
      if (id) {
        const post = await db('posts')
          .where({ id })
          .first()
        if (post) {
          res.status(200).json({ post })
        }
      }
    } catch (err) {
      res.status(500).json({ error: err })
    }
  },
  async createNewPost(req, res, next) {
    const { post_url, title, description, thumbnail_url } = req.body
    const user_id = req.user.id || req.body.userId
    const mediaTypes = ['book', 'video', 'podcast', 'course', 'article']

    // selecting type id from types tbl. type title string comes from request body
    if (req.body.type) {
      const type = await db('types')
        .select('id')
        .where('type_title', req.body.type)
        .first()

      if (mediaTypes.includes(req.body.type)) {
        try {
          //TODO: Gets root_url
          const newUrl = req.body.post_url.indexOf('http') > -1 ? req.body.post_url : `http://${req.body.post_url}`
          const rootUrl = new URL(newUrl).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]

          // creating new insert record
          const newPost = {
            root_url: rootUrl,
            post_url,
            user_id,
            title,
            description,
            thumbnail_url,
            type_id: type.id,
          }

          // inserting record
          const newInsert = await db('posts')
            .insert(newPost)
            .returning('*')

          if (newInsert) {
            return res.status(201).json(newInsert[0])
          } else {
            return res.status(300).json({ err: 'could not add new entry' })
          }
        } catch (err) {
          return res.status(500).json(err)
        }
      }
    }

    // if the type in request body in NOT book, video, or podcast.
    // will enter this if block
    if (req.user) {
      if (req.body.post_url) {
        if (!req.body.type_id) {
          req.body.type_id = 8
        }
        try {
          const newUrl = req.body.post_url.indexOf('http') > -1 ? req.body.post_url : `http://${req.body.post_url}`

          // gets root hostname for a URL
          const rootUrl = new URL(newUrl).hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]

          const metadata = await urlMetadata(newUrl)
          if (metadata.description === null) {
            metadata.description = 'No description'
          }
          if (metadata.title === null) {
            metadata.title = 'No title'
          }
          try {
            const newPost = {
              post_url: req.body.post_url,
              user_id: req.user.id,
              title: metadata.title,
              description: metadata.description,
              thumbnail_url: metadata.image,
              root_url: rootUrl,
              type_id: req.body.type_id,
            }
            const newInsert = await db('posts')
              .insert(newPost)
              .returning('*')
            if (newInsert) {
              res.status(201).json(newInsert[0])
            } else {
              res.status(300).json({ err: 'could not add new entry' })
            }
          } catch (err) {
            res.status(500).json(err)
          }
        } catch (err) {
          res.status(500).json({ err: 'could not add new entry' })
        }
      } else {
        res.status(400).json({ message: 'Please provide a post url ' })
      }
    } else {
      res.status(403).json({ error: 'Not authorized' })
    }
  },

  async deletePost(req, res, next) {
    const { id } = req.params
    if (req.user) {
      db('posts')
        .where({ id, user_id: req.user.id })
        .delete()
        .returning('*')
        .then(deletedRecord => {
          const deletedCollection = deletedRecord[0]
          res.status(200).json({ deletedRecord: deletedCollection, msg: 'delete successful' })
        })
        .catch(err => res.json({ msg: 'post id not found' }))
    } else {
      res.status(403).json({ error: 'Not authorized' })
    }
  },

  async socialLikePost(req, res, next) {
    const user_id = req.user.id
    const { id } = req.body
    if (!user_id || !id) {
      return res.status(400).json({ msg: 'requires user_id & post_id' })
    }
    if (req.user) {
      try {
        const insertPromise = await helpers.postsLikesInsert(user_id, id)
        if (insertPromise) {
          res.status(insertPromise.statusCode).json({ msg: 'success', insertRecord: insertPromise.response })
        }
      } catch (err) {
        res.status(500).json(err)
      }
    } else {
      res.status(401).json({ msg: 'unauthorized' })
    }
  },
  async deleteSocialLike(req, res, next) {
    const user_id = req.user.id
    // check if the record that I want to remove is owned by user_id
    try {
      const helper = await helpers.deleteSocialLike(...req.body, user_id)
      return res.status(helper.statusCode).json(helper.response)
    } catch (err) {
      // check if by throwing an error inside the helper will this get executed ?
      res.status(500).json(err)
    }
  },
  async getPostLikeCount(req, res, next) {
    const { post_id } = req.body
    try {
      const selectPromise = await db('posts_likes')
        .where({ post_id })
        .countDistinct('user_id')
      if (selectPromise) {
        res.status(200).json(selectPromise)
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },

  async getUsersWhoLikedPost(req, res, next) {
    const { post_id } = req.body
    try {
      const selectPromise = await db('posts_likes as pl')
        .where('post_id', post_id)
        .join('users as u', 'u.id', 'pl.user_id')
        .select('u.display_name', 'u.username', 'u.profile_picture')
        .distinct('pl.user_id')
      if (selectPromise) {
        res.status(200).json(selectPromise)
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },

  async getUsersWhoPonyPost(req, res, next) {
    const { post_id } = req.body
    try {
      const selectPromise = await db('posts_ponies as pp')
        .where('post_id', post_id)
        .join('users as u', 'u.id', 'pp.user_id')
        .select('u.display_name', 'u.username', 'u.profile_picture')
        .distinct('pp.user_id')
      if (selectPromise) {
        res.status(200).json(selectPromise)
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },
  async postPonyUp(req, res, next) {
    const user_id = req.user.id
    try {
      const helper = await helpers.postPonyUp(req.body.post_id, user_id)
      return res.status(helper.statusCode).json(helper.response)
    } catch (err) {
      return res.status(500).json(err)
    }
  },

  async postPonyDownAway(req, res, next) {
    const { post_id } = req.body
    try {
      const helper = await helpers.postPonyDownAway(post_id, req.user.id)
      return res.status(helper.statusCode).json(helper.response)
    } catch (err) {
      return res.status(500).json(err)
    }
  },

  async editPost(req, res, next) {
    const { id } = req.params
    const { post_url, title, description, user_thoughts } = req.body
    const shared = req.body.shared || false

    const editPromise = db('posts')
      .where({ id })
      .update({ post_url, title, description, user_thoughts, shared })
      .returning('*')
      .then(result => {
        const post = result[0]
        post['profile_picture'] = req.user.profile_picture
        post['post_id'] = post.id
        delete post.id
        res.status(200).json(post)
      })
      .catch(err => {
        res.status(500).json({ msg: 'something went wrong' })
      })
  },
  async assignPostToFolder(req, res, next) {
    const { folder_id, post_id } = req.body
    if (folder_id && post_id) {
      try {
        const updatePromose = await db('posts')
          .where({ id: post_id })
          .update({ folder_id: folder_id })
        if (updatePromose) {
          res.status(200).json({ msg: 'success' })
        } else {
          res.status(404).json({ error: 'something went wrong' })
        }
      } catch (err) {
        res.status(500).json({ err })
      }
    }
  },
  async getUserPostsCount(req, res, next) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id
    if (user_id) {
      try {
        const selectCountPromise = await db('posts')
          .where({ user_id: user_id })
          .count()
        if (selectCountPromise) {
          res.status(200).json(selectCountPromise)
        } else {
          res.status(303).json({ err: 'could not find user' })
        }
      } catch (err) {
        res.status(500).json(err)
      }
    } else {
      res.status(417).json({ err: '<user_id>' })
    }
  },
}
