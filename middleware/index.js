const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const logger = require('morgan');
const cors = require('cors');

module.exports = server => {
  server.use(express.json());
  server.use(cors());
  server.use(helmet());
  server.use(logger('dev'));
  server.use(passport.initialize());
  server.use(passport.session());
};
