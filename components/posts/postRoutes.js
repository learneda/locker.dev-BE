const router = require('express').Router()
const controllers = require('./postControllers')

// ==============================================
// this JS file includes helpers that access our
// database accordingly (for example, getUsers
// requests all the users in the users database)
// ==============================================

router.get('/', controllers.getAllCurrentUserPost)

router.get('/count', controllers.getUserPostsCount)

router.get('/like/count', controllers.getPostLikeCount)

router.post('/likes/users', controllers.getUsersWhoLikedPost)

router.post('/ponies/users', controllers.getUsersWhoPonyPost)

router.post('/like', controllers.socialLikePost)

router.get('/:id', controllers.getPost)

router.get('/all/:id', controllers.getAllUserPosts)

router.post('/', controllers.createNewPost)

/* ===== DELETE BOOKMARK ===== */
router.delete('/:id', controllers.deletePost)

/* ===== EDIT BOOKMARK ===== */
router.put('/:id', controllers.editPost)

module.exports = router
