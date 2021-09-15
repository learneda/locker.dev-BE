exports.up = function(knex, Promise) {
  return knex.schema.createTable('pocket', tbl => {
    tbl.increments('id')
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('cascade')
      .onUpdate('cascade')
      .notNullable()
    tbl.text('resolved_title').nullable() // title
    tbl.text('resolved_url') // url
    tbl.boolean('favorited').defaultTo(false) // if !0 => true
    tbl.text('top_image_url') // img
    tbl.text('excerpt') // description
    tbl.text('item_id')
    tbl.string('type_id')
    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists('integrations')
  return knex.schema.dropTableIfExists('pocket')
}
