const db = require('../../dbConfig')

module.exports = {
  insertNotification(notification) {
    return db('notifications').insert(notification).returning('*')
  },
  delNotification(notification) {
    return db('notifications').del().where(notification)
  },
}
