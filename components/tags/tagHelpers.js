const db = require('../../dbConfig')
module.exports = {
  async getPostsWithTag(tag) {
    const posts = await db.raw(
      `SELECT n.*, to_json(array_agg(DISTINCT t.*)) AS tags, to_json(array_agg(DISTINCT c.*)) AS comments, to_json(array_agg(DISTINCT u.*)) AS user FROM post_tags AS pt LEFT OUTER JOIN newsfeed_posts AS n ON n.id = pt.newsfeed_id LEFT OUTER JOIN tags AS t ON t.id = pt.tag_id LEFT OUTER JOIN comments AS c ON c.post_id = pt.newsfeed_id LEFT OUTER JOIN users AS u ON u.id = n.user_id WHERE pt.tag_id IN (SELECT id FROM tags AS t WHERE t.hashtag = '${tag}') GROUP BY n.id`
    )
    return { msg: 'success', posts: posts.rows }
  },
  async createFriendship(user_id, tag) {
    const tagId = await db('tags')
      .select('id')
      .where({ hashtag: tag })
      .first()
    if (tagId) {
      const insert = await db('tag_friendships').insert({
        user_id,
        tag_id: tagId.id,
      })
      if (insert) {
        return { msg: 'success' }
      }
    } else {
      return { msg: 'no tag fround' }
    }
  },
  async unfollowTag(user_id, tag) {
    try {
      const tagId = await db('tags')
        .select('id')
        .where({ hashtag: tag })
        .first()
      if (tagId) {
        const unfollowTag = await db('tags')
          .del()
          .where({ tag_id: tagId.id })
          .returning('*')
        if (unfollowTag) {
          return { msg: 'success', unfollowTag: unfollowTag[0] }
        }
      } else {
        return { msg: '404' }
      }
    } catch (err) {
      return { msg: 'error', err }
    }
  },
}
