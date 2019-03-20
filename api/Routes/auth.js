const router = require('express').Router()
const passport = require('passport')
// const db = require('../../dbConfig')

router.get('/github', passport.authenticate('github'))

router.get('/github/cb', passport.authenticate('github'), function (req, res) {
  // Successful authentication, redirect home.
  console.log('here')
  res.send('hello you signed in from github')
})

module.exports = router
