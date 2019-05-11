
exports.up = function(knex, Promise) {
  return knex.schema.createTable('goodreads_books', tbl => {
      tbl.increments('id')
      tbl.integer('book_id')
      tbl.text('img_url')
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('goodreads_books')
};
