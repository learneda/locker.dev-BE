require('dotenv').config()
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const logger = require('morgan');
const cors = require('cors');
const cookieSession = require('cookie-session')

module.exports = server => {
  server.use(express.json());
  server.use(cors());
  server.use(
    cookieSession({ maxAge: 20000000, keys: [ process.env.COOKIE_SECRET ] })
  )
  server.use(helmet());
  server.use(logger('dev'));
  server.use(passport.initialize());
  server.use(passport.session());
};
