const fakeInsertData = []

const n_users = 99

for (let i = 1; i < 100; i++) {
  // array with all fake users id: 1 to 99
  const friends = [...Array(n_users)].map((_, index) => index + 1)
  // remove current user as a possible friend
  friends.splice(i - 1, 1)
  for (let j = 0; j < 5; j++) {
    // picks a new friend from friends array and
    // removes pickedId from friends array
    const friendId = friends
      .splice(Math.floor(Math.random() * friends.length), 1)
      .pop()
    const friendShip = {
      user_id: i,
      friend_id: friendId,
    }
    fakeInsertData.push(friendShip)
  }
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('friendships')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('friendships').insert(fakeInsertData)
    })
}
