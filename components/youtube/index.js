const youtubeRoutes = require('./youtubeRoutes')

module.exports = server => {
  server.use('/api/youtube', youtubeRoutes)
}
