exports.up = function(knex, Promise) {
  return knex.schema.createTable('newsfeed_posts', tbl => {
    tbl.increments('id')

    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade')
      .unsigned()

    tbl.string('title')
    tbl.text('description')
    tbl.string('thumbnail_url', 500)
    tbl.string('user_thoughts')
    tbl.string('url')
    tbl.integer('type_id')
    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('newsfeed_posts')
}
