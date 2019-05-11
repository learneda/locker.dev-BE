const router = require('express').Router();
const controllers = require('./goodreadsControllers');

router.get('/cb', controllers.goodreadsCB)

// SEARCH BOOKS BY TITLE, AUTHOR, OR ISBN
router.get('/', controllers.login);


module.exports = router;
