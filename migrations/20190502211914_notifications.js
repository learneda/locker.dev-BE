
exports.up = function(knex, Promise) {
  return knex.schema.createTable('notifications', tbl => {
      tbl.increments('id')

      tbl.integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('cascade');

      tbl.integer('post_id')
        .references('id')
        .inTable('posts')
        .onDelete('cascade');

      tbl.boolean('read').defaultTo(false)

      tbl.string('type')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('notifications');
};
