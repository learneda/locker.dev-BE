const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios')

require('dotenv').config();
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser

module.exports = {
    async searchBooks(req, res, next) {
        const { searchTerm, searchField } = req.body
        request(
			{
				method: 'GET',
				uri: `https://www.goodreads.com/search/index.xml `,
				qs: {
                    q: searchTerm,
                    page: null,
                    key: process.env.GOODREADS_KEY,
                    'search[field]': searchField
                },
			},
			async (error, response, body) => {
				if (!error && response.statusCode == 200) {
                    const xml = body
                    var doc = new dom().parseFromString(xml)

                    const idsArr = xpath.select('//best_book/id', doc)
                    const titlesArr = xpath.select("//title", doc);
                    const namesArr = xpath.select('//name', doc)
                    const image_urlsArr = xpath.select('//image_url', doc)

                    const promiseArray = []
                    
                    for (let i = 0; i < titlesArr.length; i++) {

                        const id = idsArr[i].firstChild.data

                        const book_url = `https://www.goodreads.com/book/show/${id}`

                          promiseArray.push(axios.get(book_url))
                          console.log(promiseArray.length, 'length')

                    }
        
                    console.log(promiseArray.length, 'length at end')
                    const results = await Promise.all(promiseArray)
                
                    // thx u 4 waiting 4loop :]
                    console.log(results, 'BOOKS ARR \n')
                    const booksArr = results.map((result,index) => {
                        const $ = cheerio.load(result)
                        const img = $('#coverImage').attr('src')
                        console.log(img, '😇🤣 \n')
                        const bookObj = {
                            id: id,
                            title: titlesArr[index].firstChild.data,
                            author: namesArr[index].firstChild.data,
                            img: img
                            }
                    })
                    console.log('booksArr', booksArr)
                    res.json(booksArr)
                } else {
                    console.log('error',error)
                    res.send('fucked up')
                }
			}
		);
    }
}
