const helpers = require('./goalsHelpers')
module.exports = {
  async setGoal(req, res, next) {
    const { postId, goal } = req.body
    const userId = req.body.userId === undefined ? req.user.id : req.body.userId
    if (postId && goal) {
      const response = await helpers.setGoal(postId, goal, userId)
      if (response.msg === 'success') {
        res.status(200).json(response)
      }
    }
  },
}
