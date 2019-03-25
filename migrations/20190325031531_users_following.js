
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users_following', tbl => {
    tbl.increments('id');
    tbl.string('profile_id').notNullable();
    tbl.string('following_id').notNullable();
    tbl.timestamp('created_at').defaultTo(knex.fn.now());
    tbl.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users_following');

};
