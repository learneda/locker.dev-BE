exports.up = function(knex, Promise) {
  return knex.schema.table('posts', tbl => {
    tbl.renameColumn('rating', 'mastery')
    tbl.boolean('recommended')
  })

exports.down = function(knex, Promise) {
  return knex.schema.table('posts', tbl => {
    tbl.renameColumn('mastery', 'rating')
    tbl.dropColumns('recommended')
  })
}
