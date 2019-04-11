const router = require('express').Router();
const controllers = require('./postControllers');

// ==============================================
// this JS file includes helpers that access our
// database accordingly (for example, getUsers
// requests all the users in the users database)
// ==============================================

router.get('/', controllers.getAllUserPosts);

router.get('/count',controllers.getUserPostsCount);

router.get('/likes', controllers.getAllUserPostsLiked);

router.get('/shared', controllers.getAllSharedPost);

router.get('/:id', controllers.getPost);

router.post('/', controllers.createNewPost);

/* ===== DELETE POST ===== */
router.delete('/:id', controllers.deletePost);

/* ===== TOGGLE LIKE BOOLEAN ===== */
router.put('/like/:id', controllers.likePost);

/* ===== EDIT POST ===== */
router.put('/:id', controllers.editPost);

module.exports = router;
