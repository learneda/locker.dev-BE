require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const passport = require('passport');
const logger = require('morgan');
const cors = require('cors');

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'https://learnedadev.netlify.com/']
};

module.exports = server => {
  server.use(express.json());
  server.use(
    cookieSession({
      name: 'learned-a',
      keys: [process.env.COOKIE_KEY],
      maxAge: 60 * 60 * 1000
    })
  );
  server.use(cors(corsOptions));
  server.use(helmet());
  server.use(logger('dev'));
  server.use(passport.initialize());
  server.use(passport.session());
};
