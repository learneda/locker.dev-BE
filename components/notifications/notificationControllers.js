const helpers = require('./notificationHelpers')
const { postHandleNotification } = require('./notificationsService')

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
    try {
      const aNew = await postHandleNotification(req.body)
      res.status(200).json(aNew)
    } catch (err) {
      res.status(500).json(err)
    }
  },
}
