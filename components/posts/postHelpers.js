const db = require('../../dbConfig')

module.exports = {
  async deleteSocialLike(post_id, user_id) {
    try {
      const deletedRecord = await db('posts_likes')
        .del()
        .where({ user_id, post_id })
      if (deletedRecord) {
        return { statusCode: 204, response: { msg: 'success' } }
      }
      throw new Error('something went wrong')
    } catch (err) {
      return { statusCode: 500, response: { msg: 'fatal error' } }
    }
  },
  async postPonyUp(post_id, user_id) {
    try {
      const record = await db('posts_ponies')
        .insert({ user_id, post_id })
        .returning('*')
      return { statusCode: 201, response: { msg: 'success', record } }
    } catch (err) {
      return { statusCode: 500, response: { msg: 'fatal error' } }
    }
  },
  async postPonyDownAway(post_id, user_id) {
    try {
      await db('posts_ponies')
        .del()
        .where({ user_id, post_id })
      return { statusCode: 204, response: { msg: 'success' } }
    } catch (err) {
      return { statusCode: 500, response: { msg: 'fatal error', err } }
    }
  },
  async postsLikesInsert(user_id, post_id) {
    try {
      const likeRecord = await db('posts_likes')
        .insert({
          user_id,
          post_id,
        })
        .returning('*')
      return { statusCode: 201, response: { msg: 'success', likeRecord } }
    } catch (err) {
      return { statusCode: 500, response: { msg: 'fatal error', err } }
    }
  },
}
