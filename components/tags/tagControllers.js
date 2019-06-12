import db from '../../knexfile'
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
}
