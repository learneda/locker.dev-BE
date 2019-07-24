const db = require('../../dbConfig')

module.exports = {
  async setGoal(user_id, post_id, goal) {
    let goal_due
    console.log('this is goal', goal)
    switch (goal) {
      case 1:
        goal_due = '1 days'
        break
      case 2:
        goal_due = '7 days'
        break
      case 3:
        function getMonthDaysLeft() {
          date = new Date()
          return (
            new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() -
            date.getDate()
          )
        }
        goal_due = `${getMonthDaysLeft()} days`
        break
      default:
        break
    }
    const inserting = await db.raw(`INSERT INTO goals (post_id, user_id, goal_due)
    VALUES
    (${post_id}, ${user_id}, NOW() + '${goal_due}')`)
    return { msg: 'success' }
  },
  async fetchGoals() {
    const goals = await db('goals')
    return goals
  },
  async fetchGoalsByUserId(user_id) {
    const goals = await db('goals').where({ user_id })
    return goals
  },
  async deleteGoal(user_id, id) {
    const goal = await db('goals')
      .where({ id })
      .first()

    if (!goal.id) {
      return { msg: 'not found' }
    }
    if (goal.user_id === user_id) {
      const response = await db('goals')
        .where({ id })
        .del()
      return { msg: 'success' }
    } else {
      return { msg: 'not authorized' }
    }
  },
}
