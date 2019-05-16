const commentRoutes = require('./commentRoutes')

module.exports = server => {
  server.use('/api/comments', commentRoutes)
}
