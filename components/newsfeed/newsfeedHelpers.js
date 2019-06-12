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
        .select(
          'display_name',
          'profile_picture',
          'user_id',
          'title',
          'thumbnail_url',
          'user_thoughts',
          'n.id as news_id',
          'url',
          'type_id'
        )
        .whereIn('n.user_id', friendsAndCurrentUser)
        .join('users', 'n.user_id', '=', 'users.id')
        .orderBy('n.created_at', 'desc')
        .offset(offset)
        .select('*', 'n.created_at AS posted_at_date')
        .limit(5)
      console.log('is newsfeed Okay here ?????', newsFeed)
      const commentLoop = async () => {
        for (let post of newsFeed) {
          post.comments = []
          post.id = post.news_id

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
          console.log('how many comments ?', commentArray)
          post.comments.push(...commentArray)

          const likeCount = await db('posts_likes')
            .where('post_id', post.id)
            .countDistinct('user_id')
          console.log('how many likes ?', likeCount[0].count)
          post.likes = Number(likeCount[0].count)
          console.log('THIS IS ONE POST', post)
        }
      }
      await commentLoop()
      return { msg: 'success', newsFeed: newsFeed }
    } catch (err) {
      return err
    }
  },

  // ================ posting to newsfeed from saved collection ================
  async createNewsfeedRecord(user, post) {
    try {
      // collecting userDetails to attach to the response obj
      const userDetails = await db('users')
        .select('profile_picture', 'display_name')
        .where({
          id: user,
        })
        .first()
      // inserting to newsfeed
      const newInsert = await db('newsfeed_posts')
        .insert({
          user_id: user,
          title: post.title,
          description: post.description,
          url: post.post_url,
          user_thoughts: post.user_thoughts,
          thumbnail_url: post.thumbnail_url,
          type_id: 8,
        })
        .returning('*')
      const record = Object.assign(newInsert[0], userDetails)
      return { msg: 'success', record }
    } catch (err) {
      return { msg: 'error', err }
    }
  },
}
