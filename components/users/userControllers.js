const db = require('../../dbConfig');
module.exports = {
  async postUserDetails(req, res, next) {
    const user = req.body.id
    const {bio, location, website_url} = req.body
    if (user) {
      try {
        const postPromise = await db('users').where({id: user}).update({bio,location,website_url});
        if (postPromise) {
          res.status(200).json({msg: 'success'});
        } else {
          res.status(400).json({err: 'something went wrong'});
        }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      res.status(400).json({err: 'not allowed'})
    }
  },
  async getUserDetailsByUserName(req, res, next) {
    const username = req.params.username
    try {
      const selectPromise = await db('users').where({username: username})
      if (selectPromise) {
        res.status(200).json(selectPromise);
      } else {
        res.status(404).json({msg: 'user not found..'});
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
}