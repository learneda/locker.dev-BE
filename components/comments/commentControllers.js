const db = require('../../dbConfig')
const io = require('../../index')
const helpers = require('./commentHelpers')

module.exports = {
  async getAllComments(req, res, next) {
    try {
      const selectAllComments = await db('comments')
      res.status(200).json(selectAllComments)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  async insertComment(req, res, next) {
    const user_id = req.user.id
    if (!user_id) {
      return res.status(403).json({ msg: 'dont have access' })
    }
    // need some type of validation for comment content string
    try {
      const helper = await helpers.insertComment(req.body, user_id)
      return res.status(helper.statusCode).json(helper.response)
    } catch (err) {
      return res.status(500).json({ msg: 'fatal error something went wrong' })
    }
  },
  async deleteComment(req, res, next) {
    const user_id = req.user.id
    if (user_id) {
      try {
        const deletePromise = await db('comments')
          .where('id', req.params.id)
          .del()
        if (deletePromise) {
          res.status(204).json({ msg: 'comment successfully deleted' })
        } else {
          res.status(317).json({ msg: 'something went wrong' })
        }
      } catch (err) {
        res.status(500).json(err)
      }
    } else {
      res.status(500).json({ msg: 'no user_id' })
    }
  },
}
