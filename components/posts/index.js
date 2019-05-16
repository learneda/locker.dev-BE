const postRoutes = require('./postRoutes')

module.exports = (server) => {
	server.use('/api/posts', postRoutes)
}
