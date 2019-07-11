const router = require('express').Router()
const controllers = require('./goalsControllers')

router.post('/set-goal', controllers.setGoal)

module.exports = router
