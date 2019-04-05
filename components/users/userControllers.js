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
  },
  async subscribetoUser(req, res, next) {
    const user_id = req.body.user_id;
    const friend_id = req.body.friend_id;
    try {
      const insertPromise = await db('friendships').insert({user_id, friend_id})
      if (insertPromise) {
        res.status(200).json({msg: 'success'});
      } else {
        res.status(404).json({msg: 'something went wrong ..'});
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async getUserNewsFeed(req, res, next) {
    console.log(req.user)
    const user_id = req.user === undefined ? req.body.user_id : req.user.id
    try {
      const newsFeedPromise = await db('friendships').join('posts', 'friendships.friend_id', 'posts.user_id').where('friendships.user_id', user_id).select('posts.user_id', 'post_url', 'title','description', 'thumbnail_url', 'posts.created_at', 'posts.updated_at').orderBy('posts.created_at', 'dec')
      if (newsFeedPromise) {
        console.log(newsFeedPromise);
        res.status(200).json(newsFeedPromise);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
}