exports.up = function(knex, Promise) {
  return knex.schema.dropTableIfExists('integrations').then(() => {
    return knex.schema.createTable('integrations', tbl => {
      tbl.increments('id')
      tbl
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade')
        .notNullable()

      tbl
        .integer('pocket_id')
        .references('id')
        .inTable('pocket')
        .onDelete('cascade')
        .onUpdate('cascade')

      tbl
        .integer('goodreads_id')
        .references('id')
        .inTable('goodreads')
        .onDelete('cascade')
        .onUpdate('cascade')
    })
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('integrations')
}
