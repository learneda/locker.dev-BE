const db = require('../../dbConfig');

// USER HELPERS
// ==============================================
module.exports = {
  get: function(id) {
    let query = db('users');
    if (id) query.where('id', Number(id)).first();
    return query;
  },
  createUser: function (user) {
    return db('users').insert(user)
    .then(ids => {
      console.log('created user return ==>',ids)
      return { id: ids[0] }
    });
  }
};
