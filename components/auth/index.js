const authRoutes = require('./authRoutes')

module.exports = server => {
  server.use('/auth', authRoutes)
}
