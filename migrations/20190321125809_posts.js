exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', tbl => {
    tbl.increments('id');
    tbl.string('post_url', 254).notNullable();
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .unsigned();
    tbl.specificType('categories', 'TEXT[]');
    tbl.boolean('recommended').defaultTo(false);
    tbl.boolean('completed').defaultTo(false);
    tbl.timestamp('created_at').defaultTo(knex.fn.now());
    tbl.timestamp('updated_at').defaultTo(knex.fn.now());
    tbl.integer('rating').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts');
};
