exports.up = function(knex, Promise) {
  return knex.schema.createTable('saved_post_id', tbl => {
    tbl.increments('id')
    tbl.integer('user_id')
    tbl
      .integer('post_id')
      .references('id')
      .inTable('posts')
      .onDelete('cascade')

    tbl.integer('saved_from_id')
    tbl.boolean('saved_to_profile').defaultTo(true)

    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('saved_post_id')
}
