const routeAuth = require('./auth');
const routeUser = require('./users');

module.exports = server => {
  server.use('/auth', routeAuth);
  server.use('/api', routeUser);
};
