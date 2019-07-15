const router = require('express').Router()
const controllers = require('./servicesControllers')
const routeCache = require('route-cache')

router.get('/courses', controllers.getCourses)

router.get('/articles', routeCache.cacheSeconds(60), controllers.getArticles)

router.get('/scrapeRobin', controllers.scrapeRobin)

router.get('/clean-articles', controllers.cleanUp)

router.post('/gamestop', controllers.gamestop)

module.exports = router
