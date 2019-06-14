const router = require('express').Router()
const controllers = require('./tagControllers')

router.get('/:tag', controllers.getTagPost)

router.post('/follow', controllers.createFriendship)
module.exports = router
