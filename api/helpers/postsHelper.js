const db = require('../../dbConfig');

// USER HELPERS
// ==============================================
module.exports = {
  get: function(id) {
    let query = db('posts');
    if (id) query.where('id', Number(id)).first();
    return query;
  }
};
