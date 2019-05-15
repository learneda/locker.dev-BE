const router = require('express').Router();
const controllers = require('./bookControllers');

// SEARCH BOOKS BY TITLE, AUTHOR, OR ISBN
router.get('/search', controllers.searchBooks);


module.exports = router;
