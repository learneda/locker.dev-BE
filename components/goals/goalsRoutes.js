const router = require('express').Router()
const controllers = require('./goalsControllers')

router.post('/', controllers.setGoal)
router.get('/', controllers.fetchGoals)
router.get('/users/:id', controllers.fetchGoalsByUserId)
router.delete('/:id', controllers.deleteGoal)
router.put('/status', controllers.setGoalStatus)
module.exports = router
