const helpers = require('./tagHelpers')
module.exports = {
  async getTagPosts(req, res, next) {
    const { tag } = req.params
    const { offset } = req.query

    if (tag) {
      const response = await helpers.getPostsWithTag(tag, req.user.id, offset)
      if (response.msg === 'success') {
        res.status(200).json(response)
      } else {
        res.status(200).json({ msg: response.msg })
      }
    } else {
      res.status(400).json({ msg: 'missing params. requires tags on header params' })
    }
  },
  async followTag(req, res, next) {
    const { tag } = req.params
    const user_id = req.user === undefined ? req.body.user_id : req.user.id
    if (user_id && tag) {
      const response = await helpers.createFriendship(user_id, tag)
      if (response.msg === 'success') {
        console.log(response.hashtag)
        res.status(200).json(response)
      } else if (response.msg === '404') {
        res.status(404).json({ msg: 'hashtag not found' })
      } else {
        res.status(500).json({ response })
      }
    } else {
      res.status(400).json({ msg: 'missing body. requires tag & user_id' })
    }
  },
  async unfollowTag(req, res, next) {
    const { tag } = req.params
    const user_id = req.user.id
    if (user_id && tag) {
      const response = await helpers.unfollowTag(user_id, tag)
      if (response.msg === 'success') {
        res.status(200).json(response)
      } else if (response.msg === '404') {
        res.status(404).json({ msg: 'tag ID not found' })
      } else {
        res.status(500).json(response)
      }
    } else {
      res.status(400).json({ msg: 'missing body. requires tag & user_id' })
    }
  },
  async getTopTags(req, res, next) {
    try {
      const response = await helpers.findTopTags()
      if (response.msg === 'success') {
        res.status(200).json(response.topTags)
      }
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  async getUserFollowingTag(req, res, next) {
    const response = await helpers.findUserTags(req.user.id)
    if (response.msg === 'success') {
      res.status(200).json(response.userTags)
    } else {
      res.status(500).json(response)
    }
  },
}
