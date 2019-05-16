exports.up = function(knex, Promise) {
  return knex.schema.createTable('articles', tbl => {
    tbl.increments('id')
    tbl.text('url').notNullable()
    tbl.text('title').nullable()
    tbl.text('description').nullable()
    tbl.text('thumbnail').nullable()
    tbl.text('created')
    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('articles')
}
