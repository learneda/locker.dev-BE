const request = require('request');
const Feed = require('rss-to-json');
const urlMetadata = require('url-metadata');
const db = require('../../dbConfig');

module.exports = {
  getCourses(req, res, next) {
    const page = req.query.page;
    let queryParams = {
      'fields[course]': 'title,headline,image_480x270,url'
    };
    request(
      {
        method: 'GET',
        uri: `https://www.udemy.com/api-2.0/courses?page=${page}`,
        qs: queryParams,
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
  },
  async getArticles(req, res, next) {
   const articles = await db('articles').select()
   if (articles) {
    res.json(articles);
  }
  }
};
setInterval(() => {
 Feed.load('https://medium.freecodecamp.org/feed', function(err, rss) {
      const tempo_articles = rss.items.map(item => {
        // for each article, get its url and parse it
        let url = item.url;
        return urlMetadata(url)
          .then(article => ({
            created: item.created,
            title: article.title,
            description: article.description,
            thumbnail: article.image,
            url: article.url
          }))
          .catch(err => {
            console.log(err);
          });
      });
      Promise.all(tempo_articles).then(async articles => {
        for (let article of articles) {
          await db('articles')
          .insert({url: article.url, title: article.title, thumbnail: article.thumbnail, description: article.description, created: article.created})
        }
      });
    });
}, 86400000)
