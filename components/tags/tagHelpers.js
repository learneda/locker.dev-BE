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

      // TARD WAY OF ATTACHING ADDITIONAL TAGS
      const hashtagLoop = async () => {
        for (let post of allPostWithTag) {
          const tags = await db('post_tags')
            .where({ newsfeed_id: post.newsfeed_id })
            .join('tags', 'tags.id', 'post_tags.tag_id')

          post.tags = tags
        }
      }
      await hashtagLoop()

      return { msg: 'success', allPostWithTag }
    } else {
      return { msg: 'no post with that tag' }
    }
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
