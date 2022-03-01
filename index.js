const { configureSocket } = require('./config/')
const { logServerPrompt } = require('./utils')

// Instantiates server
const server = require('express')()

// Configures passport auth
require('./config/passport')
// Configures middleware
require('./middleware')(server)
// Configures services (routes)
require('./components')(server)

const port = process.env.PORT || 8000

// Wakes up server
const myServer = server.listen(port, logServerPrompt(port))

// Sanity check
server.get('/', (req, res) => {
  res.send('localhost listens and obeys')
})

// Instantiates Socket-IO instance
const io = require('socket.io')(myServer, {
  cors: {
    origin: process.env.LEARN_LOCKER_FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['session'],
  },
})
// require('./socket-io/middleware')(io)

configureSocket(io)
