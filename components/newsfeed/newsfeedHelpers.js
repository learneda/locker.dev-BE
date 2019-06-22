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

      // generating newsfeed from user friendship relationships
      const newsFeed = await db('newsfeed_posts as n')
        .select('*')
        .whereIn('n.user_id', [...friends, Number(user_id)]) // all friends + self user

      // ====== GETTING POST FROM FOLLOWING TAGS RELATIONSHIPS ======

      let friendshipTagArr = await db('tag_friendships').where({ user_id })
      /// an array of tag id integers that user follows
      friendshipTagArr = friendshipTagArr.map(tag => tag.tag_id)

      // an array of all post objects that contain the tags a user follows
      let tagPostArr = await db('post_tags').whereIn('tag_id', friendshipTagArr)

      // creating arr of newsfeed_post record ids
      let tagPostIdsArr = tagPostArr.map(obj => obj.newsfeed_id) // these only come from association of tags a user follows

      // creating an arr of newfeed_posts id integers that come from following other users(friendships)
      let newsfeedIdsArr = newsFeed.map(post => post.id)

      // creating ultimate array with post ids integers that come from following friends and following tags
      // using Set() to get rid of duplicate newsfeed post id's
      const filteredNewsfeedIds = [
        ...new Set([...tagPostIdsArr, ...newsfeedIdsArr]),
      ]

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
          'n.created_at AS posted_at_date',
          'u.username',
          'n.description'
        )
        .whereIn('n.id', filteredNewsfeedIds)
        .join('users as u', 'n.user_id', '=', 'u.id')
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
          // attaching post like count to post object
          post.likes = Number(likeCount[0].count)

          const ponyCount = await db('posts_ponies')
            .where('post_id', post.id)
            .countDistinct('user_id')

          post.ponyCount = Number(ponyCount[0].count)

          const hasPony = await db('posts_ponies').where({
            post_id: post.id,
            user_id: Number(user_id),
          })

          post.hasPony = hasPony.length > 0 ? true : false

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
      if (Number(offset) < 5) {
        return { msg: 'success', newsFeed: finalNewsfeed.slice(0, 5) }
      }
      if (Number(offset)) {
        return {
          msg: 'success',
          newsFeed: finalNewsfeed.slice(Number(offset), Number(offset) + 5),
        }
      } else {
        return {
          msg: 'success',
          newsFeed: finalNewsfeed,
        }
      }
    } catch (err) {
      return err
    }
  },

  // ================ posting to newsfeed from saved collection ================
  async createNewsfeedRecord(user, post) {
    function myTrim(x) {
      x.replace("(s+|@|&|'|(|)|<|>)", '')
      return x.replace(/\s/g, '')
    }
    try {
      // collecting userDetails to attach to the response obj
      const userDetails = await db('users')
        .select('profile_picture', 'display_name', 'username')
        .where({
          id: user,
        })
        .first()
      //! do i need ?
      const type = await db('types')
        .select('id')
        .where('type_title', post.type)
        .first()
      console.log('type => ', type)

      // inserting to newsfeed
      const newInsert = await db('newsfeed_posts')
        .insert({
          user_id: user,
          title: post.title,
          description: post.description,
          url: post.post_url,
          user_thoughts: post.user_thoughts,
          thumbnail_url: post.thumbnail_url,
          type_id: post.type.id,
        })
        .returning('*')
      console.log(newInsert)
      const record = Object.assign(newInsert[0], userDetails)

      record.tags = []
      // ================ TAG LOGIC ================
      if (post.tags && post.tags.length) {
        const lowerCaseTags = post.tags.toLowerCase()
        const tagArr = myTrim(lowerCaseTags).split('#')
        console.log('tagArr', tagArr)
        const tagLoop = async () => {
          for (let tag of tagArr) {
            if (tag) {
              const isExisting = await db('tags')
                .where('hashtag', tag)
                .first()

              if (isExisting) {
                record.tags.push({ hashtag: isExisting.hashtag })
                await db('post_tags').insert({
                  newsfeed_id: record.id,
                  tag_id: isExisting.id,
                })
              }
              if (!isExisting) {
                const maxId = await db('tags')
                  .max('id')
                  .first()

                const newTagRecord = await db('tags')
                  .insert({ hashtag: tag, id: maxId.max + 1 })
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
      }
      record.comments = []
      record.likes = 0
      record.ponyCount = 0

      return { msg: 'success', record }
    } catch (err) {
      console.log(err)
      return { msg: 'error', err }
    }
  },
  async getPost(postId, userId) {
    // fetching postId record
    postId = Number(postId)
    try {
      const post = await db('newsfeed_posts as n')
        .where('n.id', postId)
        .join('users as u', 'n.user_id', 'u.id')
        .first()

      if (!post) {
        return { msg: 'post doesnt exist' }
      }
      // correcting post id
      post.id = postId

      // attaching post's comments
      const commentArray = await db('comments as c')
        .select(
          'c.id',
          'c.created_at',
          'c.content',
          'c.user_id',
          'c.post_id',
          'u.username'
        )
        .where('c.post_id', '=', postId)
        .join('users as u', 'c.user_id', 'u.id')
        .orderBy('c.id', 'asc')

      post.comments = commentArray

      const likeCount = await db('posts_likes')
        .where('post_id', postId)
        .countDistinct('user_id')
        .first()

      console.log('like post', Number(likeCount.count))

      post.likes = Number(likeCount.count)

      const hasLiked = await db('posts_likes').where({
        post_id: postId,
        user_id: Number(userId),
      })

      post.hasLiked = hasLiked.length > 0 ? true : false

      const tags = await db('post_tags')
        .where({ newsfeed_id: postId })
        .join('tags', 'tags.id', 'post_tags.tag_id')

      post.tags = tags

      const ponyCount = await db('posts_ponies')
        .where('post_id', postId)
        .countDistinct('user_id')

      post.ponyCount = Number(ponyCount[0].count)

      const hasPony = await db('posts_ponies').where({
        post_id: postId,
        user_id: Number(userId),
      })

      post.hasPony = hasPony.length > 0 ? true : false

      post.posted_at_date = post.created_at

      return { msg: 'success', post }
    } catch (err) {
      return { msg: 'error', err }
    }
  },
  async deletePost(postId, userId) {
    try {
      postId = Number(postId)
      userId = Number(userId)
      const post = await db('newsfeed_posts as n')
        .where('n.id', postId)
        .first()

      if (!post) {
        return { msg: 'post id isnt found' }
      }

      if (post.user_id === userId) {
        let deletedPost = await db('newsfeed_post as n')
          .where('n.id', postId)
          .del()
          .returning('*')
        deletedPost = deletedPost[0]
        return { msg: 'success', deletedPost }
      } else {
        return { msg: '403' }
      }
    } catch (err) {
      return { msg: 'error', err }
    }
  },
}
