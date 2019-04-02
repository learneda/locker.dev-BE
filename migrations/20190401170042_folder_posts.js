
exports.up = function(knex, Promise) {
  return knex.schema.createTable('folder_posts', tbl => {
    tbl.increments('id');

    tbl.integer('folder_id')
    .references('id')
    .inTable('folders')
    .onDelete('cascade')
    .onUpdate('cascade')
    .unsigned();

    tbl.integer('post_id')
    .references('id')
    .inTable('posts')
    .onDelete('cascade')
    .onUpdate('cascade')
    .unsigned();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('folder_posts');
};
