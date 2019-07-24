exports.up = function(knex) {
  return knex.schema.table('goals', tbl => {
    tbl.boolean('recommended')
    tbl.boolean('completed')
    tbl.boolean('shared')
    tbl.integer('mastry')
  })
}

exports.down = function(knex) {
  return knex.schema.table('goals', => {
    tbl.dropColumns('mastry', 'completed', 'shared', 'recommended')
  })
}
