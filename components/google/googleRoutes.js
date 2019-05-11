const router = require('express').Router();
const controllers = require('./googleControllers');

// SEARCH BOOKS BY TITLE, AUTHOR, OR ISBN
router.get('/search', controllers.searchBooks);


module.exports = router;
