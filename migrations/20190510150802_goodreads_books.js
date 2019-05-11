
exports.up = function(knex, Promise) {
  return knex.schema.createTable('goodreads_books', tbl => {
      tbl.increments('id')
      tbl.integer('book_id')
      tbl.text('book_url')
      tbl.text('img_url')
      tbl.text('description')
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('goodreads_books')
};
