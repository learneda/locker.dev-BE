exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('posts').insert([
        { post_url: "https://riley.gg", user_id:1, categories: ['JS', 'Jquery', 'CSS'], recommended: true, completed: true, rating: 3},
        { post_url: "https://www.youtube.com/watch?v=HSwjGP19rTg", user_id:1, categories: ['youtube', 'freedomjs'], recommended: true, rating:5  },
        { post_url: "https://www.youtube.com/watch?v=qtURixlmp6M", user_id:2, categories: ['C'], recommended: false, completed: false, },
        { post_url: "https://www.youtube.com/watch?v=93p3LxR9xfM", user_id:2, categories:['python'], recommended: false, completed: true,rating:2 }
      ]);
    });
};
