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
}
