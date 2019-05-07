const router = require('express').Router();
const controllers = require('./notificationControllers');

router.post('/read', controllers.readNotifications)

router.delete('/clear', controllers.clearNotifications)

module.exports = router;
