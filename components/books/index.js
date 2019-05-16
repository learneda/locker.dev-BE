const bookRoutes = require('./bookRoutes')

module.exports = server => {
  server.use('/api/books', bookRoutes)
}
