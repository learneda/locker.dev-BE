const { insertNotification, delNotification } = require('./notificationsDAL')

module.exports = {
  postHandleNotification(body) {
    const reactionType = body.type
    switch (reactionType) {
      case 'like':
      case 'pony_up':
        result = insertNotification(body)
        break
      case 'unlike':
        result = delNotification({ ...body, type: 'like' })
        break
      case 'pony_down':
        result = delNotification({ ...body, type: 'pony_up' })
      default:
        break
    }
    return result
  },
}
