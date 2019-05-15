const router = require('express').Router();
const controllers = require('./goodreadsControllers');

router.get('/', controllers.login);

router.get('/cb', controllers.goodreadsCB);

router.get('/shelfs', controllers.getUserShelf);

// SEARCH BOOKS BY TITLE, AUTHOR, OR ISBN


module.exports = router;
