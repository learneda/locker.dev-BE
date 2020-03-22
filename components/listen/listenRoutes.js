const router = require('express').Router()
const controllers = require('./listenControllers')

router.post('/', controllers.search)

module.exports = router
