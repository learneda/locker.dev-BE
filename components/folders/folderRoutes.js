const router = require('express').Router()
const controllers = require('./folderControllers')
const utils = require('../../utils')

router.post('/', utils.isRequestAuthenticated, controllers.createFolder)

router.get('/:id', controllers.getPostsByFolderId)

router.put('/:id', utils.isRequestAuthenticated, controllers.updateFolderByFolderId)

router.delete('/:id', utils.isRequestAuthenticated, controllers.deleteFolderByFolderId)

router.post('/add/item', utils.isRequestAuthenticated, controllers.addPost)

router.get('/user/:id', controllers.getUserFolders)

module.exports = router
