require('dotenv').config();
const goodreads = require('goodreads-api-node');
const axios = require('axios')
const xpath = require('xpath')
const dom = require('xmldom').DOMParser

const db = require('../../dbConfig');


const myCredentials = {
    key: process.env.GOODREADS_KEY,
    secret: process.env.GOODREADS_SECRET
  };
   
const gr = goodreads(myCredentials);

const callbackURL = 'http://localhost:8000/api/goodreads/cb'

gr.initOAuth(callbackURL)



module.exports = {
    async login(req, res, next) {
        console.log('this got hit')
        gr.getRequestToken().then(url => { 
            /* redirect your user to this url to ask for permission */ 
            console.log('😝 getRequestTOkenURL',url)

            res.redirect(url)
        });
    },

    async goodreadsCB(req, res, next) {
        // console.log(req.query)
        var userId = req.user ? req.user.id : req.body.id
        console.log(userId)
        gr.getAccessToken()
        .then(() => { 
            gr.getCurrentUserInfo().then((results) => {
                // console.log('res from getCurrentUserInfo',results)

                // gr.getOwnedBooks(results.user.id).then((res) => {
                //     console.log(results)
                // })

                axios.get('https://www.goodreads.com/review/list?v=2', {
                    params: {
                        key: process.env.GOODREADS_KEY,
                        id: results.user.id
                    }
                }).then(async (response) => {                    
                    const xml = response.data
                    const doc = new dom().parseFromString(xml)
                    const ids = xpath.select('//review/book/id', doc)
                    const shelfs = xpath.select('//shelves/shelf/@name', doc)
                    const titles = xpath.select('//review/book/title', doc)
                    const authors = xpath.select('//review/book/authors/author/name', doc)
                    const ratings = xpath.select('//review/book/average_rating', doc)
                    const links = xpath.select('//review/book/link', doc)
                    const images = xpath.select('//review/book/image_url', doc)
                    const descriptions = xpath.select('//review/book/description', doc)


                    let bookArr = []
                    for (let i = 0; i < titles.length; i++) {
                        let bookObj 
                        if (descriptions[i].firstChild != null) {
                            const description = descriptions[i].firstChild.data
                            const cleanDescription = description.replace(/<\/?[^>]+(>|$)/g, "")
                        
                            bookObj = {
                                id: ids[i].firstChild.data,
                                title: titles[i].firstChild.data,
                                author: authors[i].firstChild.data,
                                shelf: shelfs[i].value,
                                link: links[i].firstChild.data,
                                rating: ratings[i].firstChild.data,
                                image: images[i].firstChild.data,
                                description: cleanDescription,
                            }
                        } else {
                            bookObj = {
                                id: ids[i].firstChild.data,
                                title: titles[i].firstChild.data,
                                author: authors[i].firstChild.data,
                                shelf: shelfs[i].value,
                                link: links[i].firstChild.data,
                                rating: ratings[i].firstChild.data,
                                image: images[i].firstChild.data,
                            }
                        }
                        
                        bookArr.push(bookObj)
                    }

                    
                    const existingRecords = await db('goodreads').select('book_id')
                    .where({user_id: userId})
                    .select('book_id')
                    
                    if (existingRecords.length) {

                        const existingBookIds = existingRecords.map(record => record.book_id)

                        bookArr = bookArr.filter((book) => {
                            return !existingBookIds.includes(book.id)
                        })

                    }
                    
                    const insertLoop = async () => {
                        for (let book of bookArr) {
                            const { id, title, author, shelf, link, rating, image,description, } = book
                            await db('goodreads').insert({
                                book_id: id,
                                title,
                                author,
                                shelf,
                                link,
                                rating,
                                image,
                                description,
                                user_id: userId
                            })
                        }
                        if (bookArr) {
                            // const books = await db('goodreads').where({user_id: userId})
                            res.redirect('http://localhost:3000/home')
                        } else {
                            throw new Error('newsFeedError');
                        }
                    }
                    insertLoop()
                })
            })
        }).catch(err => console.log('ERROR ERROR ',err))
    },
    async getUserShelf(req, res, next) { 
        const collections = await db('goodreads').where('user_id', req.user.id)
        if (collections) {
            res.json(collections)
        }
    }
};
