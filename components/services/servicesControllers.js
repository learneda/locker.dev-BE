const request = require('request')
const axios = require('axios')
const Feed = require('rss-to-json')
const urlMetadata = require('url-metadata')
const cheerio = require('cheerio')
const db = require('../../dbConfig')

module.exports = {
  getCourses(req, res, next) {
    const { page, search } = req.query
    let queryParams = {
      'fields[course]':
        'title,headline,image_480x270,url,description,avg_rating,num_reviews',
      ordering: 'relevance',
      search,
    }
    request(
      {
        method: 'GET',
        uri: `https://www.udemy.com/api-2.0/courses?page=${page}`,
        qs: queryParams,
        auth: {
          username: process.env.UDEMY_ID,
          password: process.env.UDEMY_SECRET,
        },
      },
      (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const json = JSON.parse(body)
          const resultsWithUrl = json.results.map(course => {
            course.url = `https://udemy.com${course.url}`
            return course
          })
          json.results = resultsWithUrl
          res.json(json)
        }
      }
    )
  },
  async getArticles(req, res, next) {
    const limit = 12
    let { offset, q } = req.query
    let articles
    if (!q) {
      articles = await db('articles')
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset)
    } else {
      q = q.toLowerCase()
      articles = await db('articles')
        .whereRaw(
          `LOWER(title) LIKE '%${q}%' OR LOWER(description) LIKE '%${q}%' `
        )
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset)
    }
    if (articles) {
      return res.status(200).json(articles)
    }
    return res.status(500).send('no articles found')
  },
  async launchCheerio(req, res, next) {
    for (let num = 8; num <= 13; num++) {
      const url = `https://www.robinwieruch.de//page/${num}/`
      const response = await axios.get(url)
      const $ = cheerio.load(response.data)
      const urls = []
      $('section[class="post"]')
        .find('div > div > div > a')
        .each(function(i, ele) {
          urls[i] = $(this).attr('href')
        })
      const metaPromises = urls.map(url => urlMetadata(url))
      let responses = await axios.all(metaPromises)
      responses = responses.map(response => {
        const { url, title, image, description } = response
        const article = {
          url,
          title,
          thumbnail: image,
          description,
        }
        return article
      })
      await db('articles').insert(responses)
    }
    res.send('all okay')
  },
  async cleanUp(req, res, next) {
    try {
      const cleanup = await db.raw(
        `DELETE FROM articles WHERE articles.id NOT IN (SELECT id FROM (SELECT DISTINCT ON (articles.thumbnail) * FROM articles) AS dublicates)`
      )
      if (cleanup) {
        res.status(200).json(cleanup)
      }
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  async gamestop(req, res, next) {
    const search = req.body.game
    console.log('THIS GOT HIT ')
    const response = await axios.get(
      `https://www.gamestop.com/browse?nav=16k-3-${search.replace(
        /\s+/g,
        '+'
      )},28zu0`
    )
    const $ = cheerio.load(response.data)
    const lol = $('p[class="pricing ats-product-price"]').text()
    res.status(200).json({ responses: lol.split('$')[1] })
  },
}

// ======= getting freeCodeCampArticles && Hackernoon Every <ms> ======
setInterval(async () => {
  // GETTING ALL DB ARTICLES TO AVOID ADDING DUPLICATES
  const existingArticles = await db('articles')

  // FILTERING TITLES
  let existingTitles = existingArticles.map((article, index) => {
    return article.title
  })
  let existingThumbnails = existingArticles.map((article, index) => {
    return article.thumbnail
  })

  let existingUrls = existingArticles.map((article, index) => {
    return article.url.split('?')[0]
  })
  // GETTING FETCHING FREECODECAMP ARTICLES && HACKERNOON
  for (let i = 0; i < 2; i++) {
    const url =
      i === 0
        ? 'https://medium.freecodecamp.org/feed'
        : 'https://hackernoon.com/feed'
    Feed.load(url, function(err, rss) {
      const tempo_articles = rss.items.map(item => {
        // for each article, get its url and parse it
        let url = item.url
        return urlMetadata(url)
          .then(article => ({
            created: item.created,
            title: article.title,
            description: article.description,
            thumbnail: article.image,
            url: article.url,
          }))
          .catch(err => {
            console.log(err)
          })
      })

      Promise.all(tempo_articles).then(async articles => {
        let filteredArticles = articles.filter((article, index) => {
          const splittedUrl = article.url.split('?')[0]
          return !existingUrls.includes(splittedUrl)
        })

        // INSERTING UNIQUE ARTICLES
        for (let article of filteredArticles) {
          await db('articles').insert({
            url: article.url,
            title: article.title,
            thumbnail: article.thumbnail,
            description: article.description,
            created: article.created,
          })
        }
      })
    })
  }
}, 3600000)
