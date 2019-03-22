exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        { email: 'homer@gmail.com', display_name: 'Homer Simpson' },
        { email: 'jonsnow@goft.com', display_name: 'Jon Snow' }
      ]);
    });
};
