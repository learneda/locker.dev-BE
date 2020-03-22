const router = require('express').Router()
const controllers = require('./lockerControllers')

router.get('/', controllers.getLocker)

module.exports = router
