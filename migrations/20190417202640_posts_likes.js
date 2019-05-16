exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts_likes', tbl => {
    tbl.increments('id')
    tbl.integer('post_id')
    tbl.integer('user_id')
    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts_likes')
}
