const router = require('express').Router()
const controllers = require('./newfeedsControllers')

router.get('/', controllers.getNewsfeed)

router.post('/', controllers.postToNewsfeed)
// =============== GET SINGLE NEWSFEED POST ===============
router.get('/:id', controllers.getSingleNewsfeedPost)

router.delete('/:id', controllers.deleteNewsfeedPost)

router.get('/profile/:id', controllers.getUserNewsfeedPosts)

module.exports = router
