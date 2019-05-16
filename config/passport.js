require('dotenv').config();
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const db = require('../dbConfig');
const html = require('./html');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async function(email, password, done) {
      const existingUser = await db('users')
        .where('email', email)
        .first();
      if (existingUser) {
        const passwordCheck = bcrypt.compareSync(
          password,
          existingUser.password
        );
        if (passwordCheck === true) {
          done(null, existingUser);
        } else {
          done(new Error('credentials wrong'));
        }
      } else {
        password = bcrypt.hashSync(password, 10);
        await db('users').insert({
          email: email,
          password: password,
          display_name: 'a dynamic name'
        });
        const user = await db('users')
          .where({ email: email })
          .first();
        done(null, user);
      }
    }
  )
);

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
      try {
        const existingUser = await db('users')
          .where('github_id', profile.id)
          .first();
        if (existingUser) {
          return done(null, existingUser);
        } else {
          if (profile.emails) {
            const email = profile.emails[0].value;
            const msg = {
              to: email,
              from: 'do-not-reply@email.learnlocker.dev',
              subject: 'Welcome to LearnLocker!',
              html: html(profile.username)
            };
            sgMail.send(msg);
          }
          await db('users')
            .insert({
              github_id: profile.id,
              username: profile.username,
              display_name: profile.username,
              profile_picture: profile.photos[0].value
            })
            .returning('*')
            .then(async user_obj => {
              user_obj = user_obj[0];
              if (process.env.NODE_ENV === 'production') {
                console.log('user_obj', user_obj);

                await db('friendships').insert({
                  user_id: user_obj.id,
                  friend_id: 504
                });

                await db('friendships').insert({
                  user_id: user_obj.id,
                  friend_id: 505
                });

                await db('friendships').insert({
                  user_id: user_obj.id,
                  friend_id: 506
                });
              }
              return done(null, user_obj);
            });
        }
      } catch (err) {
        return done(err);
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
      try {
        const google_id = profile.id;
        const existingUser = await db('users')
          .where('google_id', google_id)
          .first();
        if (existingUser) {
          return done(null, existingUser);
        } else {
          const msg = {
            to: profile.emails[0].value,
            from: 'do-not-reply@email.learnlocker.dev',
            subject: 'Welcome to LearnLocker!',
            html: html(profile.displayName)
          };
          sgMail.send(msg);

          await db('users')
            .insert({
              google_id: profile.id,
              username: profile.emails[0].value.split('@')[0],
              display_name: profile.displayName,
              email: profile.emails[0].value,
              profile_picture: profile.photos[0].value
            })
            .returning('*')
            .then(async user_obj => {
              user_obj = user_obj[0];
              if (process.env.NODE_ENV === 'production') {
                console.log('user_obj', user_obj);

                await db('friendships').insert({
                  user_id: user_obj.id,
                  friend_id: 504
                });

                await db('friendships').insert({
                  user_id: user_obj.id,
                  friend_id: 505
                });

                await db('friendships').insert({
                  user_id: user_obj.id,
                  friend_id: 506
                });
              }
              return done(null, user_obj);
            });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
