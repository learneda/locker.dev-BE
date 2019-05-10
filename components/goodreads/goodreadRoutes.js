const router = require('express').Router();
const controllers = require('./goodreadControllers');

// SEARCH BOOKS BY TITLE, AUTHOR, OR ISBN
router.post('/search', controllers.searchBooks);

// router.get('/', controllers.getImg);

module.exports = router;
