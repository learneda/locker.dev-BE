require('dotenv').config()
const books = require('google-books-search')

module.exports = {
  async searchBooks(req, res, next) {
    const { q, offset } = req.query
    const options = {
      key: process.env.GOOGLE_BOOKS_API_KEY,
      limit: 12,
      type: 'books',
      offset: offset || 0,
    }
    if (q) {
      books.search(q, options, function(error, results) {
        if (!error) {
          results.map(result => {
            if (result.thumbnail) {
              result.thumbnail = result.thumbnail.replace('http', 'https')
            }
            return result
          })
          res.status(200).json(results)
        } else {
          console.log(error)
        }
      })
    } else {
      res.json({ err: 'q required in body of post request' })
    }
  },
}
