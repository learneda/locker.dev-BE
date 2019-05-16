const router = require('express').Router()
const controllers = require('./authControllers')
const passport = require('passport')

router.get('/github', passport.authenticate('github'))

router.get('/github/cb', passport.authenticate('github'), controllers.gitHubHandler)

router.get('/google', passport.authenticate('google', { scope: [ 'profile', 'email' ] }))

router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/failed' }),
	controllers.googleHandler
)

router.get('/logout', controllers.logoutHandler)

router.get('/current_user', (req, res) => res.send(req.user))

router.get('/accounts', controllers.getSocialNetworkIDs)

module.exports = router
