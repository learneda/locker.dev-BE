let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');

axios.get('https://www.goodreads.com/book/show/40961427').then(
  response => {
    if (response.status === 200) {
      var html = response.data;
      let $ = cheerio.load(html);
      const img = $('#coverImage').attr('src');
      console.log(img);
      var books = [];

      console.log(books);
      fs.writeFile('./data/books.json', JSON.stringify(books, null, 4), err => {
        console.log('File successfully written!');
      });
    }
  },
  error => console.log(error)
);
