const db = require('../../dbConfig')
module.exports = {
  async generateNewsFeed(user_id, offset) {
    try {
      // retreive all records that belongs to user & select friend id
      let friends = await db('friendships')
        .where({ user_id })
        .select('friend_id')

      // creating an array with only friend id integers
      friends = friends.map(friend => friend.friend_id)

      console.log(friends, 'friends')

      // generating newsfeed from user friendship relationships
      const newsFeed = await db('newsfeed_posts as n')
        .select('*')
        .whereIn('n.user_id', [...friends, Number(user_id)]) // all friends + self user

      // ====== GETTING POST FROM FOLLOWING TAGS RELATIONSHIPS ======

      let friendshipTagArr = await db('tag_friendships').where({ user_id })
      /// an array of tag id integers that user follows
      friendshipTagArr = friendshipTagArr.map(tag => tag.tag_id)

      console.log('this is myfriendshipArr', friendshipTagArr)

      // an array of all post objects that contain the tags a user follows
      let tagPostArr = await db('post_tags').whereIn('tag_id', friendshipTagArr)
      console.log('tagPostArr ==> \n', tagPostArr)

      // creating arr of newsfeed_post record ids
      let tagPostIdsArr = tagPostArr.map(obj => obj.newsfeed_id) // these only come from association of tags a user follows

      console.log('tagPostIdArr ==> \n', tagPostIdsArr)

      // creating an arr of newfeed_posts id integers that come from following other users(friendships)
      let newsfeedIdsArr = newsFeed.map(post => post.id)

      console.log('newsfeedIdsArr', newsfeedIdsArr)
      // creating ultimate array with post ids integers that come from following friends and following tags
      // using Set() to get rid of duplicate newsfeed post id's
      const filteredNewsfeedIds = [
        ...new Set([...tagPostIdsArr, ...newsfeedIdsArr]),
      ]

      console.log('FINAL NEWSFEED IDS\n', filteredNewsfeedIds)
      // getting the final newsfeed post records with all correct IDs
      const finalNewsfeed = await db('newsfeed_posts as n')
        .select(
          'display_name',
          'profile_picture',
          'user_id',
          'title',
          'thumbnail_url',
          'user_thoughts',
          'n.id as news_id',
          'url',
          'type_id',
          'n.created_at AS posted_at_date'
        )
        .whereIn('n.id', filteredNewsfeedIds)
        .join('users', 'n.user_id', '=', 'users.id')
        .orderBy('n.created_at', 'desc')

      const commentLoop = async () => {
        for (let post of finalNewsfeed) {
          // correcting post.id value ....
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
          // attach comment arr to post object
          post.comments = commentArray

          // get all existing records of this post on the likes tbl
          const likeCount = await db('posts_likes')
            .where('post_id', post.id)
            .countDistinct('user_id')
          // attching post like count to post object
          post.likes = Number(likeCount[0].count)

          // checking if user has liked this post
          const hasLiked = await db('posts_likes').where({
            post_id: post.id,
            user_id: Number(user_id),
          })
          // if response is not empty has hasLiked is true else false
          post.hasLiked = hasLiked.length > 0 ? true : false
          // ========== ATTACHING TAGS ========
          const tags = await db('post_tags')
            .where({ newsfeed_id: post.id })
            .join('tags', 'tags.id', 'post_tags.tag_id')

          post.tags = tags
        }
      }
      await commentLoop()
      return { msg: 'success', newsFeed: finalNewsfeed }
    } catch (err) {
      return err
    }
  },

  // ================ posting to newsfeed from saved collection ================
  async createNewsfeedRecord(user, post) {
    function myTrim(x) {
      return x.replace(/^\s+|\s+$/gm, '')
    }
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
      record.tags = []
      // ================ TAG LOGIC ================
      console.log(post)
      const lowerCaseTags = post.tags.toLowerCase()
      console.log('are they all lower case ?', lowerCaseTags)

      //* =========== need to fix triming of tags =========
      const tagArr = myTrim(lowerCaseTags).split('#')

      console.log('tag arrr', tagArr)

      const tagLoop = async () => {
        for (let tag of tagArr) {
          if (tag) {
            const isExisting = await db('tags')
              .where('hashtag', tag)
              .first()
            console.log(isExisting)
            console.log(!isExisting)
            if (isExisting) {
              record.tags.push({ hashtag: isExisting.hashtag })
              console.log('record', record)
              await db('post_tags').insert({
                newsfeed_id: record.id,
                tag_id: isExisting.id,
              })
            }
            ///============== FIX INCREMENT PROBLEM ============
            if (!isExisting) {
              console.log('in here', tag)
              const newTagRecord = await db('tags')
                .insert({ hashtag: tag })
                .returning('*')

              await db('post_tags').insert({
                newsfeed_id: record.id,
                tag_id: newTagRecord[0].id,
              })
              record.tags.push({ hashtag: newTagRecord[0].hashtag })
            }
          }
        }
      }
      await tagLoop()
      record.comments = []
      record.likes = 0

      return { msg: 'success', record }
    } catch (err) {
      return { msg: 'error', err }
    }
  },
}
