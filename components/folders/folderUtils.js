const db = require('../../dbConfig')

module.exports = {
  async isOwner(user_id, folder_id) {
    const folder = await db('folders as s')
      .where({ id: folder_id })
      .first()
    if (Number(folder.user_id) === Number(user_id)) {
      return true
    }
    return false
  },
}
