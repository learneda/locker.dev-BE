require('dotenv').config()
const express = require('express')
const cookieSession = require('cookie-session')
const helmet = require('helmet')
const passport = require('passport')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')
const prerender = require('prerender-node')

const corsOptions = {
  credentials: true,
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://learnedadev.netlify.com',
    'https://learnlocker.dev',
    'http://127.0.0.1:80',
    'https://127.0.0.1:80',
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
  server.use(logger('dev'))
  server.use(prerender.set('prerenderToken', process.env.PRERENDERED_TOKEN))
  server.use(passport.initialize())
  server.use(passport.session())
}
