require('dotenv').config();
const cheerio = require('cheerio');
const axios = require('axios');
const db = require('../../dbConfig');
var books = require('google-books-search');


var xpath = require('xpath'),
  dom = require('xmldom').DOMParser;

module.exports = {
  async searchBooks(req, res, next) {
    books.search('harryPotter', function(error, results) {
      if ( ! error ) {
          console.log(results);
          res.status(200).json(results)
      } else {
          console.log(error);
      }
    });

  },
}


