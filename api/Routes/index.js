const routeAuth = require('./auth');
const routeUser = require('./users');
const routePost = require('./posts');

module.exports = server => {
  server.use('/auth', routeAuth);
  server.use('/api', routeUser);
  server.use('/api', routePost);
};
