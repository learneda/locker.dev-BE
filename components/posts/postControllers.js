const db = require('../../dbConfig');
const urlMetadata = require('url-metadata');

module.exports = {
  async getAllUserPosts (req, res, next) {
    try {
      const posts = await db('posts').where({ user_id: req.user.id });
        return res.status(200).json(posts);
    } catch (err) {
      console.log(err);
    }
  },

  async getAllSharedPost (req, res, next) {
    const user_id = req.user.id;
    try {
      const sharedPostPromise = await db('posts').where({
        user_id,
        recommended: true
      });
      if (sharedPostPromise) {
        console.log(sharedPostPromise)
        res.status(200).json({postsArr: sharedPostPromise});
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({error: err});
    }
  },
  async getPost (req, res, next) {
    const { id } = req.params;
    try {
    if (id) {
      const post = await db('posts').where({id}).first();
      if (post) {
        res.status(200).json({post});
        }
      }
    } catch (err) {
      res.status(500).json({error: err});
    }
  },
  async createNewPost(req, res, next) {
    console.log('this is the req user', req.user, req.isAuthenticated());
    if (req.body.post_url && req.body.id) {
      try {
        const newUrl =
          req.body.post_url.indexOf('http') > -1
            ? req.body.post_url
            : `http://${req.body.post_url}`;
        const metadata = await urlMetadata(newUrl);
        try {
          const newInsert = await db('posts').insert({
            post_url: req.body.post_url,
            user_id: req.body.id,
            title: metadata.title,
            description: metadata.description,
            thumbnail_url: metadata.image
          });
          if (newInsert) {
            res.status(201).json({ message: 'Post was successfully added :)' });
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
  },
  async deletePost (req, res, next) {
    const id = req.params.id
    console.log('IN HERE',id)
    try {
      const deletePromise = await db('posts').where({id}).delete();
      if (deletePromise) {
        res.status(200).json({ success: 'post deleted' });
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'There was an error on the server' });
    }
  },
  async likePost (req, res, next) {
    const id = req.params.id
    const status = req.body.status
    try {
      const likePromise = await db('posts')
        .where({id})
        .update({ liked : status});
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
  async editPost (req, res, next) {
    const id = req.params.id;
    const {post_url, title, description} = req.body;
    try {
      const editPromise = await db('posts')
      .where({id})
      .update({post_url, title, description});
      if (editPromise) {
        res.status(200).json({success: 'post updated'});
      } else {
        res.status(404).json({error: 'something went wrong'});
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({err});
    }
  }
}