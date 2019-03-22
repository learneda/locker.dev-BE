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

router.post('/users/create', async (req, res) => {
  if (req.body.email && req.body.display_name) {
    try {
      await usersDb.createUser(req.body);
      res.status(201).json({ message: 'user successfully added!' });
    } catch (err) {
      res.status(500).json(err);
    }
  } else res.status(400).json({ error: 'Please provide a email & display name for the new user.' });})

module.exports = router;
