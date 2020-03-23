require('dotenv').config()
const { configureSocket } = require('./config/configureSocket')
const { logServerPrompt } = require('./utils/logServerPrompt')
const server = require('express')()

// Configures passport auth
require('./config/passport')
// Configures middleware
require('./middleware')(server)
// Configures services (routes)
require('./components')(server)

const port = Number(process.env.PORT) || 8000

// Wakes up server
const myServer = server.listen(port, () => logServerPrompt(port))

// Sanity check
server.get('/', (req, res) => {
  res.send('localhost listens and obeys')
})

// Instantiates Socket-IO instance
const io = require('socket.io')(myServer)
// Configure SocketIO
configureSocket(io)
