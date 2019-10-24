require('dotenv').config()
const express = require('express')
const cookieSession = require('cookie-session')
const helmet = require('helmet')
const passport = require('passport')
const logger = require('morgan')
const compression = require('compression')
const cors = require('cors')
const prerender = require('prerender-node')

const corsOptions = {
  credentials: true,
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:3001',
    'http://localhost:8000',
    'https://learnedadev.netlify.com',
    'https://learnlocker.dev',
    'https://learnlocker.app',
    'http://127.0.0.1:80',
    'https://127.0.0.1:80',
    'https://prompt.netlify.com',
  ],
}

module.exports = server => {
  server.use(express.json())
  server.use(
    cookieSession({
      name: 'learned-a',
      keys: [process.env.COOKIE_KEY],
      maxAge: 24 * 60 * 60 * 1000,
    })
  )
  server.use(cors(corsOptions))
  server.use(helmet())
  server.use(compression())
  server.use(logger('dev'))
  server.use(passport.initialize())
  server.use(passport.session())
  server.use(prerender.set('prerenderToken', process.env.PRERENDERED_TOKEN))
}
