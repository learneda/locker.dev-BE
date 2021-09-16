const cookieSession = require('cookie-session')
const passport = require('passport')

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

module.exports = (io) => {
    io.use(wrap(cookieSession({
        name: 'session',
        keys: [process.env.COOKIE_KEY],
        maxAge: 24 * 60 * 60 * 1000,
      })))
      io.use(wrap(passport.initialize()))
      io.use(wrap(passport.session()))
      io.use((socket, next) => {
        if (socket.request.user) {
          next();
        } else {
          next(new Error('unauthorized'))
        }
      });
}