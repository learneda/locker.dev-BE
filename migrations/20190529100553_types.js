exports.up = function(knex, Promise) {
  return knex.schema.createTable('types', tbl => {
    tbl.increments('id')
    tbl.string('type_title')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('types')
}
