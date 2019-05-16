exports.up = function(knex, Promise) {
	return knex.schema.createTable('users', (tbl) => {
		tbl.increments('id')
		tbl.string('email', 254).unique()
		tbl.string('username').nullable().unique()
		tbl.string('display_name')
		tbl.string('profile_picture').nullable()
		tbl.string('github_id').nullable()
		tbl.string('google_id').nullable()
		tbl.string('bio')
		tbl.string('location')
		tbl.string('website_url')
		tbl.string('facebook_url')
		tbl.string('github_url')
		tbl.string('twitter_url')
		tbl.timestamp('created_at').defaultTo(knex.fn.now())
		tbl.timestamp('updated_at').defaultTo(knex.fn.now())
	})
}

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('users')
}
