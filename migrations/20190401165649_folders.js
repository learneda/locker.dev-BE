exports.up = function(knex, Promise) {
  return knex.schema.createTable('folders', tbl => {
    tbl.increments('id')
    tbl.string('folder_name').notNullable()
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade')
      .unsigned()
    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('folders')
}
