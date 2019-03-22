exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts')
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex('posts').insert([
        { post_url: "https://riley.gg" },
        { post_url: "https://www.youtube.com/watch?v=HSwjGP19rTg" },
        { post_url: "https://www.youtube.com/watch?v=-W_VsLXmjJU" },
        { post_url: "https://www.youtube.com/watch?v=93p3LxR9xfM" }
      ]);
    });
};
