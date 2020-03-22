const goalsRoutes = require('./goalsRoutes')

module.exports = server => {
  server.use('/api/goals', goalsRoutes)
}
