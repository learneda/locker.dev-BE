const db = require('../../dbConfig')
module.exports = {
  async getPostsWithTag(tag) {
    const tagId = await db('tags')
      .select('id')
      .where({ hashtag: tag })
      .first()
    console.log(tagId)

    if (tagId) {
      const allPostWithTag = await db('post_tags as pt')
        .where({
          tag_id: Number(tagId.id),
        })
        .join('newsfeed_posts as n', 'n.id', 'pt.newsfeed_id')
        .join('users as u', 'u.id', 'n.user_id')
      return { msg: 'success', allPostWithTag }
    } else {
      return { msg: 'no post with that tag' }
    }
  },
}
