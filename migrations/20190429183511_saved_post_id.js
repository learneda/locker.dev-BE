exports.up = function(knex, Promise) {
  // entry to this tbl will only happen when creating a new record in posts tbl
  // from an existing user's posts record
  return knex.schema.createTable('saved_post_id', tbl => {
    tbl.increments('id')
    tbl.integer('user_id')
    // post_id = is the id of the original record
    tbl
      .integer('post_id')
      .references('id')
      .inTable('posts')
      .onDelete('cascade')
    // saved_from_id = is id of the user who owns the original record
    tbl.integer('saved_from_id')
    // will always be true ....
    tbl.boolean('saved_to_profile').defaultTo(true)

    // the id of the newly created record in posts tbl that originated from post_id record
    tbl.integer('created_post_id')

    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('saved_post_id')
}
