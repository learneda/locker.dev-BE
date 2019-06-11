const tagRoutes = require('./tagRoutes')

module.exports = server => {
  server.use('/api/tags', tagRoutes)
}
