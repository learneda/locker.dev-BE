const db = require('../../dbConfig')
const { postHandleComment } = require('./commentService')
module.exports = {
  async getAllComments(req, res, next) {
    try {
      const selectAllComments = await db('comments')
      res.status(200).json(selectAllComments)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },
  async postComment(req, res, next) {
    const user_id = req.user.id

    if (user_id) {
      try {
        const result = await postHandleComment(req.body)
        res.status(201).json(result)
      } catch (err) {
        console.log(err)
        res.status(500).json(err)
      }
    } else {
      res.status(417).json({ msg: 'dont have access' })
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
          res.status(200).json({ msg: 'comment successfully deleted' })
        } else {
          res.status(317).json({ msg: 'something went wrong' })
        }
      } catch (err) {
        console.log(err)
        res.status(500).json(err)
      }
    } else {
      res.status(500).json({ msg: 'no user_id' })
    }
  },
}
