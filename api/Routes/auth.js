const router = require('express').Router()
const passport = require('passport')
// const db = require('../../dbConfig')

router.get('/github', passport.authenticate('github'))

router.get('/github/cb', passport.authenticate('github'), (req, res, next) => {
  // Successful authentication, redirect home.
  console.log('IS USER Authenti ??? ??', req.isAuthenticated())
  res.redirect('https://learnedadev.netlify.com/feed')
})

module.exports = router
