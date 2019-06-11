const router = require('express').Router()
const controllers = require('./tagControllers')

router.post('/' controllers.findOrCreateTag)

router.get('/',  controllers.getTagByTagName)

router.get('/', controllers.getAllTags)
