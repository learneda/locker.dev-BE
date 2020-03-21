require('dotenv').config()
const server = require('express')()

require('./config/passport')
require('./middleware/index')(server)
require('./components')(server)
const { configureSocket } = require('./config/')
const { logServerPrompt } = require('./utils')

const port = process.env.PORT || 8000

const myServer = server.listen(port, logServerPrompt(port))

server.get('/', (req, res) => {
  res.send('localhost listens and obeys')
})

const io = require('socket.io')(myServer)

configureSocket(io)
