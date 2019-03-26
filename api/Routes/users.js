require('dotenv').config()
const router = require('express').Router();
const jtw = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../../dbConfig')

// ==============================================
// this JS file includes helpers that access our
// database accordingly (for example, getUsers
// requests all the users in the users database)
// ==============================================
const usersDb = require('../helpers/usersHelper');

router.get('/users', async (req, res) => {
  const users = await usersDb.get();
  res.status(200).send(users);
});

router.post('/register', (req, res, next) => {
  console.log(req.body)
  const { email, display_name, profile_picture  } = req.body;
  let password = req.body.password
  password = bcrypt.hashSync(password, 10)
  db('users').insert({
    email: email, password: password, display_name: display_name, profile_picture: profile_picture
  }).then((createdUser) => {
    console.log(createdUser)
    let newEmail = createdUser.email;
    let token = jtw.sign({email: newEmail}, process.env.TOKEN_SECRET, {
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

module.exports = router;
