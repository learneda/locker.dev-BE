const router = require('express').Router()
const controllers = require('./postControllers')

// ==============================================
// this JS file includes helpers that access our
// database accordingly (for example, getUsers
// requests all the users in the users database)
// ==============================================

router.get('/', controllers.getAllCurrentUserPost)

router.get('/count', controllers.getUserPostsCount)

router.get('/shared', controllers.getAllSharedPost)

router.get('/like/count', controllers.getPostLikeCount)

router.post('/like/users', controllers.getUsersWhoLikedPost)

router.post('/like', controllers.socialLikePost)

router.get('/:id', controllers.getPost)

router.get('/all/:id', controllers.getAllUserPosts)

router.post('/', controllers.createNewPost)

/* ===== DELETE SHARED BOOKMARK ===== */
router.delete('/unshare', controllers.unshareBookmark)

/* ===== DELETE BOOKMARK ===== */
router.delete('/:id', controllers.deletePost)

/* ===== EDIT BOOKMARK ===== */
router.put('/:id', controllers.editPost)

/* ===== SHARE BOOKMARK ===== */
// router.post('/share', controllers.shareBookmark)

/* ===== GET SINGLE SHARED BOOKMARK ===== */
router.get('/shared/:id', controllers.getSharedBookmark)

module.exports = router
