exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', tbl => {
    tbl.increments('id')
    tbl.text('post_url').notNullable()
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade')
      .unsigned()
    tbl.integer('folder_id')
    tbl.boolean('shared').defaultTo(false)
    tbl.boolean('completed').defaultTo(false)
    tbl.integer('rating').nullable()
    tbl.text('title').nullable()
    tbl.text('description').nullable()
    tbl.text('thumbnail_url').nullable()
    tbl.text('user_thoughts').nullable()
    tbl.text('root_url')
    tbl.string('type_id')
    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts')
}
