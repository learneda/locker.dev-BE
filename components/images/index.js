const imageRoutes = require('./imageRoutes');

module.exports = (server) => {
  server.use('/api/images', imageRoutes)
}
