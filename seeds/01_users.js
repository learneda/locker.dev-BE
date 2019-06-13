const faker = require('faker')
const fakeInsertData = []

for (let i = 1; i < 100; i++) {
  const username = faker.internet.userName()
  const location = faker.address.city()
  const profile_picture = faker.image.avatar()

  const user = {
    username: username,
    location,
    profile_picture,
  }

  fakeInsertData.push(user)
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert(fakeInsertData)
    })
}
