exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        // user signs up with bycrpt func
        {first_name: 'Homer', last_name:'Simpson', email: 'homer@gmail.com', password: 'donut', display_name: 'Homer Simpson', profile_picture: 'https://www.bing.com/th?id=OIP.zJDfhDqqdSzLH7DVLColvQHaE8&pid=Api&dpr=2.5&rs=1&p=0'},
        // user signs up with github
        { email: 'jonsnow@goft.com', display_name: 'Jon Snow', profile_picture:'https://www.carid.com/images/snow-joe/patio-and-garden/sj624e-6.jpg'
       }, 
      ]);
    });
};
