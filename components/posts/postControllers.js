const db = require('../../dbConfig');
const urlMetadata = require('url-metadata');

module.exports = {
  async getAllCurrentUserPost(req, res, next) {
    try {
      const posts = await db('posts')
        .where({ user_id: req.user.id })
        .orderBy('id', 'asc');
      return res.status(200).json(posts);
    } catch (err) {
      console.log(err);
    }
  },
  async getAllUserPosts(req, res, next) {
    const user_id = req.params.id;
    try {
      const posts = await db('posts')
        .where({ user_id: user_id })
        .orderBy('id', 'asc');

      return res.status(200).json(posts);
    } catch (err) {
      console.log(err);
    }
  },

  async getAllUserPostsLiked(req, res, next) {
    // const authUserId = req.user.id;
    // const userId = req.body.user_id;
    if (req.user) {
      try {
        const posts = await db('posts')
          .where({
            liked: true,
            user_id: req.user.id
          })
          .orderBy('id', 'asc');
        // .join('posts', 'posts.id', 'posts_likes.post_id')
        // .join('users', 'posts.user_id', 'users.id');
        // .orderBy('posts_likes.created_at', 'asc');
        console.log(posts);
        return res.status(200).json(posts);
      } catch (err) {
        console.log(err);
      }
    } else if (req.body.user_id) {
      try {
        const posts = await db('posts')
          .where({
            liked: true,
            user_id: req.body.user_id
          })
          .orderBy('id', 'asc');
        return res.status(200).json(posts);
      } catch (err) {
        console.log(err);
      }
    } else {
      res.status(403).json({ error: 'Not authorized' });
    }
  },

  async getAllSharedPost(req, res, next) {
    if (req.user) {
      const user_id = req.user.id;
      try {
        const sharedPostPromise = await db('posts').where({
          user_id,
          recommended: true
        });
        if (sharedPostPromise) {
          console.log(sharedPostPromise);
          res.status(200).json({ postsArr: sharedPostPromise });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
      }
    } else {
      res.status(403).json({ error: 'Not authorized' });
    }
  },
  async getPost(req, res, next) {
    const { id } = req.params;
    try {
      if (id) {
        const post = await db('posts')
          .where({ id })
          .first();
        if (post) {
          res.status(200).json({ post });
        }
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
  async createNewPost(req, res, next) {
    if (req.user) {
      if (req.body.post_url && req.body.id) {
        try {
          const newUrl =
            req.body.post_url.indexOf('http') > -1
              ? req.body.post_url
              : `http://${req.body.post_url}`;
          const metadata = await urlMetadata(newUrl);
          metadata.description === null
            ? (metadata.description = 'No description')
            : (metadata.description = metadata.description);
          metadata.title === null
            ? (metadata.title = 'No title')
            : (metadata.title = metadata.title);
          metadata.image === null
            ? (metadata.image = '')
            : (metadata.image = metadata.image);
          try {
            const newPost = {
              post_url: req.body.post_url,
              user_id: req.body.id,
              title: metadata.title,
              description: metadata.description,
              thumbnail_url: metadata.image
            };
            const newInsert = await db('posts').insert(newPost);
            console.log(newPost);
            if (newInsert) {
              res.status(201).json(newPost);
            } else {
              res.status(300).json({ err: 'couldnt add new entry' });
            }
          } catch (err) {
            console.log('META ERROR', err);
            res.status(500).json(err);
          }
        } catch (err) {
          console.log('META ERROR', err);
          res.status(300).json({ err: 'couldnt add new entry' });
        }
      } else {
        res
          .status(400)
          .json({ message: 'Please provide a post url and a user id :)' });
      }
    } else {
      res.status(403).json({ error: 'Not authorized' });
    }
  },
  async deletePost(req, res, next) {
    const id = req.params.id;
    console.log('IN HERE', id);
    if (req.user) {
      try {
        const deletePromise = await db('posts')
          .where({ id, user_id: req.user.id })
          .delete();
        if (deletePromise) {
          res.status(200).json({ success: 'post deleted' });
        } else {
          res.status(404).json({ error: 'Post not found' });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'There was an error on the server' });
      }
    } else {
      res.status(403).json({ error: 'Not authorized' });
    }
  },
  async likePost(req, res, next) {
    const id = req.params.id;
    const status = req.body.status;
    try {
      const likePromise = await db('posts')
        .where({ id })
        .update({ liked: status });
      if (likePromise) {
        res.status(200).json({ success: 'posted liked' });
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'There was an error on the server' });
    }
  },
  async socialLikePost(req, res, next) {
    const user_id = req.user.id;
    const post_id = req.body.post_id;
    if (req.user) {
      try {
        const insertPromise = await db('posts_likes').insert({
          user_id,
          post_id
        });
        if (insertPromise) {
          res.status(200).json({ msg: 'success' });
        } else {
          res.status(200).json({ msg: 'requires user_id & post_id' });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      res.status(401).json({ msg: 'unauthorized' });
    }
  },
  async getPostLikeCount(req, res, next) {
    const post_id = req.body.post_id;
    try {
      const selectPromise = await db('posts_likes')
        .where({ post_id })
        .countDistinct('user_id');
      if (selectPromise) {
        res.status(200).json(selectPromise);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async getUsersWhoLikedPost(req, res, next) {
    const post_id = req.body.post_id;
    // console.log(post_id, '⛵️', req.body);
    try {
      const selectPromise = await db('posts_likes')
        .where('post_id', post_id)
        .distinct('user_id');
      if (selectPromise) {
        res.status(200).json(selectPromise);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async editPost(req, res, next) {
    const id = req.params.id;
    const { post_url, title, description } = req.body;
    try {
      const editPromise = await db('posts')
        .where({ id })
        .update({ post_url, title, description });
      if (editPromise) {
        res.status(200).json({ success: 'post updated' });
      } else {
        res.status(404).json({ error: 'something went wrong' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },
  async assignPostToFolder(req, res, next) {
    const { folder_id, post_id } = req.body;
    if (folder_id && post_id) {
      try {
        const updatePromose = await db('posts')
          .where({ id: post_id })
          .update({ folder_id: folder_id });
        if (updatePromose) {
          res.status(200).json({ msg: 'success' });
        } else {
          res.status(404).json({ error: 'something went wrong' });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ err });
      }
    }
  },
  async getUserPostsCount(req, res, next) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id;
    if (user_id) {
      try {
        const selectCountPromise = await db('posts')
          .where({ user_id: user_id })
          .count();
        if (selectCountPromise) {
          res.status(200).json(selectCountPromise);
        } else {
          res.status(303).json({ err: 'couldnt find user' });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      res.status(417).json({ err: '<user_id>' });
    }
  }
};
