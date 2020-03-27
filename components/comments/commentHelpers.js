const db = require('../../dbConfig')

module.exports = {
  async insertComment(comment_body, user_id) {
    const { content, post_id } = comment_body
    try {
      const comment = await db('comments')
        .insert({ content, post_id, user_id })
        .returning('*')
      return { statusCode: 201, response: { msg: 'success', comment } }
    } catch (err) {
      throw new Error(`error when inserting to comment ${err}`)
    }
  },
  async createNotification(recordData) {
    const { postOwnerId, type, username } = recordData
    try {
      const notification = db('notifications')
        .insert({ user_id: postOwnerId, post_id: recordData.post_id, type: type, invoker: username })
        .returning('*')
      return notification
    } catch (err) {
      return err
    }
  },
  async deleteComment(comment_id, user_id) {
    try {
      await db('comments')
        .where('id', comment_id)
        .del()
      return { statusCode: 204, response: { msg: 'success' } }
    } catch (err) {
      return { statusCode: 500, response: { msg: 'fatal error' } }
    }
  },
}
