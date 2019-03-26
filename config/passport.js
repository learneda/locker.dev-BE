const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy

const db = require('../dbConfig')

passport.serializeUser(function (email, done) {
  console.log('SERIALizing A user', email)
  done(null, email)
})

passport.deserializeUser(function (id, done) {
  console.log('deserializing USer', id)
  done(null, id)
})

passport.use(
  new GitHubStrategy(
    {
      clientID: 'da193d63c68a570de8dc',
      clientSecret: '45bbbe7838f269a89640da2081e1bf5dd5180308',
      callbackURL: process.env.CB_URL
    },
    async function findOrCreate (accessToken, refreshToken, profile, done) {
      console.log(profile)
      const github_id = profile.id
      const display_name = profile.username
      const profile_picture = profile.photos[0].value 
      const existingUser = await db('users')
        .where('github_id', github_id)
        .first()
      if (existingUser) {
        done(null, existingUser)
      }
      else {
        const createdUser = await db('users').insert({github_id:github_id, display_name:display_name, profile_picture:profile_picture})
        done(null, createdUser)
      }
    }
  )
)

