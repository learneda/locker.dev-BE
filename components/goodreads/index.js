const goodreadsRoutes = require('./goodreadsRoutes')

module.exports = server => {
  server.use('/api/goodreads', goodreadsRoutes)
}
