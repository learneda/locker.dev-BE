const router = require('express').Router();
const controllers = require('./folderControllers');

router.post('/', controllers.createFolder);

router.post('/add/post', controllers.addPost);

module.exports = router;
