exports.up = function(knex, Promise) {
  return knex.schema.createTable('goodreads', tbl => {
    tbl.increments('id')
    tbl.integer('user_id')
    tbl.text('book_id').nullable()
    tbl.text('title').nullable()
    tbl.text('author')
    tbl.text('shelf')
    tbl.text('link')
    tbl.text('rating')
    tbl.text('image')
    tbl.text('description')
    tbl.string('type_id')
    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('goodreads')
}
