exports.up = function(knex, Promise) {
  return knex.schema.createTable('tag_friendships', tbl => {
    tbl.increments('id')
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade')
      .unsigned()
    tbl.integer('tag_id')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('tag_friendships')
}
