require('dotenv').config();
const router = require('express').Router();
const passport = require('passport');
const db = require('../../dbConfig');
const jtw = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.get('/github', passport.authenticate('github'));

router.get('/github/cb', passport.authenticate('github'), (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.redirect('https://learnedadev.netlify.com/profile');
  } else res.redirect('http://localhost:3000/profile');
});

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      res.redirect('https://learnedadev.netlify.com/profile');
    } else res.redirect('http://localhost:3000/profile');
  }
);

router.post('/register', passport.authenticate('local'), (req, res, next) => {
  res.send({ msg: 'cool' });
});
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  console.log('what is req.user ?????', req.user);
  if (process.env.NODE_ENV === 'production') {
    res.redirect('https://learnedadev.netlify.com/profile');
  } else res.redirect('http://localhost:3000/profile');
});

router.get('/logout', (req, res) => {
  req.logout();
  if (process.env.NODE_ENV === 'production') {
    res.redirect('https://learnedadev.netlify.com');
  } else res.redirect('http://localhost:3000');
});

router.get('/current_user', (req, res) => res.send(req.user));

module.exports = router;
