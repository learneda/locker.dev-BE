const request = require('request');
const Feed = require('rss-to-json');
const urlMetadata = require('url-metadata');
const db = require('../../dbConfig');

module.exports = {
	getCourses(req, res, next) {
		const page = req.query.page;
		let queryParams = {
			'fields[course]': 'title,headline,image_480x270,url'
		};
		request(
			{
				method: 'GET',
				uri: `https://www.udemy.com/api-2.0/courses?page=${page}`,
				qs: queryParams,
				auth: {
					username: process.env.UDEMY_ID,
					password: process.env.UDEMY_SECRET
				}
			},
			(error, response, body) => {
				if (!error && response.statusCode == 200) {
					res.json(JSON.parse(body));
				}
			}
		);
	},
	async getArticles(req, res, next) {
		const articles = await db('articles').select();
		if (articles) {
			res.json(articles);
		}
	}
};

// ======= getting freeCodeCampArticles && Hackernoon Every <ms> ======
setInterval(async () => {
	// GETTING ALL DB ARTICLES TO AVOID ADDING DUBLICATES
	const existingArticles = await db('articles').select();

	// FILTERING TITLE
	let existingTitles = existingArticles.map((article, index) => {
		return article.title;
	});
	// GETTING FETCHING FREECODECAMP ARTICLES && HACKERNOON
	for (let i = 0; i < 2; i++) {
		const url = i === 0 ? 'https://medium.freecodecamp.org/feed' : 'https://hackernoon.com/feed';
		Feed.load(url, function(err, rss) {
			const tempo_articles = rss.items.map((item) => {
				// for each article, get its url and parse it
				let url = item.url;
				return urlMetadata(url)
					.then((article) => ({
						created: item.created,
						title: article.title,
						description: article.description,
						thumbnail: article.image,
						url: article.url,
					}))
					.catch((err) => {
						console.log(err);
					});
			});

			console.log('existingTitles: ', existingTitles);

			Promise.all(tempo_articles).then(async (articles) => {
				let filteredArticles = articles.filter((article, index) => {
					console.log(!existingTitles.includes(article.title), article.title);
					return !existingTitles.includes(article.title);
				});

				// INSERTING UNIQUE ARTICLES
				for (let article of filteredArticles) {
					await db('articles').insert({
						url: article.url,
						title: article.title,
						thumbnail: article.thumbnail,
						description: article.description,
						created: article.created,
					});
				}
			});
		});
	}
}, 3600000);
