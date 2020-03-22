const servicesRoutes = require('./servicesRoutes')

module.exports = server => {
  server.use('/api', servicesRoutes)
}
