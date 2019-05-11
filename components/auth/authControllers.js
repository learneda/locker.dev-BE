require('dotenv').config();
const db = require('../../dbConfig');
const localhost_url = 'http://localhost:3000';
const url = 'https://learnlocker.dev';

const selectRedirect = route => {
  process.env.NODE_ENV === 'production'
    ? res.redirect(`${url}/${route}`)
    : res.redirect(`${localhost_url}/${route}`);
};

module.exports = {
  gitHubHandler(req, res, next) {
    selectRedirect('home');
  },
  googleHandler(req, res, next) {
    selectRedirect('home');
  },
  logoutHandler(req, res, next) {
    req.session = null;
    selectRedirect();
  },
  async getSocialNetworkIDs(req, res, next) {
    const id = req.user.id;
    const selectPromise = await db('users')
      .select('github_id', 'google_id')
      .where({ id });
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
