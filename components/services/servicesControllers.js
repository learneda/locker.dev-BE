const request = require('request')
const { parse } = require('rss-to-json')
const urlMetadata = require('url-metadata')
const db = require('../../dbConfig')
const { handleScrapping, getUrlsMetadata } = require('../../utils')

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
          const { statusCode, body } = response.toJSON()
          res.status(statusCode).json(body)
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
  const getMetadataEarly = async arr => {
    const metadata = await getUrlsMetadata(arr)
    arr.forEach((value, i) => {
      arr[i] = metadata[i].url
    })
  }
  const targetUrl = 'https://alligator.io/explore'
  const selector = {
    startingPoint: '.front-flex',
    find: 'a',
  }
  const options = {
    prependUrl: false,
    custom: getMetadataEarly,
  }
  handleScrapping(targetUrl, selector, options)
  return
}

async function scrapeCeddia() {
  const customManipulations = arr => {
    // first 3 entries are not articles
    arr.splice(0, 3)
    // Need to slice only a few promises to prevent promise overflow
    arr.splice(10, arr.length - 1)
  }
  const targetUrl = 'https://daveceddia.com/archives'
  const selector = {
    startingPoint: 'ul',
    find: 'li > a',
  }
  const options = {
    prependUrl: 'https://daveceddia.com',
    custom: customManipulations,
  }
  handleScrapping(targetUrl, selector, options)
  return
}

async function scrapeLogRocket() {
  const targetUrl = `https://blog.logrocket.com`
  const selector = {
    startingPoint: '.listfeaturedtag',
    find: 'div > div > div > div > a',
  }
  handleScrapping(targetUrl, selector, { prependUrl: false })
}

async function scrapeRobin() {
  const targetUrl = 'https://www.robinwieruch.de/categories/recent'
  const selector = {
    startingPoint: 'section[itemtype="http://schema.org/Blog"]',
    find: 'div > article > div > header > h2 > a',
  }
  const options = {
    prependUrl: 'https://www.robinwieruch.de',
  }
  handleScrapping(targetUrl, selector, options)
  return
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
    parse(url, function(err, rss) {
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
  try {
    const targetUrl = 'https://overreacted.io'
    const selector = {
      startingPoint: 'article',
      find: 'header > h3 > a',
    }
    const options = {
      prependUrl: targetUrl,
    }
    handleScrapping(targetUrl, selector, options)
    return
  } catch (err) {
    console.error('SCRAPE DAN ERR', err)
  }
}

setInterval(async () => {
  scrapeRobin()
  scrapeDan()
  scrapeCeddia()
  scrapeAlligator()
  scrapeLogRocket()
}, 360000)
