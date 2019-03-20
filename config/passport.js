const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy

const db = require('../dbConfig')

passport.use(
  new GitHubStrategy(
    {
      clientID: 'da193d63c68a570de8dc',
      clientSecret: '45bbbe7838f269a89640da2081e1bf5dd5180308',
      callbackURL: 'http://localhost:8000/auth/github/cb'
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
