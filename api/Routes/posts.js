const router = require('express').Router();
const db = require('../../dbConfig');
const urlMetadata = require('url-metadata');
// ==============================================
// this JS file includes helpers that access our
// database accordingly (for example, getUsers
// requests all the users in the users database)
// ==============================================
const postsDb = require('../helpers/postsHelper');

// GET ALL USER POST
router.get('/', (req, res) => {
  db('posts').where({user_id: req.body.user,}).then((rows) => {
    res.json({post: rows});
  })
})

// USER CREATING A POST 
router.post('/create', (req, res, next) => {
  const {user_id, categories, post_url} = req.body;
  db('posts').insert({
    user_id: user_id, completed: false, categories: categories, post_url: post_url
  }).then((createdPost) => {
    res.status(200).json({msg: createdPost});
  })
})

// router.post('/edit', (req, res, next) => {
//   db('posts').where({id: req.body.post_id}).then()
// })

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

module.exports = router;
