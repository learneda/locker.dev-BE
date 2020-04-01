const friends = Array(97)
  .fill(null)
  .map((_, index) => index + 1)
const fakeInsertData = friends.reduce((acc, curr, i) => {
  const friendshipID = friends
    .slice(i + 1)
    .splice(Math.floor(Math.random() * friends.length), 1)
    .pop()
  const friendshipObj = {
    user_id: i + 1,
    friend_id: friendshipID || i + 2,
  }

  return [...acc, friendshipObj]
}, [])
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('friendships')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('friendships').insert(fakeInsertData)
    })
}
