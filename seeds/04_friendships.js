const fakeInsertData = []

// gives generated users dummy follow data
for (let i = 0; i < 5; i++) {
  for (let i = 1; i < 99; i++) {
    let randomFriendId = Math.floor(Math.random() * 100)
    const friendShip = {
      user_id: i,
      friend_id: randomFriendId,
    }
    if (i !== randomFriendId && randomFriendId !== 0) {
      fakeInsertData.push(friendShip)
    }
  }
}

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('friendships')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('friendships').insert(fakeInsertData)
    })
}
