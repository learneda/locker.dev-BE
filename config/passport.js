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

// passport.use(new TwitterStrategy({}))
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(profile);
    }
  )
);
