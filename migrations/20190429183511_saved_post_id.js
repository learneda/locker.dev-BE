exports.up = function(knex, Promise) {
  return knex.schema.createTable('saved_post_id', tbl => {
    tbl.increments('id');
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade');
    tbl
      .integer('post_id')
      .references('id')
      .inTable('posts');

    tbl
      .integer('saved_from_id')
      .references('id')
      .inTable('users');

    tbl.timestamp('created_at').defaultTo(knex.fn.now());
    tbl.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('saved_post_id');
};
