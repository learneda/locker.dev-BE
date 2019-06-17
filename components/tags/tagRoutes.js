const router = require('express').Router()
const controllers = require('./tagControllers')

router.get('/top', controllers.getTopTags)

router.get('/:tag', controllers.getTagPosts)

router.post('/follow', controllers.followTag)

router.delete('/unfollow', controllers.unfollowTag)

module.exports = router
