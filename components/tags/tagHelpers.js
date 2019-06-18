const db = require('../../dbConfig')
module.exports = {
  async getPostsWithTag(tag, userId) {
    const posts = await db.raw(
      `SELECT n.*, to_json(array_agg(DISTINCT t.*)) AS tags, to_json(array_agg(DISTINCT c.*)) AS comments, to_json(array_agg(DISTINCT u.*)) AS user FROM post_tags AS pt LEFT OUTER JOIN newsfeed_posts AS n ON n.id = pt.newsfeed_id LEFT OUTER JOIN tags AS t ON t.id = pt.tag_id LEFT OUTER JOIN comments AS c ON c.post_id = pt.newsfeed_id LEFT OUTER JOIN users AS u ON u.id = n.user_id WHERE pt.tag_id IN (SELECT id FROM tags AS t WHERE t.hashtag = '${tag}') GROUP BY n.id`
    )

    const isFollowing = await db.raw(
      `SELECT * FROM tag_friendships AS tf WHERE tf.tag_id IN (SELECT id FROM tags AS t WHERE t.hashtag = '${tag}') AND tf.user_id = ${userId}`
    )

    const responsePost = posts.rows

    const commentLoop = async () => {
      for (let post of responsePost) {
        for (let comment of post.comments) {
          if (comment) {
            const username = await db('users')
              .select('username')
              .where({ id: comment.user_id })
              .first()
            comment.username = username.username
          }
        } /// end of 4Loop
        // =========== attaching like data ==========
        const likeCount = await db('posts_likes')
          .where('post_id', post.id)
          .countDistinct('user_id')
        // attching post like count to post object
        post.likes = Number(likeCount[0].count)

        const hasLiked = await db('posts_likes').where({
          post_id: post.id,
          user_id: Number(userId),
        })
        // if response is not empty has hasLiked is true else false
        post.hasLiked = hasLiked.length > 0 ? true : false

        post.profile_picture = post.user[0].profile_picture

        // =========== attaching pony data =============
        const ponyCount = await db('posts_ponies')
          .where('post_id', post.id)
          .countDistinct('user_id')

        post.ponyCount = Number(ponyCount[0].count)

        const hasPony = await db('posts_ponies').where({
          post_id: post.id,
          user_id: Number(userId),
        })

        post.hasPony = hasPony.length > 0 ? true : false
      }
    }
    await commentLoop()

    const response = {
      posts: responsePost,
      isFollowing: isFollowing.rows.length > 0 ? true : false,
    }

    return { msg: 'success', response }
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
  async findTopTags() {
    try {
      const topTags = await db('tags as t').limit(28)
      if (topTags.length) {
        return { msg: 'success', topTags }
      }
    } catch (err) {
      return { msg: 'error', err }
    }
  },
}
