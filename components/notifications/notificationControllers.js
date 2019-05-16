const db = require('../../dbConfig')
module.exports = {
	async readNotifications(req, res, next) {
		try {
			const read = await db('notifications').update('read', true).where({ user_id: req.user.id })
			if (read) {
				res.status(200).json({ msg: 'succces' })
			}
		} catch (err) {
			console.log(err)
			res.status(200).json({ err })
		}
	},

	async clearNotifications(req, res, next) {
		try {
			const clear = await db('notifications').del().where('user_id', req.user.id)
			if (clear) {
				res.status(200).json({ msg: 'success' })
			}
		} catch (err) {
			console.log(err)
			res.status(200).json({ err })
		}
	}
}
