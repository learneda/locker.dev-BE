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
)

<<<<<<< HEAD
=======
passport.serializeUser((user, done) => {
  console.log('serialize: passport saving id from:', user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('deserialize: look up' + user);
  // db('users')
  //   .get(id)
  //   .then(user => done(null, user))
  //   .catch(err => console.log(err));
  db('users')
    .where({ id: id })
    .then(([user]) => {
      if (!user) {
        done(new Error('User not found ' + id));
      }
      done(null, user);
    });
});
>>>>>>> db40b72198cd359252a43301f942bc251f484545
