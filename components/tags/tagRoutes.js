const router = require('express').Router()
const controllers = require('./tagControllers')

router.get('/:tag', controllers.getTagPost)

// router.get('/', controllers.getAllTags)
module.exports = router
