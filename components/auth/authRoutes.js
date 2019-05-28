const router = require('express').Router()
const controllers = require('./authControllers')
const passport = require('passport')

router.get('/github', passport.authenticate('github'))

router.get(
  '/github/cb',
  passport.authenticate('github'),
  controllers.gitHubHandler
)

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  controllers.googleHandler
)

router.get('/logout', controllers.logoutHandler)

router.get('/current_user', (req, res) => {
  console.log('\n 🦄', req.user)
try {
  if (req.user) {
    const { id } = req.user
    console.log('\n 🦄', req.user)
    res.status(200).json({ id })
  } else {
    console.log('\n 🦄', req.user)

    res.status(200).send(false)
} catch (error) {
  console.error(error)
}
  }
})

router.get('/accounts', controllers.getSocialNetworkIDs)

module.exports = router
