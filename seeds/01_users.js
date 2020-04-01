const faker = require('faker')

const allocateArr = Array(99).fill(null)

const createUserObj = ele => {
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
  return user
}
const fakeInsertData = allocateArr.map(createUserObj)
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert(fakeInsertData)
    })
}
