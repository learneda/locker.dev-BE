const faker = require('faker')
const fakeInsertData = []

// gives generated users dummy follow data
for (let i = 0; i < 10; i++) {
	for (let i = 1; i < 500; i++) {
		const randomFriendId = Math.floor(Math.random() * 500)
		const friendShip = {
			user_id: i,
			friend_id: randomFriendId
		}
		fakeInsertData.push(friendShip)
	}
}

exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex('friendships').del().then(function() {
		// Inserts seed entries
		return knex('friendships').insert(fakeInsertData)
	})
}
