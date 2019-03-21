exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments('id');
    tbl
      .string('email', 254)
      .notNullable()
      .unique();
    tbl.string('password').nullable();
    tbl.string('display_name', 20).notNullable();
    tbl.string('profile_picture').nullable();
    tbl.timestamp('created_at').defaultTo(knex.fn.now());
    tbl.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
