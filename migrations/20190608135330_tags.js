exports.up = function(knex, Promise) {
  return knex.schema.createTable('tags', tbl => {
    tbl.increments('id')
    tbl.string('hashtag', 20)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('tags')
}
