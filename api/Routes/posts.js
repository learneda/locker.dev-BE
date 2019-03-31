const router = require('express').Router();
const DB = require('../../dbConfig');
const urlMetadata = require('url-metadata');
// ==============================================
// this JS file includes helpers that access our
// database accordingly (for example, getUsers
// requests all the users in the users database)
// ==============================================
const postsDb = require('../helpers/postsHelper');

router.get('/posts', async (req, res) => {
  try {
    const posts = await DB('posts').where({ user_id: req.user.id });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
  }
});

router.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const posts = await postsDb.get(id);
  res.status(200).send(posts);
});

router.post('/posts', async (req, res) => {
  console.log('this is the req user', req.user, req.isAuthenticated());
  if (req.body.post_url && req.body.id) {
    try {
      const newUrl = req.body.post_url.indexOf('http') > -1 ? req.body.post_url : `http://${req.body.post_url}`;
      const metadata = await urlMetadata(newUrl);
      try {
        const newInsert = postsDb.insert({
          post_url: req.body.post_url,
          user_id: req.body.id,
          title: metadata.title,
          description: metadata.description,
          thumbnail_url: metadata.image
        });
        if (newInsert) {
          res.status(201).json({ message: 'Post was successfully added :)' });
        } else {
          res.status(300).json({err: 'couldnt add new entry'});
        }
      }
      catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      console.log('META ERROR', err);
      res.status(300).json({err: 'couldnt add new entry'});
    }
  } else {
    res
      .status(400)
      .json({ message: 'Please provide a post url and a user id :)' });
  }
});


/* ===== DELETE POST || TODO: MAKE ROUTE SECURE  ===== */
router.delete('/posts/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletePromise = await DB('posts')
      .where('id', id)
      .delete()
      if (deletePromise) {
        res.status(200).json({ success: 'post deleted' });
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'There was an error on the server' });
  }
});

module.exports = router;
