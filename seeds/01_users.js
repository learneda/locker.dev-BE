const faker = require('faker')
const fakeInsertData = []

for (let i = 1; i < 100; i++) {
  const username = faker.internet.userName()
  const location = faker.address.city()
  const profile_picture = faker.image.avatar()
  const display_name = faker.name.firstName()
  const user = {
    display_name,
    username,
    location,
    profile_picture,
  }

  fakeInsertData.push(user)
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert(fakeInsertData)
    })
}
