const router = require('express').Router()
const controllers = require('./commentControllers')

router.get('/', controllers.getAllComments)

router.post('/', controllers.insertComment)

router.delete('/:id', controllers.deleteComment)

module.exports = router
