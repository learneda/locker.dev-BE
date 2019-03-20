exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (tbl) => {
    tbl.increments()
    tbl.string('email').notNullable().unique()
    tbl.string('password').nullable()
    tbl.string('name').notNullable()
    tbl.string('profile_picture').nullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('users')
}
