
exports.up = function(knex, Promise) {
  return knex.schema.createTable('online_users', tbl => {
      tbl.increments('id')
      tbl.integer('user_id')
      tbl.string('socket_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('online_users')
};
