const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');

require('dotenv').config();
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
        const image_urlsArr = xpath.select('//image_url', doc);
        const urls = idsArr.map((id, index) => {
          const bookObject = {
            id: id.firstChild.data,
            title: titlesArr[index].firstChild.data,
            author: namesArr[index].firstChild.data
          };
          booksArray.push(bookObject);
          // return bookObject;
          return `https://www.goodreads.com/book/show/${id.firstChild.data}`;
        });
        return urls;
      })
      .then(async urls => {
        console.log('URLS', urls);
        const promiseArray = urls.map(url => axios.get(url));
        console.log(promiseArray);
        const results = await Promise.all(promiseArray);
        // console.log(results);
        // console.log(results);
        const imgUrls = results.map((result, index) => {
          const $ = cheerio.load(result.data);
          const img = $('#coverImage').attr('src');
          return img;
        });
        return imgUrls;
      })
      .then(imgUrls => {
        for (let i = 0; i < imgUrls.length; i++) {
          booksArray[i].image = imgUrls[i];
        }
        return res.json(booksArray);
      });
  }
};
