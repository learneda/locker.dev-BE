const request = require('request')
const axios = require('axios')
const Feed = require('rss-to-json')
const urlMetadata = require('url-metadata')
const cheerio = require('cheerio')
const db = require('../../dbConfig')
const log = console.log

async function runThruUrlMetadata(arr) {
  const metaPromises = arr.map(url => urlMetadata(url))
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
  return responses
}

module.exports = {
  getCourses(req, res, next) {
    const { page, search } = req.query
    const queryParams = {
      'fields[course]': 'title,headline,image_480x270,url,description,avg_rating,num_reviews',
      ordering: 'relevance',
      search,
    }
    request(
      {
        method: 'GET',
        uri: `https://www.udemy.com/api-2.0/courses?page=${page}`,
        qs: queryParams,
        auth: {
          username: process.env.UDEMY_USERNAME_ID,
          password: process.env.UDEMY_API_SECRET,
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
        } else {
          res.json(response)
        }
      }
    )
  },
  async getArticles(req, res, next) {
    const limit = 12
    const { offset, q } = req.query
    let articles
    if (!q) {
      articles = await db('articles')
        .select('*')
        .distinct('id')
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset)
    } else {
      const query = q.toLowerCase()
      articles = await db('articles')
        .select('*')
        .distinct('id')
        .whereRaw(`LOWER(title) LIKE '%${q}%' OR LOWER(description) LIKE '%${q}%' OR LOWER(url) LIKE '%${q}%'`)
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset)
    }
    if (articles) {
      return res.status(200).json(articles)
    }
    return res.status(500).send('no articles found')
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
}

async function scrapeAlligator() {
  const rootUrl = `https://alligator.io/explore/`
  const response = await axios.get(rootUrl)
  const $ = cheerio.load(response.data)
  const urls = []
  $('.front-flex')
    .find('a')
    .each(function(i, ele) {
      urls[i] = $(this).attr('href')
    })
  const articles = await runThruUrlMetadata(urls)
  // Existing articles
  const existingArticles = await db('articles')
  const existingUrls = existingArticles.map((article, index) => {
    return article.url.split('?')[0]
  })
  // Filter articles
  const filteredArticles = articles.filter(article => {
    const splittedUrl = article.url.split('?')[0]
    return !existingUrls.includes(splittedUrl)
  })
  await db('articles').insert(filteredArticles)
}

async function scrapeCeddia() {
  const existingArticles = await db('articles')
  const existingUrls = existingArticles.map((article, index) => {
    return article.url.split('?')[0]
  })
  const rootUrl = `https://daveceddia.com`
  const archiveUrl = `https://daveceddia.com/archives/`
  const response = await axios.get(archiveUrl)
  const $ = cheerio.load(response.data)
  let urls = []
  $('ul')
    .find('li > a')
    .each(function(i, ele) {
      urls[i] = $(this).attr('href')
    })
  // first 3 entries are not articles
  urls = urls.slice(3)
  // url are relative ... prepending rootUrl
  urls = urls.map(url => rootUrl + url)
  // Need to slice only a few promises to prevent promise overflow
  const metaPromises = urls.slice(0, 10).map(url => urlMetadata(url))
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
  const filteredArticles = responses.filter(article => {
    const splittedUrl = article.url.split('?')[0]
    return !existingUrls.includes(splittedUrl)
  })
  await db('articles').insert(filteredArticles)
}

async function scrapeLogRocket() {
  const rootUrl = `https://blog.logrocket.com/`
  const response = await axios.get(rootUrl)
  const $ = cheerio.load(response.data)
  const urls = []
  $('.listfeaturedtag')
    .find('div > div > div > div > a')
    .each(function(i, ele) {
      urls[i] = $(this).attr('href')
    })
  console.log(urls)
  const articles = await runThruUrlMetadata(urls)
  // Existing articles
  const existingArticles = await db('articles')
  const existingUrls = existingArticles.map((article, index) => {
    return article.url.split('?')[0]
  })
  // Filter articles
  const filteredArticles = articles.filter(article => {
    const splittedUrl = article.url.split('?')[0]
    return !existingUrls.includes(splittedUrl)
  })
  await db('articles').insert(filteredArticles)
}

async function scrapeRobin() {
  // GETTING ALL DB ARTICLES TO AVOID ADDING DUPLICATES
  const existingArticles = await db('articles')

  // FILTERING BY BASE URL
  const existingUrls = existingArticles.map((article, index) => {
    return article.url.split('?')[0]
  })
  // Scrapping w/ cheerio
  const url = `https://www.robinwieruch.de/`
  const response = await axios.get(url)
  const $ = cheerio.load(response.data)
  const urls = []
  $('section[class="post"]')
    .find('div > div > div > a')
    .each(function(i, ele) {
      urls[i] = $(this).attr('href')
    })
  const metaPromises = urls.map(url => urlMetadata(url))
  let articles = await axios.all(metaPromises)
  articles = articles.map(item => {
    const { url, title, image, description } = item
    const article = {
      url,
      title,
      thumbnail: image,
      description,
    }
    return article
  })
  const filteredArticles = articles.filter(article => {
    const splittedUrl = article.url.split('?')[0]
    return !existingUrls.includes(splittedUrl)
  })
  db('articles').insert(filteredArticles)
}

// ======= Scrapping RSS Feeds Every <ms> ======
setInterval(async () => {
  // GETTING ALL DB ARTICLES TO AVOID ADDING DUPLICATES
  const existingArticles = await db('articles')

  // FILTERING BY BASE URL
  const existingUrls = existingArticles.map((article, index) => {
    return article.url.split('?')[0]
  })
  // GETTING FETCHING FREECODECAMP ARTICLES && HACKERNOON
  const scrappingArray = [
    'https://medium.freecodecamp.org/feed',
    'https://www.smashingmagazine.com/feed',
    'https://davidwalsh.name/feed',
    'https://css-tricks.com/feed/',
  ]
  scrappingArray.map(url => {
    Feed.load(url, function(err, rss) {
      const tempo_articles = rss.items.map(item => {
        // for each article, get its url and parse it
        const url = item.url.split('?')[0]
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
        const filteredArticles = articles.filter((article, index) => {
          const splittedUrl = article.url.split('?')[0]
          return !existingUrls.includes(splittedUrl)
        })

        // Filter out articles that lack a description
        const descFilteredArticles = filteredArticles.filter(article => !!article.description)

        // INSERTING UNIQUE ARTICLES
        for (const article of descFilteredArticles) {
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
  })
}, 360000)

// Scraping using Cheerio:
//  robinwieruch.de & overreacted.io & Ceddia

async function scrapeDan() {
  const response = await axios.get('https://overreacted.io/')
  const $ = cheerio.load(response.data)
  const urlsArr = []
  $('article')
    .find('header > h3 > a')
    .each(function(i, ele) {
      urlsArr[i] = `https://overreacted.io${$(this).attr('href')}`
    })

  const existingArticles = await db('articles')

  // FILTERING TITLES
  const existingUrls = existingArticles.map((article, index) => {
    return article.url
  })

  const filteredUrl = urlsArr.filter(url => !existingUrls.includes(url))

  await db('articles').insert(await runThruUrlMetadata(filteredUrl))
}

setInterval(async () => {
  scrapeRobin()
  scrapeDan()
  scrapeCeddia()
  scrapeAlligator()
  scrapeLogRocket()
}, 360000)
