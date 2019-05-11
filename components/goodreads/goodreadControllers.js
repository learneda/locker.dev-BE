require('dotenv').config();
const cheerio = require('cheerio');
const axios = require('axios');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const db = require('../../dbConfig');
var books = require('google-books-search');

module.exports = {
  async searchBooks(req, res, next) {
    if (req.body.q) {
      books.search(req.body.q, function(error, results) {
        if (!error) {
          console.log(results);
          res.status(200).json(results);
        } else {
          console.log(error);
        }
      });
    } else {
      res.json({ err: 'q required in body of post request' });
    }
  }
};
