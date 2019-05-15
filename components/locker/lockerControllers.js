const db = require('../../dbConfig')

module.exports = {
	async getLocker(req, res, next) {
		console.log(req.user.id)
		if (req.user) {
			const pocketLocker = await db('locker as l')
				.where('l.user_id', req.user.id)
				.join('pocket as p', 'p.id', 'l.pocket_id')

			const goodreadsLocker = await db('locker as l').join('goodreads as g', 'g.id', 'l.goodreads_id')

			const locker = [ ...goodreadsLocker, ...pocketLocker ]

			if (locker) {
				console.log(locker)
				res.status(200).json(locker)
			}
		}
	}
}
