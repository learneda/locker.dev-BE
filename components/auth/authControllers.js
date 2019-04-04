const db = require('../../dbConfig');
require('dotenv').config();

module.exports = {
  gitHubHandler(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
      res.redirect('https://learnedadev.netlify.com/profile');
    } else res.redirect('http://localhost:3000/profile');
  },

  googleHandler(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
      res.redirect('https://learnedadev.netlify.com/profile');
    } else res.redirect('http://localhost:3000/profile');
  },
  logoutHandler(req, res, next) {
    req.session = null;

    if (process.env.NODE_ENV === 'production') {
      res.redirect('https://learnedadev.netlify.com');
    } else res.redirect('http://localhost:3000');
  },
  async editProfile(req, res, next) {
    const id = req.params.id;
    const { bio, location, website_url } = req.body;

    try {
      await db('users')
        .where({ id })
        .update({ bio, location, website_url });
      res.status(200).json({ success: 'Profile updated!' });
    } catch (err) {
      console.log('edit profile err', err);
      res.status(500).json({ err });
    }
  }
};
