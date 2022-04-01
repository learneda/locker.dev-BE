const { insertComment } = require('./commentDAL')

function postHandleComment(body) {
  const { content, user_id, post_id } = body
  return insertComment({
    content,
    user_id,
    post_id,
  })
}

module.exports = { postHandleComment }
