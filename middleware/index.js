const express = require('express')
const cookieSession = require('cookie-session')
const helmet = require('helmet')
const passport = require('passport')
const logger = require('morgan')
const compression = require('compression')
const cors = require('cors')
const prerender = require('prerender-node')

const origins = process.env.CORS_WHITELIST_ORIGINS.split(',')

const corsOptions = {
  credentials: true,
  origin: origins,
}

module.exports = (server) => {
  server.use(express.json())
  server.use(cors(corsOptions))
  server.use(helmet())
  server.use(compression())
  server.use(logger(process.env.NODE_ENV === 'production' ? 'combined': 'dev'))
  server.use(
    cookieSession({
      name: 'session',
      keys: [process.env.COOKIE_KEY],
      maxAge: 24 * 60 * 60 * 1000,
    })
  )
  server.use(passport.initialize())
  server.use(passport.session())
  server.use(prerender.set('prerenderToken', process.env.PRERENDERED_TOKEN))
}
