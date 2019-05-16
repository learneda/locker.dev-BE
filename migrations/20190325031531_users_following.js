exports.up = function(knex, Promise) {
	return knex.schema.createTable('friendships', (tbl) => {
		tbl.increments('id')
		tbl.integer('user_id').notNullable()
		tbl.integer('friend_id').notNullable()
		tbl.timestamp('created_at').defaultTo(knex.fn.now())
		tbl.timestamp('updated_at').defaultTo(knex.fn.now())
	})
}

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('friendships')
}
