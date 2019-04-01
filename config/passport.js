const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async function (email, password, done) {
      console.log(email, password)
      const existingUser = await db('users').where('email', email).first()
      if (existingUser) {
        console.log(existingUser)
        const passwordCheck = bcrypt.compareSync(
          password,
          existingUser.password
        )
        console.log(passwordCheck === true)
        if (passwordCheck === true) {
          console.log('here true')
          done(null, existingUser)
        } else {
          done(new Error('credentials wrong'))
        }
      } else {
        password = bcrypt.hashSync(password, 10)
        await db('users').insert({
          email: email,
          password: password,
          display_name: 'a dynamic name'
        })
        const user = await db('users').where({ email: email }).first()
        done(null, user)
      }
    }
  )
);

const db = require('../dbConfig')

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  db('users').where({ id: id }).first().then((user) => {
    if (!user) {
      done(new Error('User not found ' + id))
    }
    done(null, user)
  })
});

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
        .where('github_id', github_id);
        .first();
      if (existingUser) {
        done(null, existingUser);
      } else {
        const createdUser = await db('users').insert({
          github_id: github_id,
          display_name: display_name,
          profile_picture: profile_picture
        });
        console.log(createdUser);
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
    async (accessToken, refreshToken, profile, done) => {
      try {
        const google_id = profile.id
        const existingUser = await db('users')
          .where('google_id', google_id)
          .first()
        if (existingUser) {
          return done(null, existingUser)
        } else {
          await db('users').insert({
            google_id: profile.id,
            display_name: profile.displayName,
            email: profile.emails[0].value,
            profile_picture: profile.photos[0].value
          })
          const user = await db('users')
            .where({ google_id: profile.id })
            .first()
          return done(null, user)
        }
      } catch (err) {
        return done(err)
      }
    }
  )
);
