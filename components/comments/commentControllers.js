const db = require('../../dbConfig');

module.exports = {
  async getAllComments (req, res, next) {
    try {
      const selectAllComments = await db('comments');
      res.status(200).json(selectAllComments);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
}