const db = require('../../dbConfig');

module.exports = {
  async createFolder (req, res, next) {
    const { folder_name } = req.body;
    const user_id = req.user.id || req.body.user
    if (folder_name) {
      try {
        const folderPromise = await db('folders').insert({
          folder_name,
          user_id
        });
        if (folderPromise) {
          res.status(200).json({success: 'folder was created'});
        } else {
          res.status(400).json({err: 'something went wrong'});
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({err});
      }
    } else {
      res.status(404).json({err: 'must include folder_name in the request body.'})
    }
  },

}