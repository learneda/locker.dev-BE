exports.up = function(knex) {
  return knex.schema.table('posts', tbl => {
    tbl.dropColumns('mastery', 'completed', 'shared', 'recommended')
  })
}

exports.down = function(knex) {
  return knex.schema.table('posts', tbl => {
    tbl.boolean('recommended')
    tbl.boolean('completed')
    tbl.boolean('shared')
    tbl.integer('mastery')
  })
}
