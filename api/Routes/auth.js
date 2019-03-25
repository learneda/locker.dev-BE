require('dotenv').config()
const router = require('express').Router()
const passport = require('passport')
const db = require('../../dbConfig')
const jtw = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

router.get('/github', passport.authenticate('github'))

router.get('/github/cb', passport.authenticate('github'), (req, res, next) => {
  // Successful authentication, redirect home.
  console.log('IS USER Authenti ??? ??', req.isAuthenticated())
  if (process.env.NODE_ENV === 'production') {
    res.redirect('https://learnedadev.netlify.com/feed');
  } else res.redirect('http://localhost:3000/feed');
})

router.post('/register', (req, res, next) => {
  console.log(req.body)
  let {password, email, display_name} = req.body;
  password = bcrypt.hashSync(password, 10)
  db('users').insert({
    email, password, display_name
  }).then((createdUser) => {
    console.log(createdUser)
    let email = createdUser.email;
    let token = jtw.sign({email}, process.env.TOKEN_SECRET, {
      expiresIn: '1d'
    })
    return res.json({ mes: token })
  }) .catch(next)
  
})

router.post('/login', (req, res, next) => {
  const credentials = req.body
  console.log(credentials)
  db('users').where('email', credentials.email).first().then((insertedUser) => {
    console.log(insertedUser)
    let {password, email} = insertedUser
    const passwordCheck = bcrypt.compareSync(credentials.password, insertedUser.password)
    if (passwordCheck === true) {
      let token = jtw.sign({email: credentials.email}, process.env.TOKEN_SECRET, {
        expiresIn: '1d'
      })
      res.status(200).json({mes: token})
    } else {
      return res.status(401).json({error: 'check email or password'})
    }
  })
})

module.exports = router
