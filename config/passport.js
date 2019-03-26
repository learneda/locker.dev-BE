require('dotenv').config();

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const db = require('../dbConfig');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/cb'
    },
    async function findOrCreate(accessToken, refreshToken, profile, done) {
      console.log(profile);
      const github_id = profile.id;
      const display_name = profile.username;
      const profile_picture = profile.photos[0].value;
      const existingUser = await db('users')
        .where('github_id', github_id)
        .first();
      if (existingUser) {
        done(null, existingUser);
      } else {
        const createdUser = await db('users').insert({
          github_id: github_id,
          display_name: display_name,
          profile_picture: profile_picture
        });
        done(null, createdUser);
      }
    }
  )
);

/* ===== PASSPORT GOOGLE STRATEGY ===== */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async function findOrCreate(accessToken, refreshToken, profile, done) {
      const google_id = profile.id;
      const existingUser = await db('users')
        .where('google_id', google_id)
        .first();
      if (existingUser) {
        done(null, existingUser);
      } else {
        const newUser = await db('users').insert({
          google_id: profile.id,
          display_name: profile.displayName,
          email: profile.emails[0].value,
          profile_picture: profile.photos[0].value
        });
        console.log('user created');
        done(null, newUser);
      }
    }
  )
);
