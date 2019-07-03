exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('types')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('types').insert([
        { id: 1, type_title: 'article' },
        { id: 2, type_title: 'course' },
        { id: 3, type_title: 'book' },
        { id: 4, type_title: 'video' },
        { id: 5, type_title: 'podcast' },
        { id: 6, type_title: 'pocket' },
        { id: 7, type_title: 'goodreads' },
        { id: 8, type_title: 'link' },
      ])
    })
}
