exports.up = function(knex) {
  return knex.schema.table('posts', tbl => {
    tbl.dropColumns('mastry', 'completed', 'shared', 'recommended')
  })
}

exports.down = function(knex) {
  tbl.boolean('recommended')
  tbl.boolean('completed')
  tbl.boolean('shared')
  tbl.integer('mastry')
}
