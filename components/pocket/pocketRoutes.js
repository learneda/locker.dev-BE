const router = require('express').Router();
const controllers = require('./pocketControllers');

router.get('/', controllers.login);

router.get('/cb', controllers.pocketCB);

// router.get('/shelfs', controllers.getUserShelf);


module.exports = router;
