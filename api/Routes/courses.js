const request = require('request');
const router = require('express').Router();

router.get('/courses', (req, res) => {
  request(
    {
      method: 'GET',
      uri: 'https://www.udemy.com/api-2.0/courses',
      auth: {
        username: process.env.UDEMY_ID,
        password: process.env.UDEMY_SECRET
      }
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        res.json(JSON.parse(body));
      } else {
        res.json({err: error});
      }
    }
  );
});

module.exports = router;
