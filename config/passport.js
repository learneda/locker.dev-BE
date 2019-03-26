require('dotenv').config();

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const db = require('../dbConfig');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  db('users')
    .where({ id: id })
    .first()
    .then(user => {
      if (!user) {
        done(new Error('User not found ' + id));
      }
      done(null, user);
    });
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/cb',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await db('users')
        .where('github_id', profile.id)
        .first();
      if (existingUser) {
        done(null, existingUser);
      } else {
        await db('users').insert({
          github_id: profile.id,
          display_name: profile.username,
          profile_picture: profile.photos[0].value
        });
        const user = await db('users')
          .where({ github_id: profile.id })
          .first();
        done(null, user);
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
    async (accessToken, refreshToken, profile, done) => {
      const google_id = profile.id;
      const existingUser = await db('users')
        .where('google_id', google_id)
        .first();
      if (existingUser) {
        done(null, existingUser);
      } else {
        await db('users').insert({
          google_id: profile.id,
          display_name: profile.displayName,
          email: profile.emails[0].value,
          profile_picture: profile.photos[0].value
        });
        const user = await db('users')
          .where({ google_id: profile.id })
          .first();
        done(null, user);
      }
    }
  )
);
