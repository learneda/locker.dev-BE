require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const passport = require('passport');
const logger = require('morgan');
const cors = require('cors');
const cookieSession = require('cookie-session');

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'https://learnedadev.netlify.com']
};

module.exports = server => {
  server.use(express.json());
  server.use(cors());
  server.use(
    cookieSession({ maxAge: 20000000, keys: [process.env.COOKIE_SECRET] })
  );
  server.use(helmet());
  server.use(logger('dev'));
  server.use(passport.initialize());
  server.use(passport.session());
};
