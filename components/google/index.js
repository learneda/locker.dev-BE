const googleRoutes = require('./googleRoutes');

module.exports = server => {
  server.use('/api/google', googleRoutes);
};
