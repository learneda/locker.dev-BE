const db = require('../../dbConfig');
require('dotenv').config();

module.exports = {
  gitHubHandler (req, res, next) {
    if (process.env.NODE_ENV === 'production') {
      res.redirect('https://learnedadev.netlify.com/profile');
    } else res.redirect('http://localhost:3000/profile');
  },

  googleHandler (req, res, next) {
    if (process.env.NODE_ENV === 'production') {
      res.redirect('https://learnedadev.netlify.com/profile');
    } else res.redirect('http://localhost:3000/profile');
  },
  logoutHandler (req, res, next) {
    req.logout();
    if (process.env.NODE_ENV === 'production') {
      res.redirect('https://learnedadev.netlify.com');
    } else res.redirect('http://localhost:3000');
  }
}