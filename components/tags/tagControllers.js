const helpers = require('./tagHelpers')
module.exports = {
  // async findOrCreateTag(req, res, next) {
  //   const tag = await db('tags')
  //     .where('hashtag', req.body.hashtag)
  //     .first()
  //   console.log(tag)
  //   if (tag) {
  //     return { msg: 'success' }
  //   } else {
  //     await db('tags').insert(req.body.hashtag)
  //   }
  // },
  async getTagPosts(req, res, next) {
    const tag = req.params.tag
    if (tag) {
      const response = await helpers.getPostsWithTag(tag)
      if (response.msg === 'success') {
        // DO NOT USE THE ID OF THIS RESPONSE
        res.status(200).json(response.posts)
      } else {
        res.status(200).json({ msg: response.msg })
      }
    } else {
      res
        .status(400)
        .json({ msg: 'missing params. requires tags on header params' })
    }
  },
  async followTag(req, res, next) {
    const { tag } = req.body
    const user_id = req.user === undefined ? req.body.user_id : req.user.id
    if (user_id && tag) {
      const response = await helpers.createFriendship(user_id, tag)
      if (response.msg === 'success') {
        res.status(200).json(response)
      } else {
        res.status(500).json({ response })
      }
    } else {
      res.status(400).json({ msg: 'missing body. requires tag & user_id' })
    }
  },
  async unfollowTag(req, res, next) {
    const { tag } = req.body
    const user_id = req.user === undefined ? req.body.user_id : req.user.id
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
}
