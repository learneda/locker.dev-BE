const router = require('express').Router()
const controllers = require('./pocketControllers')

router.get('/', controllers.login)

router.get('/cb', controllers.pocketCB)

module.exports = router
