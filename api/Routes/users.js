const router = require('express').Router();

// ==============================================
// this JS file includes helpers that access our
// database accordingly (for example, getUsers
// requests all the users in the users database)
// ==============================================
const usersDb = require('../helpers/usersHelper');

router.get('/users', async (req, res) => {
  const users = await usersDb.get();
  res.status(200).send(users);
});

module.exports = router;
