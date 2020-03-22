const notificationRoutes = require('./notificationRoutes')

module.exports = server => {
  server.use('/api/notifications', notificationRoutes)
}
