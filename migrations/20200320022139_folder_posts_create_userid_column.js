exports.up = function(knex) {
  return knex.schema.table('folder_posts', tbl => {
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade')
      .unsigned()
  })
}

exports.down = function(knex) {
  return knex.schema.table('folder_posts', tbl => {
    tbl.dropColumns('user_id')
  })
}
