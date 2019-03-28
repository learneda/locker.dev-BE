const request = require('request');
const router = require('express').Router();
const Feed = require('rss-to-json');
const { extract } = require('article-parser');
const routeCache = require('route-cache');
const urlMetadata = require('url-metadata');

router.get('/courses', routeCache.cacheSeconds(120), (req, res) => {
  request(
    {
      method: 'GET',
      uri: 'https://www.udemy.com/api-2.0/courses',
      auth: {
        username: process.env.UDEMY_ID,
        password: process.env.UDEMY_SECRET
      },
      headers: { 'User-Agent': 'Mozilla/5.0' }
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const temp_courses = JSON.parse(body).results.map(course => {
          let url = course.url;
          return urlMetadata(`https://www.udemy.com${url}`)
            .then(metadata => ({
              title: metadata.title,
              description: metadata.description,
              thumbnail: metadata.image,
              url: metadata.url
            }))
            .catch(err => {
              console.log(err);
            });
        });
        console.log('HELLOOOO', temp_courses);
        Promise.all(temp_courses).then(courses => {
          res.json(courses);
        });
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
          created: article.publishedTime,
          url: url
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
