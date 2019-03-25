exports.up = function(knex, Promise) {
  return knex.schema.createTable('saved_courses', tbl => {
    tbl.increments('id');
    tbl.string('title').notNullable();
    tbl.string('description').notNullable();
    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('saved_courses');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('saved_courses');
};
