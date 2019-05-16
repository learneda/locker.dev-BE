exports.up = function(knex, Promise) {
  return knex.schema.createTable('pocket', tbl => {
    tbl.increments('id')
    tbl.integer('user_id')
    tbl.text('resolved_title').nullable() // title
    tbl.text('resolved_url') // url
    tbl.boolean('favorited').defaultTo(false) // if !0 => true
    tbl.text('top_image_url') // img
    tbl.text('excerpt') // description
    tbl.text('item_id')
    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('pocket')
}
