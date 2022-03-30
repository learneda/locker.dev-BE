const router = require('express').Router()
const {
  getAllComments,
  deleteComment,
  postComment,
} = require('./commentControllers')

router.get('/', getAllComments)

router.post('/', postComment)

router.delete('/:id', deleteComment)

module.exports = router
