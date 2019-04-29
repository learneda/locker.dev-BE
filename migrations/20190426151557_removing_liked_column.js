
exports.up = function(knex, Promise) {
    return knex.schema.table('posts', (tbl) => {
        tbl.dropColumn('liked')
    })
};

exports.down = function(knex, Promise) {
    
};
