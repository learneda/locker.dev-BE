exports.up = function(knex, Promise) {
  return knex.schema.createTable('post_tags', tbl => {
    tbl.increments('id')
    tbl
      .integer('newsfeed_id')
      .references('id')
      .inTable('newsfeed_posts')
      .onDelete('cascade')
      .onUpdate('cascade')
      .unsigned()
    tbl.integer('tag_id')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('post_tags')
}
