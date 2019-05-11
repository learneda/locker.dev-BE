require('dotenv').config();
const cheerio = require('cheerio');
const axios = require('axios');

var xpath = require('xpath'),
  dom = require('xmldom').DOMParser;

module.exports = {
  async searchBooks(req, res, next) {
    const booksArray = [];
    const { searchTerm, searchField } = req.body;
    axios
      .get('https://www.goodreads.com/search/index.xml', {
        params: {
          q: searchTerm,
          page: null,
          key: process.env.GOODREADS_KEY,
          'search[field]': searchField
        }
      })
      .then(result => {
        const xml = result.data;
        var doc = new dom().parseFromString(xml);
        const idsArr = xpath.select('//best_book/id', doc);
        const titlesArr = xpath.select('//title', doc);
        const namesArr = xpath.select('//name', doc);

        for (let i = 0; i < idsArr.length; i++) {
          const bookObject = {
            id: idsArr[i].firstChild.data,
            title: titlesArr[i].firstChild.data,
            author: namesArr[i].firstChild.data
          };
          booksArray.push(bookObject);
        }
        const urls = idsArr.map(id => {
          return `https://www.goodreads.com/book/show/${id.firstChild.data}`;
        });
        return urls;
      })
      .then(async urls => {
        const promiseArray = urls.map(url => axios.get(url));
        const results = await Promise.all(promiseArray);
        const imgUrls = results.map((result, index) => {
          const $ = cheerio.load(result.data);
          const imgUrl = $('#coverImage').attr('src');
          return imgUrl;
        });
        for (let i = 0; i < imgUrls.length; i++) {
          booksArray[i].image = imgUrls[i];
        }
        return res.json(booksArray);
      });
  }
};
