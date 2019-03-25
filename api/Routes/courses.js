const request = require('request');
const router = require('express').Router();

router.get('/courses', function(req, res) {
  request(
    {
      method: 'GET',
      uri: 'https://www.udemy.com/api-2.0/courses',
      auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET
      }
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        res.json(JSON.parse(body));
      }
    }
  );
});

module.exports = router;
