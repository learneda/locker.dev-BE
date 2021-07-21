const axios = require('axios')
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const MeetupStrategy = require('passport-meetup-oauth2').Strategy
const LocalStrategy = require('passport-local').Strategy
const GoodreadsStrategy = require('passport-goodreads').Strategy
const bcrypt = require('bcrypt')
const sgMail = require('@sendgrid/mail')
const db = require('../dbConfig')
const html = require('./html')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// ======= gets called when a new user signs up on production =======
async function learnLockerToms(userId) {
  // Luis
  await db('friendships').insert({
    user_id: userId,
    friend_id: 100,
  })
  // Cesar
  await db('friendships').insert({
    user_id: userId,
    friend_id: 101,
  })
  // Riley
  await db('friendships').insert({
    user_id: userId,
    friend_id: 104,
  })

  // Jasmine
  await db('friendships').insert({
    user_id: userId,
    friend_id: 112,
  })
  // await db('friendships').insert({
  //   user_id: userId,
  //   friend_id: 107,
  // })
}

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) => {
  db('users')
    .where({ id: id })
    .first()
    .then(user => {
      if (!user) {
        done(new Error('User not found ' + id))
      }
      done(null, user)
    })
})

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function(email, password, done) {
      const existingUser = await db('users')
        .where('email', email)
        .first()
      if (existingUser) {
        const passwordCheck = bcrypt.compareSync(password, existingUser.password)
        if (passwordCheck === true) {
          done(null, existingUser)
        } else {
          done(new Error('credentials wrong'))
        }
      } else {
        password = bcrypt.hashSync(password, 10)
        await db('users').insert({
          email: email,
          password: password,
          display_name: 'a dynamic name',
        })
        const user = await db('users')
          .where({ email: email })
          .first()
        done(null, user)
      }
    }
  )
)
/*  ================== GITHUB ================== */

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_API_KEY,
      clientSecret: process.env.GITHUB_API_SECRET,
      callbackURL: '/auth/github/cb',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await db('users')
          .where('github_id', profile.id)
          .first()
        if (existingUser) {
          return done(null, existingUser)
        } else {
          if (profile.emails) {
            const email = profile.emails[0].value
            const msg = {
              to: email,
              from: 'info@learnlocker.dev',
              subject: 'Welcome to locker.dev!',
              html: html(profile.username),
            }
            sgMail.send(msg)
          }
          await db('users')
            .insert({
              github_id: profile.id,
              username: profile.username,
              display_name: profile.username,
              profile_picture: profile.photos[0].value,
            })
            .returning('*')
            .then(async user_obj => {
              user_obj = user_obj[0]
              if (process.env.NODE_ENV === 'production') {
                await learnLockerToms(user_obj.id)
              }
              return done(null, user_obj)
            })
        }
      } catch (err) {
        return done(err)
      }
    }
  )
)

/* ===== PASSPORT GOOGLE STRATEGY ===== */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_API_KEY,
      clientSecret: process.env.GOOGLE_API_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const google_id = profile.id
        const existingUser = await db('users')
          .where('google_id', google_id)
          .first()
        if (existingUser) {
          return done(null, existingUser)
        } else {
          const msg = {
            to: profile.emails[0].value,
            from: 'info@learnlocker.dev',
            subject: 'Welcome to locker.dev!',
            html: html(profile.displayName),
          }
          sgMail.send(msg)

          await db('users')
            .insert({
              google_id: profile.id,
              username: profile.emails[0].value.split('@')[0],
              display_name: profile.displayName,
              email: profile.emails[0].value,
              profile_picture: profile.photos[0].value,
            })
            .returning('*')
            .then(async user_obj => {
              user_obj = user_obj[0]
              if (process.env.NODE_ENV === 'production') {
                await learnLockerToms(user_obj.id)
              }
              return done(null, user_obj)
            })
        }
      } catch (err) {
        return done(err)
      }
    }
  )
)
/*  ================== MEETUPS ================== */

passport.use(
  new MeetupStrategy(
    {
      clientID: process.env.MEETUP_API_KEY,
      clientSecret: process.env.MEETUP_API_SECRET,
      callbackURL: 'https://api.learnlocker.dev/auth/meetup/cb',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('inside CB', accessToken, refreshToken, profile)
        axios
          .get('/auth/current_user')
          .then(res => console.log('RESPONSE', res.data))
          .catch(err => console.log(err))
        return done(null, { id: 503 })
      } catch (err) {
        console.log(err)
        return done(err)
      }
    }
  )
)

/*  ================== GOODREADS ================== */

passport.use(
  new GoodreadsStrategy(
    {
      consumerKey: process.env.GOODREADS_KEY,
      consumerSecret: process.env.GOODREADS_SECRET,
      callbackURL: '/auth/goodreads/cb',
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { accessToken, refreshToken, profile })
    }
  )
)
