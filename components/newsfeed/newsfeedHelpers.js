const db = require('../../dbConfig')
module.exports = {
  async generateNewsFeed(user_id, offset) {
    try {
      let friends = await db('friendships')
        .where({ user_id })
        .select('friend_id')

      friends = friends.map(friend => friend.friend_id)

      const friendsAndCurrentUser = [...friends, Number(user_id)]

      console.log(friends, 'friends')

      const newsFeed = await db('newsfeed_posts as n')
        .whereIn('n.user_id', friendsAndCurrentUser)
        .join('users', 'n.user_id', '=', 'users.id')
        .orderBy('n.created_at', 'desc')
        .offset(offset)
        .select('*', 'n.created_at AS posted_at_date')
        .limit(5)

      const commentLoop = async () => {
        for (let post of newsFeed) {
          post.comments = []

          const commentArray = await db('comments as c')
            .select(
              'c.id',
              'c.created_at',
              'c.content',
              'c.user_id',
              'c.post_id',
              'u.username'
            )
            .where('c.post_id', '=', post.id)
            .join('users as u', 'c.user_id', 'u.id')
            .orderBy('c.id', 'asc')

          post.comments.push(...commentArray)

          const likeCount = await db('posts_likes')
            .where('post_id', post.id)
            .countDistinct('user_id')
          post.likes = Number(likeCount[0].count)
        }
        if (newsFeed) {
          return { msg: 'success', newsFeed: newsFeed }
        } else {
          return { msg: 'err' }
        }
      }
      commentLoop()
    } catch (err) {
      return err
    }
  },

  // ================ posting to newsfeed from saved collection ================
  async createNewsfeedRecord(user, post) {
    try {
      const newInsert = await db('newsfeed_posts')
        .insert({
          user_id: user,
          title: post.title,
          description: post.description,
          url: post.post_url,
          user_thoughts: post.user_thoughts,
          type_id: 8,
        })
        .returning('*')
      return { msg: 'success', record: newInsert[0] }
    } catch (err) {
      return { msg: 'error', err }
    }
  },
}
