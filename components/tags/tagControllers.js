const db = require('../../dbConfig')
const helpers = require('./tagHelpers')
module.exports = {
  async findOrCreateTag(req, res, next) {
    const tag = await db('tags')
      .where('hashtag', req.body.hashtag)
      .first()
    console.log(tag)
    if (tag) {
      return { msg: 'success' }
    } else {
      await db('tags').insert(req.body.hashtag)
    }
  },
  async getTagPost(req, res, next) {
    const tag = req.params.tag
    if (tag) {
      const response = await helpers.getPostsWithTag(tag)
      console.log('the response from the helper ;P', response)
      if (response.msg === 'success') {
        // DO NOT USE THE ID OF THIS RESPONSE
        res.status(200).json(response.allPostWithTag)
      } else {
        res.status(200).json({ msg: response.msg })
      }
    } else {
      res
        .status(400)
        .json({ msg: 'missing params. requires tags on header params' })
    }
  },
}
