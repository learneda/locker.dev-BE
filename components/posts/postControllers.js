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
          'sp.saved_to_profile'
        )
        // joins saved_post_id boolean
        .leftJoin('saved_post_id AS sp', function() {
          this.on('p.id', 'sp.post_id');
        })
        .where({ 'p.user_id': user_id })
        .orderBy('p.id', 'asc');

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
      if (req.body.post_url) {
        try {
          const newUrl =
            req.body.post_url.indexOf('http') > -1
              ? req.body.post_url
              : `http://${req.body.post_url}`;

          // gets root hostname for a URL
          let rootUrl = new URL(newUrl);
          rootUrl = rootUrl.hostname
            .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
            .split('/')[0];

          const metadata = await urlMetadata(newUrl);
          // console.log(metadata);
          metadata.description === null
            ? (metadata.description = 'No description')
            : (metadata.description = metadata.description);
          metadata.title === null
            ? (metadata.title = 'No title')
            : (metadata.title = metadata.title);
          metadata.image === null
            ? (metadata.image = null)
            : (metadata.image = metadata.image);
          try {
            const newPost = {
              post_url: req.body.post_url,
              user_id: req.user.id,
              title: metadata.title,
              description: metadata.description,
              thumbnail_url: metadata.image,
              root_url: rootUrl
            };
            const newInsert = await db('posts').insert(newPost);
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
        res.status(400).json({ message: 'Please provide a post url ' });
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
    const { post_url, title, description, user_thoughts } = req.body;
    const shared = req.body.shared || false;
    console.log(req.body, req.params.id, 'HEREHRHEHHEHE');
    try {
      const editPromise = await db('posts')
        .where({ id })
        .update({ post_url, title, description, user_thoughts, shared });
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
  },

  async shareBookmark(req, res, next) {
    console.log('in share bookmarks', req.body, req.user.id);
    try {
      const insertToNewsfeedPosts = await db('newsfeed_posts').insert({
        user_id: req.user.id,
        post_id: req.body.id
      });
      if (insertToNewsfeedPosts) {
        res.status(200).json({ success: 'posted' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async unshareBookmark(req, res, next) {
    console.log('req.body ==>', req.body);
    try {
      await db('newsfeed_posts')
        .del()
        .where({
          user_id: req.user.id,
          post_id: req.body.id
        });
      res.status(200).json({ success: 'deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async getSharedBookmark(req, res, next) {
    const bookmarkPost = await db('newsfeed_posts')
      .where({ post_id: req.params.id })
      .join('posts', 'posts.id', 'newsfeed_posts.post_id')
      .join('users', 'posts.user_id', 'users.id');

    const attachingCommentsNLikesLoop = async () => {
      for (let post of bookmarkPost) {
        post.comments = [];

        const commentArray = await db('comments as c')
          .select(
            'c.id',
            'c.created_at',
            'c.content',
            'c.user_id',
            'c.post_id',
            'u.username'
          )
          .where('c.post_id', '=', post.post_id)
          .join('users as u', 'c.user_id', 'u.id');
        post.comments.push(...commentArray);

        const likeCount = await db('posts_likes')
          .where('post_id', post.post_id)
          .countDistinct('user_id');
        console.log(likeCount[0].count);
        post.likes = Number(likeCount[0].count);
      }
      if (bookmarkPost) {
        res.status(200).json(bookmarkPost);
      } else {
        throw new Error('newsFeedError');
      }
    };

    attachingCommentsNLikesLoop();
  }
};
