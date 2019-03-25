const router = require('express').Router()
const passport = require('passport')
// const db = require('../../dbConfig')

router.get('/github', passport.authenticate('github'))

router.get('/github/cb', passport.authenticate('github'), (req, res, next) => {
  // Successful authentication, redirect home.
  console.log('here')
  res.send('hello you signed in from github')
})

module.exports = router
