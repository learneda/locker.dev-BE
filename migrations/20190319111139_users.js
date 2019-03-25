exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments('id');
    tbl.string('first_name').nullable();
    tbl.string('last_name').nullable();
    tbl
      .string('email', 254)
      .unique();
    tbl.string('password').nullable();
    tbl.string('display_name').notNullable();
    tbl.string('profile_picture').nullable();
    tbl.timestamp('created_at').defaultTo(knex.fn.now());
    tbl.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
