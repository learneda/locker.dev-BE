const faker = require('faker');
const fakeInsertData = [];

const posts_array = [
  {
    post_url: 'https://riley.gg',
    user_id: 1,
    // categories: ['JS', 'Jquery', 'CSS'],
    liked: true,
    completed: true,
    rating: 3,
    description: 'wanna get stuff done ? hmu . checkout my work at my own domain. lmk i got websites on decc.',
    title: 'Riley.gg',
    thumbnail_url: 'https://riley.gg/img/seo-landing.jpg'
  },
  {
    post_url: 'https://www.youtube.com/watch?v=HSwjGP19rTg',
    user_id: 1,
    // categories: ['youtube', 'freedomjs'],
    liked: true,
    rating: 5,
    description: 'oughta make those big moves hawmies',
    title: '10 things to be more productive',
  },
  {
    post_url: 'https://www.youtube.com/watch?v=qtURixlmp6M',
    user_id: 2,
    // categories: ['C'],
    liked: false,
    completed: false,
    description: 'take it ot the face',
    title: 'OG',
    thumbnail_url: 'https://riley.gg/img/seo-landing.jpg'
  },
  {
    post_url: 'https://www.youtube.com/watch?v=93p3LxR9xfM',
    user_id: 2,
    // categories: ['python'],
    liked: false,
    completed: true,
    rating: 2,
    description: 'I TRAP HARD',
    title: 'COOKIES'
    },
  {
    post_url: 'http://www.thinklikeahorse.org',
    user_id: 2,
    // categories: ['python'],
    liked: false,
    completed: true,
    rating: 2,
    description: 'think like your horse. dont cause it pain ...',
    title: 'Think Like A Horse',
    thumbnail_url: ''
  }
];

fakeInsertData.push(...posts_array)

for (let i = 1; i < 500; i++) {
  const post_url = faker.internet.url()
  const user = {
    post_url,
    user_id: i
  };

  fakeInsertData.push(user);
};
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('posts').insert(fakeInsertData);
    });
};
