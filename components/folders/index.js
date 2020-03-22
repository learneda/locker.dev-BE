const folderRoutes = require('./folderRoutes')

module.exports = server => {
  server.use('/api/folders', folderRoutes)
}
