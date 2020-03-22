exports.up = function(knex) {
  return knex.schema.table('posts', tbl => {
    tbl.dropColumns('folder_id')
  })
}

exports.down = function(knex) {
  return knex.schema.table('posts', tbl => {
    tbl
      .integer('folder_id')
      .references('id')
      .inTable('folders')
      .onDelete('cascade')
      .onUpdate('cascade')
      .unsigned()
  })
}
