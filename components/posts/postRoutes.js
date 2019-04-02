const router = require('express').Router();
const controllers = require('./postControllers');

// ==============================================
// this JS file includes helpers that access our
// database accordingly (for example, getUsers
// requests all the users in the users database)
// ==============================================

router.get('/', controllers.getAllUserPosts);
router.get('/likes', controllers.getAllUserPostsLiked);

router.get('/shared', controllers.getAllSharedPost);

router.get('/:id', controllers.getPost);

router.post('/', controllers.createNewPost);

/* ===== DELETE POST || TODO: MAKE ROUTE SECURE  ===== */
router.delete('/:id', controllers.deletePost);

router.put('/like/:id', controllers.likePost);

router.put('/:id', controllers.editPost);

module.exports = router;
