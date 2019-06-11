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
}
