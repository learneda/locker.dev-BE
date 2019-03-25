require('dotenv').config()
console.log('make sure these R defined',process.env.GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET,GITHUB_CB_URL)
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy

const db = require('../dbConfig')

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET ,
      callbackURL: process.env.GITHUB_CB_URL
    },
    async function findOrCreate (accessToken, refreshToken, profile, done) {
      console.log(profile.emails[0].value)
      const email = profile.emails[0].value
      console.log(profile)
      const existingUser = await db('users').where('email', email).first()
      if (existingUser) {
        done(null, existingUser)
      } else {
        const newUser = await db('users').insert({
          email: email,
          name: profile.displayName,
          profile_picture: profile.photos[0].value
        })
        done(null, newUser)
      }
    }
  )
)

// passport.use(new TwitterStrategy({}))
