const db = require('../../dbConfig')

module.exports = {
  async updateReadStatus(userId) {
    try {
      const read = await db('notifications')
        .update('read', true)
        .where({ user_id: userId })
        .returning('*')
      if (read) {
        return { msg: 'success', read: read[0] }
      }
    } catch (err) {
      console.log(err)
      return { msg: 'error', err }
    }
  },
  async deleteNotifications(userId) {
    try {
      const clear = await db('notifications').del().where('user_id', userId)
      if (clear) {
        return { msg: 'success' }
      }
    } catch (err) {
      console.log(err)
      return { msg: 'error', err }
    }
  },
  async getNotifications(userId) {
    try {
      const notifications = await db('notifications as n')
        .select(
          'n.id',
          'n.newsfeed_id',
          'n.type',
          'n.read',
          'n.invoker',
          'np.thumbnail_url',
          'u.profile_picture'
        )
        .where('n.user_id', userId)
        .join('newsfeed_posts as np', 'np.id', 'n.newsfeed_id')
        .join('users as u', 'u.username', 'n.invoker')
        .orderBy('n.created_at', 'desc')

      return { msg: 'success', notifications: notifications.reverse() }
    } catch (err) {
      console.log(err)
      return { msg: 'error', err }
    }
  },
}
