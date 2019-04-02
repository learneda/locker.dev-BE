const router = require('express').Router();
const controllers = require('./folderControllers');

router.post('/', controllers.createFolder);

router.post('/add/post', controllers.addPost);

router.get('/', controllers.getUserFolders);

router.get('/:id', controllers.getPostByFolderId);

module.exports = router;
