exports.up = function (knex, Promise) {
  return knex.schema.createTable('notifications', (tbl) => {
    tbl.increments('id')
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade')
      .notNullable()
    tbl
      .integer('newsfeed_id')
      .references('id')
      .inTable('newsfeed_posts')
      .onDelete('cascade')
      .onUpdate('cascade')
      .notNullable()

    tbl.boolean('read').defaultTo(false)
    tbl.string('type')
    tbl.string('invoker')
    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('notifications')
}
