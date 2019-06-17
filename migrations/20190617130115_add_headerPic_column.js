exports.up = function(knex, Promise) {
  return knex.schema.table('users', table => {
    table.string('header_picture')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('users', table => {
    table.dropColumns('header_picture')
  })
}
