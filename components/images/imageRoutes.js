const router = require('express').Router()
const controllers = require('./imageControllers')

router.post('/', controllers.uploadImg)

router.post('/header', controllers.uploadHeader)

router.get('/', controllers.getImg)

module.exports = router
