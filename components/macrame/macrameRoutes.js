const router = require('express').Router()
const controllers = require('./macrameControllers')

// SEARCH BOOKS BY TITLE, AUTHOR, OR ISBN
router.post('/', controllers.translate)

module.exports = router
