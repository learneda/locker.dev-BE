const router = require('express').Router()
const controllers = require('./newfeedsControllers')

router.get('/', controllers.getNewsfeed)

router.post('/', controllers.postToNewsfeed)

module.exports = router
