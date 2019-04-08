const router = require('express').Router();
const controllers = require('./commentControllers');

router.get('/', controllers.getAllComments);

module.exports = router;
