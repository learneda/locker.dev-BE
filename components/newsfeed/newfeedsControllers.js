const helpers = require('./newsfeedHelpers')

module.exports = {
  async getNewsfeed(req, res, next) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id
    const offset = req.query.offset
    const newsfeedResponse = await helpers.generateNewsFeed(user_id, offset)
    if (newsfeedResponse) {
      res.status(200).json(newsfeedResponse.newsFeed)
    } else {
      res.status(500).json({ msg: 'something went wrong' })
    }
  },

  async postToNewsfeed(req, res, next) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id
    if (req.body.post) {
      const response = await helpers.createNewsfeedRecord(
        user_id,
        req.body.post
      )
      if (response.msg === 'success') {
        res.status(200).json(response.record)
      } else {
        res.status(500).json(response)
      }
    } else {
      res.status(400).json({ msg: 'missing body' })
    }
  },
  async getSingleNewsfeedPost(req, res, next) {
    const postId = req.params.id
    if (postId) {
      const response = await helpers.getPost(postId, req.user.id)
      if (response.msg === 'success') {
        res.status(200).json(response)
      } else if (response.msg === 'error') {
        res.status(500).json(response)
      }
    } else {
      res.status(400).json({ msg: 'missing id on header params' })
    }
  },
  async deleteNewsfeedPost(req, res, next) {
    const postId = req.params.id
    if (postId) {
      const response = await helpers.deletePost(postId, req.user.id)
      if (response.msg === 'success') {
        res.status(200).json(response)
      } else if (response.msg === 'error') {
        res.status(500).json(response)
      } else if (response.msg === '403') {
        res.status(403).json({ msg: "post doesn't belong to you" })
      }
    } else {
      res.status(400).json({ msg: 'missing id on header params' })
    }
  },
  async getUserNewsfeedPosts(req, res, next) {
    const offset = req.query.offset
    const userId = req.params.id
    const currentUserId = req.user.id
    if (userId) {
      const response = await helpers.findUserPosts(
        userId,
        currentUserId,
        offset
      )
      if (response.msg === 'success') {
        res.status(200).json(response)
      } else {
        res.status(500).json(response)
      }
    } else {
      res.status(400).json({ msg: 'missing id on header params' })
    }
  },
}
