const faker = require('faker')
const fakeInsertData = []

const posts_array = [
	{
		post_url: 'https://riley.gg',
		user_id: 1,
		rating: 3,
		description: 'wanna get stuff done ? hmu . checkout my work at my own domain. lmk i got websites on decc.',
		title: 'Riley.gg',
		thumbnail_url: 'https://riley.gg/img/seo-landing.jpg'
	},
	{
		post_url: 'https://www.youtube.com/watch?v=HSwjGP19rTg',
		user_id: 1,
		rating: 5,
		description: 'oughta make those big moves hawmies',
		title: '10 things to be more productive'
	},
	{
		post_url: 'https://www.youtube.com/watch?v=qtURixlmp6M',
		user_id: 2,
		description: 'take it ot the face',
		title: 'OG',
		thumbnail_url: 'https://riley.gg/img/seo-landing.jpg'
	},
	{
		post_url: 'https://www.youtube.com/watch?v=93p3LxR9xfM',
		user_id: 2,
		rating: 2,
		description: 'I TRAP HARD',
		title: 'COOKIES'
	},
	{
		post_url: 'http://www.thinklikeahorse.org',
		user_id: 2,
		rating: 2,
		description: 'think like your horse. dont cause it pain ...',
		title: 'Think Like A Horse',
		thumbnail_url: ''
	}
]

const hardCodedImages = [
	'https://images.pexels.com/photos/169573/pexels-photo-169573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/1714205/pexels-photo-1714205.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/434090/pexels-photo-434090.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/257540/pexels-photo-257540.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/2127931/pexels-photo-2127931.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
]

fakeInsertData.push(...posts_array)

for (let i = 1; i < 500; i++) {
	let randomIndex = Math.floor(Math.random() * hardCodedImages.length)
	// const post_url = faker.internet.url();
	// console.log(randomIndex);
	const post_url = hardCodedImages[randomIndex]
	const thumbnail_url = hardCodedImages[randomIndex]
	const title = faker.lorem.sentence()
	const description = faker.lorem.paragraph()
	const user = {
		post_url,
		user_id: i,
		title: title,
		description: description,
		thumbnail_url
	}

	fakeInsertData.push(user)
}
exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex('posts').del().then(function() {
		// Inserts seed entries
		return knex('posts').insert(fakeInsertData)
	})
}
