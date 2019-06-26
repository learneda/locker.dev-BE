exports.up = function(knex, Promise) {
  return knex.schema.table('notifications', table => {
    table.dropColumn('post_id')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('notifications', table => {
    table
      .integer('post_id')
      .references('id')
      .inTable('posts')
      .onDelete('cascade')
  })
}
