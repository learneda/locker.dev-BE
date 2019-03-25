
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () {
      return knex('comments').insert([
        {id: 1, content: 'dope', post_id: 1, user_id: 1},
        {id: 2, content: 'ughhh', post_id:1, user_id: 2},
        {id: 3, content: 'youtube needs to stop bullying people !', post_id:3, user_id: 2}
      ]);
    });
};
