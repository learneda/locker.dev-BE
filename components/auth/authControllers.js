const db = require('../../dbConfig');
require('dotenv').config();

const localhost_url = 'http://localhost:3000';
const url = 'https://learnlocker.dev';

module.exports = {
  gitHubHandler(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
      res.redirect(`${url}/home`);
    } else res.redirect(`${localhost_url}/home`);
  },

  googleHandler(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
      res.redirect(`${url}/home`);
    } else res.redirect(`${localhost_url}/home`);
  },
  logoutHandler(req, res, next) {
    req.session = null;

    if (process.env.NODE_ENV === 'production') {
      res.redirect(`${url}`);
    } else res.redirect(`${localhost_url}`);
  },
  async getSocialNetworkIDs(req, res, next) {
    const user_id = req.user.id;
    const selectPromise = await db('users')
      .select('github_id', 'google_id')
      .where('id', user_id);
    try {
      if (selectPromise) {
        res.status(200).json(selectPromise);
      } else {
        res.status(200).json({ msg: 'something went wrong' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};
