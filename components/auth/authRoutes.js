const router = require('express').Router()
const controllers = require('./authControllers')
const passport = require('passport')
const xpath = require('xpath')
const dom = require('xmldom').DOMParser
const axios = require('axios')
const db = require('../../dbConfig')

/*  ================== GITHUB ================== */
router.get('/github', passport.authenticate('github'))

router.get(
  '/github/cb',
  passport.authenticate('github'),
  controllers.gitHubHandler
)
/*  ================== GOOGLE ================== */

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  controllers.googleHandler
)
/*  ================== MEETUPS ================== */

router.get('/meetup', passport.authenticate('meetup'))

router.get(
  '/meetup/cb',
  passport.authenticate('meetup'),
  controllers.meetupHandler
)
/*  ================== GOODREADS ================== */

router.get('/goodreads', passport.authenticate('goodreads'))

router.get(
  '/goodreads/cb',
  passport.authorize('goodreads'),
  (req, res, next) => {
    console.log(req.user, req.user.id, 'IS user defined ???')
    var userId = req.user.id
    axios
      .get('https://www.goodreads.com/review/list?v=2', {
        params: {
          key: process.env.GOODREADS_KEY,
          id: req.account.profile.id,
        },
      })
      .then(async response => {
        // GETTING XML DATA
        const xml = response.data
        const doc = new dom().parseFromString(xml)
        // GETTING VALUE OF ALL ID ELEMENTS WITH THIS ELEMENT NESTED PATH = <REVIEW /> => <BOOK/> => <ID/>
        const ids = xpath.select('//review/book/id', doc)
        // GETTING VALUE OF ALL SHELFS ELEMENTS WITH THIS ELEMENT NESTED PATH = <shelves /> => <shelf class ="name"/>  with className of name
        const shelfs = xpath.select('//shelves/shelf/@name', doc)
        // GETTING VALUE OF ALL ID ELEMENTS WITH THIS ELEMENT NESTED PATH = <review /> => <BOOK/> => <authors/> => <author />
        const titles = xpath.select('//review/book/title', doc)
        const authors = xpath.select('//review/book/authors/author/name', doc)
        const ratings = xpath.select('//review/book/average_rating', doc)
        const links = xpath.select('//review/book/link', doc)
        const images = xpath.select('//review/book/image_url', doc)
        const descriptions = xpath.select('//review/book/description', doc)
        // creating booksArr that
        let booksArr = []
        // looping thru all arrays to create bookOjb for each index
        for (let i = 0; i < titles.length; i++) {
          let bookObj
          // if description is not null
          if (descriptions[i].firstChild != null) {
            const description = descriptions[i].firstChild.data
            const cleanDescription = description.replace(/<\/?[^>]+(>|$)/g, '')
            // creating bookObj with description
            bookObj = {
              id: ids[i].firstChild.data,
              title: titles[i].firstChild.data,
              author: authors[i].firstChild.data,
              shelf: shelfs[i].value,
              link: links[i].firstChild.data,
              rating: ratings[i].firstChild.data,
              image: images[i].firstChild.data,
              description: cleanDescription,
              type_id: 7,
            }
          } else {
            // book obj without description
            bookObj = {
              id: ids[i].firstChild.data,
              title: titles[i].firstChild.data,
              author: authors[i].firstChild.data,
              shelf: shelfs[i].value,
              link: links[i].firstChild.data,
              rating: ratings[i].firstChild.data,
              image: images[i].firstChild.data,
              type_id: 7,
            }
          }

          booksArr.push(bookObj)
        }
        // get all existing Records to filter out duplicates
        const existingRecords = await db('goodreads')
          .select('book_id')
          .where({ user_id: userId })
          .select('book_id')

        // IF USER HAS ANY EXISTING RECORDS
        if (existingRecords.length) {
          const existingBookIds = existingRecords.map(record => record.book_id)
          // filtering out duplicates & redefining books Arr var
          booksArr = booksArr.filter(book => {
            return !existingBookIds.includes(book.id)
          })
        }
        // looping thru each book in booksArr
        // for each book, insert a new record into locker table & as well as goodreads tbl
        const insertLoop = async () => {
          for (let book of booksArr) {
            const {
              id,
              title,
              author,
              shelf,
              link,
              rating,
              image,
              description,
            } = book
            console.log('BOOK_ID', id)
            await db('goodreads')
              .insert({
                book_id: id,
                title,
                author,
                shelf,
                link,
                rating,
                image,
                description,
                user_id: userId,
              })
              .returning('*')
              .then(async result => {
                await db('locker')
                  .insert({
                    user_id: userId,
                    goodreads_id: result[0].id,
                  })
                  .catch(err => {
                    console.log(
                      'err came from trying to insert into locker table'
                    )
                  })
              })
          } // END OF 4 LOOP

          if (booksArr) {
            // deciding if URL should be local or deployed
            const redirectUrl =
              process.env.NODE_ENV === 'production'
                ? 'https://learnlocker.dev/home/locker'
                : 'http://localhost:3000/home/locker'
            res.redirect(redirectUrl)
          } else {
            throw new Error('newsFeedError')
          }
        } // END OF INSERT LOOP FUNCTION

        insertLoop() // CALLING FUNC
      })
  }
)

/*  ================== LOGOUT ================== */

router.get('/logout', controllers.logoutHandler)

/*  ================== GET CURRENT USER ================== */

router.get('/current_user', (req, res) => {
  try {
    if (req.user) {
      const { id } = req.user
      res.status(200).json({ id })
    } else {
      res.status(200).send(false)
    }
  } catch (error) {}
})
/*  ================== GET Social Network IDs ================== */

router.get('/accounts', controllers.getSocialNetworkIDs)

module.exports = router
