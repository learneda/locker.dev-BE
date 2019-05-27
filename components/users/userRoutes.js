const router = require('express').Router()
const controllers = require('./userControllers')

// ==============================================
// this JS file includes helpers that access our
// database accordingly (for example, getUsers
// requests all the users in the users database)
// ==============================================

router.get('/all', controllers.getAllUsers)

router.get('/followStats', controllers.getUserFollowStats)

router.get('/following', controllers.getUserFollowing)

router.get('/followers', controllers.getUserFollowers)

router.get('/recommendedFollow', controllers.recommendedFollow)

router.get('/newsfeed', controllers.getUserNewsFeed)

router.put('/edit', controllers.editProfile)

router.get('/saved-post-ids', controllers.getSavedPostIds)

router.post('/saved-post-ids', controllers.savePostId)

router.delete('/saved-post-ids/:id', controllers.deleteSavedPostIds)

router.get('/id/:id', controllers.getUserById)

router.get('/username/:username', controllers.getUserDetailsByUserName)

router.post('/subscribe', controllers.subscribetoUser)

router.delete('/unsubscribe', controllers.unsubscribetoUser)

router.get('/following/:id', controllers.getFollowing)

router.get('/avatars', controllers.fixAvatars)

module.exports = router
