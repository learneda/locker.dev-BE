const db = require('../../dbConfig')
const helpers = require('./notificationHelpers')
module.exports = {
  async readNotifications(req, res, next) {
    const userId = req.user.id
    if (userId) {
      const response = await helpers.updateReadStatus(userId)
      if (response.msg === 'success') {
        res.status(200).json(response)
      } else {
        res.status(500).json(response)
      }
    } else {
      res.status(400).json({ msg: 'request requires user id' })
    }
  },

  async clearNotifications(req, res, next) {
    const userId = req.user.id
    if (userId) {
      const response = await helpers.deleteNotifications(userId)
      if (response.msg === 'success') {
        res.status(200).json(response)
      } else {
        res.status(500).json(response)
      }
    } else {
      res.status(400).json({ msg: 'request requires user id' })
    }
  },

  async getAllNotifications(req, res, next) {
    const userId = req.user.id
    if (userId) {
      const response = await helpers.getNotifications(userId)
      if (response.msg === 'success') {
        res.status(200).json(response.notifications)
      } else {
        res.status(500).json(response)
      }
    }
  },
  async createNotification(req, res) {
    const { user_id, newsfeed_id, type, invoker } = req.body
    let result = null
    function notificationInsert() {
      return db('notifications').insert({
        user_id,
        newsfeed_id,
        type,
        invoker,
      })
    }
    function deleteNotification(str) {
      return db('notifications')
        .del()
        .where({ user_id: user_id, newsfeed_id, invoker, type: str })
    }
    switch (type) {
      case 'like':
        result = await notificationInsert()
        break
      case 'unlike':
        result = await deleteNotification('like')
        break
      case 'pony_up':
        result = await notificationInsert()
        break
      case 'pony_down':
        result = await deleteNotification('pony_up')
      default:
        break
    }
    res.status(200)
  },
}
