const router = require('express').Router();
const passport = require('passport');
// const db = require('../../dbConfig')

router.get('/github', passport.authenticate('github'));

router.get('/github/cb', passport.authenticate('github'), (req, res, next) => {
  // Successful authentication, redirect home.
  console.log('IS USER Authenti ??? ??', req.isAuthenticated());
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

module.exports = router;
