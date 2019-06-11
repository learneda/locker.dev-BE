import db from '../../knexfile'
module.exports = {
  async findOrCreateTag(req, res, next)  {
      const tag = await db('tags').where('hashtag', req.body.tagText)
    if (tag) {
      //
      res
    } else  {
      await try db('tags').insert(req.body)
    }
  },
}