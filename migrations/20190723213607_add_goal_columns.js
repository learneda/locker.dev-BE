exports.up = function(knex) {
  return knex.schema.table('goals', tbl => {
    tbl.boolean('recommended')
    tbl.boolean('completed')
    tbl.boolean('shared')
    tbl.integer('mastery')
  })
}

exports.down = function(knex) {
  return knex.schema.table('goals', tbl => {
    tbl.dropColumns('mastery', 'completed', 'shared', 'recommended')
  })
}
