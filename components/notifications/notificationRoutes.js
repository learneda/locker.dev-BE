const router = require('express').Router()
const controllers = require('./notificationControllers')

router.post('/read', controllers.readNotifications)

router.get('/', controllers.getAllNotifications)

router.delete('/clear', controllers.clearNotifications)

router.post('/', controllers.createNotification)

module.exports = router
