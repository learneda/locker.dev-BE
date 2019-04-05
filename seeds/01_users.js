const faker = require('faker');
const fakeInsertData = [];
const user_array = [
  // user signs up with bycrpt func
  {email: 'riley@gmail.com', username: 'riley_brown', profile_picture: 'https://www.bing.com/th?id=OIP.zJDfhDqqdSzLH7DVLColvQHaE8&pid=Api&dpr=2.5&rs=1&p=0'},

  {email: 'homer@gmail.com', username:'Homer_Simpson', profile_picture: 'https://www.bing.com/th?id=OIP.zJDfhDqqdSzLH7DVLColvQHaE8&pid=Api&dpr=2.5&rs=1&p=0'},
  // user signs up with github
  { email: 'jonsnow@goft.com', username: 'Jon Snow', profile_picture:'https://www.carid.com/images/snow-joe/patio-and-garden/sj624e-6.jpg'
 }, 
];

fakeInsertData.push(...user_array);

for (let i = 1; i < 500; i++) {
  const username = faker.internet.userName();
  const location = faker.address.city();
  const profile_picture = faker.image.imageUrl();

  const user = {
    username: username,
    location,
    profile_picture
  };

  fakeInsertData.push(user);
};

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert(fakeInsertData);
    });
};
