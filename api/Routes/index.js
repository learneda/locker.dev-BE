const routeAuth = require('./auth');
const routeUser = require('./users');
const routePost = require('./posts');
const routeBrowse = require('./browse');

module.exports = server => {
  server.use('/auth', routeAuth);
  server.use('/users', routeUser);
  server.use('/posts', routePost);
  server.use('/udemy', routeCourses);
};
