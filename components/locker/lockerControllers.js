const db = require('../../dbConfig')

module.exports = {
  async getLocker(req, res, next) {
    if (req.user) {
      const pocketLocker = await db('locker as l')
        .where('l.user_id', req.user.id)
        .join('pocket as p', 'p.id', 'l.pocket_id')

      const goodreadsLocker = await db('locker as l').join('goodreads as g', 'g.id', 'l.goodreads_id')

      const locker = [...goodreadsLocker, ...pocketLocker]

      if (locker) {
        res.status(200).json(locker)
      }
    }
  },
}
