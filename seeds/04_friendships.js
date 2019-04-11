exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('friendships')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('friendships').insert([
        { user_id: 3, friend_id: 1 },
        { user_id: 3, friend_id: 2 },
        { user_id: 3, friend_id: 4 }
      ]);
    });
};
