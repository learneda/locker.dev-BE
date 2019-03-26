const request = require('request');
const router = require('express').Router();
const Feed = require('rss-to-json');
const { extract } = require('article-parser');
const routeCache = require('route-cache');

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
      }
    }
  );
});

router.get('/articles', routeCache.cacheSeconds(60), (req, res) => {
  // fetch articles from fcc feed
  Feed.load('https://medium.freecodecamp.org/feed', function(err, rss) {
    const tempo_articles = rss.items.map(item => {
      // for each article, get its url and parse it
      let url = item.url;
      return extract(url)
        .then(article => ({
          title: article.title,
          description: article.description,
          thumbnail: article.image,
          created: article.publishedTime
        }))
        .catch(err => {
          console.log(err);
        });
    });
    Promise.all(tempo_articles).then(articles => {
      res.json(articles);
    });
  });
});

module.exports = router;
