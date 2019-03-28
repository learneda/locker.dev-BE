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
  console.log(req.user);
  const posts = await DB('posts').where({ user_id: req.user.id });
  // const postUrl = posts[0].post_url;
  let test = [];
  const newPost = await Promise.all(
    posts.map(post => {
      return urlMetadata(post.post_url);
    })
  );
  const postsWithMetadata = posts.map((post, index) => {
    const { title, description, url } = newPost[index];
    post.metadata = { title, description, url };
    return post;
  });
  res.status(200).send(postsWithMetadata);
});

router.get('/post', (req, res) => {
  urlMetadata(`${req.query.url}`).then(
    function(metadata) {
      res.json(metadata);
    },
    function(error) {
      console.log(error);
    }
  );
});

router.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const posts = await postsDb.get(id);
  res.status(200).send(posts);
});

router.post('/posts', async (req, res) => {
  if (req.body.post_url && req.body.user_id) {
    try {
      await postsDb.insert(req.body);
      res.status(201).json({ message: 'Post was successfully added :)' });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res
      .status(400)
      .json({ message: 'Please provide a post url and a user id :)' });
  }
});

module.exports = router;
