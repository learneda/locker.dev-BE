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
  async getOauthAccounts(req, res, next) {
    const user_id = req.user.id;
    const selectPromise = await db('users').select('github_id', 'google_id');
    try {
      if (selectPromise) {
        res.status(200).json(selectPromise);
      }
      else {
        res.status(200).json({msg: 'something went wrong'});
      }
    }
    catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  }
};
