const pocketRoutes = require('./pocketRoutes')

module.exports = (server) => {
	server.use('/api/pocket', pocketRoutes)
}
