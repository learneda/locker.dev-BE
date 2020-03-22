const lockerRoutes = require('./lockerRoutes')

module.exports = server => {
  server.use('/api/locker', lockerRoutes)
}
