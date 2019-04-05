exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        // user signs up with bycrpt func
        {email: 'riley@gmail.com', username: 'riley_brown', profile_picture: 'https://www.bing.com/th?id=OIP.zJDfhDqqdSzLH7DVLColvQHaE8&pid=Api&dpr=2.5&rs=1&p=0'},
        
        {email: 'homer@gmail.com', username:'Homer_Simpson', profile_picture: 'https://www.bing.com/th?id=OIP.zJDfhDqqdSzLH7DVLColvQHaE8&pid=Api&dpr=2.5&rs=1&p=0'},
        // user signs up with github
        { email: 'jonsnow@goft.com', username: 'Jon Snow', profile_picture:'https://www.carid.com/images/snow-joe/patio-and-garden/sj624e-6.jpg'
       }, 
      ]);
    });
};
