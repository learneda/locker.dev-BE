const router = require('express').Router();
const controllers = require('./commentControllers');

router.get('/', controllers.getAllComments);

router.post('/', controllers.insertComment);

module.exports = router;
