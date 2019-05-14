exports.up = function(knex, Promise) {
	return knex.schema.createTable('locker', (tbl) => {
		tbl.increments('id');
		tbl.integer('user_id');
		tbl.integer('pocket_id');
		tbl.integer('goodreads_id');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('locker');
};
