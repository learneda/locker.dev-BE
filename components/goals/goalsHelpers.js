const db = require('../../dbConfig')

function getMonthDaysLeft() {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() - date.getDate()
}

module.exports = {
  async setGoal(user_id, post_id, goal) {
    let goal_due
    switch (goal) {
      case 1:
        goal_due = '1 days'
        break
      case 2:
        goal_due = '7 days'
        break
      case 3:
        goal_due = `${getMonthDaysLeft()} days`
        break
      default:
        break
    }
    const inserting = await db.raw(`INSERT INTO goals (post_id, user_id, goal_due)
    VALUES
    (${post_id}, ${user_id}, NOW() + '${goal_due}') RETURNING *`)

    return { msg: 'success', goal: inserting.rows[0] }
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
        .returning('*')

      return { msg: 'success', goal: response[0] }
    }
    return { msg: 'not authorized' }
  },
  async setGoalStatus(user_id, goal) {
    // If no goal.id exist, no goal to return in database
    if (!goal.id) {
      return { msg: 'not found' }
    }
    // Find the ith goal, return object
    const goalById = await db('goals')
      .where({ id: goal.id })
      .first()
    // If the goal belongs to the user requesting,
    // update ith goal with payload
    // return the updated recrod
    if (goal.user_id === user_id) {
      const [response] = await db('goals')
        .update(goal)
        .where({ id: goal.id })
        .returning('*')
      //? I believe .first() gives an error
      return { msg: 'success', goal: response }
    }
    return { msg: 'not authorized' }
  },
}
