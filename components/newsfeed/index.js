const newsfeedRoutes = require('./newsfeedRoutes')

module.exports = server => server.use('/api/newsfeed', newsfeedRoutes)
