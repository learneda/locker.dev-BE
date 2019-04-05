
exports.up = function(knex, Promise) {
  return knex.schema.createTable('friendships', tbl => {
    tbl.increments('id');
    tbl.string('user_id').notNullable();
    tbl.string('friend_id').notNullable();
    tbl.timestamp('created_at').defaultTo(knex.fn.now());
    tbl.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('friendships');

};
