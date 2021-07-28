const axios = require('axios')
const cheerio = require('cheerio')
const db = require('../dbConfig')
const getUrlsMetadata = require('./getUrlsMetadata')

async function handleScrapping(rootUrl, selector, options) {
  const response = await axios.get(rootUrl)
  const existingUrls = await db('articles').pluck('url')
  const $ = cheerio.load(response.data)
  const scrappedUrls = []
  $(selector.startingPoint)
    .find(selector.find)
    .each(function(i) {
      const prependUrl = options['prependUrl']
      let href = $(this).attr('href')
      if (href.charAt(href.length - 1) === '/') {
        href = href.slice(0, -1)
      }
      if (prependUrl) {
        scrappedUrls[i] = prependUrl + href
        return
      }
      scrappedUrls[i] = href
    })

  if (options?.custom) {
    await options.custom(scrappedUrls)
  }
  const newUrls = scrappedUrls.filter(url => !existingUrls.includes(url))

  if (newUrls.length) {
    const newArticles = await getUrlsMetadata(newUrls)
    const result = await db('articles').insert(newArticles)
    return result
  }
}
module.exports = handleScrapping
