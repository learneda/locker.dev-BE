exports.up = function(knex, Promise) {
  // entry to this tbl will only happen when creating a new record in posts tbl
  // from an existing user's posts record
  return knex.schema.createTable('saved_post_id', tbl => {
    tbl.increments('id')
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade')
      .notNullable()
    // post_id = is the id of the original record
    tbl
      .integer('post_id')
      .references('id')
      .inTable('newsfeed_posts')
      .onDelete('cascade')
      .onUpdate('cascade')
    // saved_from_id = is id of the user who owns the original record
    tbl
      .integer('saved_from_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade')

    // the id of the newly created record in posts tbl that originated from post_id record
    tbl
      .integer('created_post_id')
      .references('id')
      .inTable('posts')
      .onDelete('cascade')
      .onUpdate('cascade')

    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('saved_post_id')
}
