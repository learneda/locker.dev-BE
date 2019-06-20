const router = require('express').Router()
const controllers = require('./youtubeControllers')

router.post('/', controllers.search)

module.exports = router
