const router = require('express').Router()
const routeCache = require('route-cache')

const controllers = require('./servicesControllers')

router.get('/courses', controllers.getCourses)

router.get('/articles', routeCache.cacheSeconds(60), controllers.getArticles)

router.get('/clean-articles', controllers.cleanUp)

module.exports = router
