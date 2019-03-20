const express = require('express')
const helmet = require('helmet')
const passport = require('passport')
const logger = require('morgan')

module.exports = (server) => {
  server.use(express.json())
  server.use(helmet())
  server.use(logger('dev'))
  server.use(passport.initialize())
  server.use(passport.session())
}
