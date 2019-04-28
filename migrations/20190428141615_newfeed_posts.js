
exports.up = function(knex, Promise) {
  return knex.schema.createTable('newsfeed_posts', tbl => {
      tbl.increments('id')
      tbl.integer('post_id')
      .references('id')
      .inTable('posts')
      .onDelete('cascade')
      .onUpdate('cascade')
      .unsigned();
      tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade')
      .unsigned();
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('newsfeed_posts');
};
