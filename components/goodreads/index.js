const goodreadRoutes = require('./goodreadRoutes');

module.exports = (server) => {
  server.use('/api/goodreads', goodreadRoutes)
}
