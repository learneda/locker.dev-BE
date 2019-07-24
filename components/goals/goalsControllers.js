const helpers = require('./goalsHelpers')
module.exports = {
  async setGoal(req, res, next) {
    const { postId, goal } = req.body
    const userId = req.body.userId === undefined ? req.user.id : req.body.userId
    if (postId && goal) {
      const response = await helpers.setGoal(userId, postId, goal)
      if (response.msg === 'success') {
        res.status(201).json(response)
      }
    }
  },
  async fetchGoals(req, res, next) {
    const response = await helpers.fetchGoals()
    res.status(200).json(response)
  },
  async fetchGoalsByUserId(req, res, next) {
    const userId = req.params.id || req.user.id || req.body.id
    const response = await helpers.fetchGoalsByUserId(userId)
    res.status(200).json(response)
  },
  async deleteGoal(req, res, next) {
    const userId = req.user.id || req.body.userId
    const goalId = req.params.id || req.body.id
    const response = await helpers.deleteGoal(userId, goalId)
    res.status(200).json(response)
  },
  async setGoalStatus(req, res, next) {
    const goal = req.body
    const userId = req.user.id
    const response = await helpers.setGoalStatus(userId, goal)
    try {
      if (response.msg === 'success') {
        res.status(200).json(response)
      } else if (response.msg === 'not authorized') {
        res.status(401).json(response)
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },
}
