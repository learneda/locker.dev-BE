exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('comments')
    .del()
    .then(function() {
      return knex('comments').insert([
        { content: 'dope', post_id: 1, user_id: 1 },
      ])
    })
}
