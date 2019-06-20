const listenRoutes = require('./listenRoutes')

module.exports = server => {
  server.use('/api/listen', listenRoutes)
}
