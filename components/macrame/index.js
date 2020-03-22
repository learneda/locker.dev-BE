const macrameRoutes = require('./macrameRoutes')

module.exports = server => {
  server.use('/api/macrame', macrameRoutes)
}
