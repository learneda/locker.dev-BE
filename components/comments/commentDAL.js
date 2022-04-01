const db = require('../../dbConfig')

function insertComment(comment) {
  const { content, user_id, post_id } = comment
  return db('comments')
    .insert({
      content,
      user_id,
      post_id,
    })
    .returning('*')
}

module.exports = { insertComment }
