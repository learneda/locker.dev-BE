
exports.up = function(knex, Promise) {
    return knex.schema.table('posts', (tbl) => {
        tbl.dropColumn('liked')
        tbl.integer('likes').defaultTo(0)
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('posts', (tbl) => {
        tbl.dropColumn('likes')
    })
};
