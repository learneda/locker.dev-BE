exports.up = function(knex, Promise) {
  return knex.schema.createTable('goals', tbl => {
    tbl.increments('id')

    tbl
      .integer('post_id')
      .references('id')
      .inTable('posts')
      .onDelete('cascade')
      .onUpdate('cascade')
      .unsigned()

    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade')
      .unsigned()

    tbl.timestamp('goal_due')

    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('goals')
}
