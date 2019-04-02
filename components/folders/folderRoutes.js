const router = require('express').Router();
const controllers = require('./folderControllers');

router.post('/', controllers.createFolder);

module.exports = router;
