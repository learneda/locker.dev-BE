require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const passport = require('passport');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'https://learnedadev.netlify.com']
};

console.log(path.join(__dirname, '..', 'public'))
module.exports = server => {
  server.use(express.json());
  server.use(express.static(path.join(__dirname, '..', 'public')));
  server.use(
    cookieSession({
      name: 'learned-a',
      keys: [process.env.COOKIE_KEY],
      maxAge: 3 * 60 * 60 * 1000
    })
  );
  server.use(cors(corsOptions));
  server.use(helmet());
  server.use(logger('dev'));
  server.use(passport.initialize());
  server.use(passport.session());
};
