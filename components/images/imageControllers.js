const multer  = require('multer')
const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})
const upload = multer({storage}).single('profile_pic');
const db = require('../../dbConfig');
const path = require('path');


module.exports = {
  async uploadImg (req, res, next) {
    const user_id = req.user === undefined ? req.body.user : req.user.id;
    upload(req, res, function (err) {
      if (err) {
        console.log(err)
      }
      console.log(req.file.path)
      const relPath = req.file.path.replace('public', '');
      console.log(relPath)
      db('users').update('profile_picture', relPath).where('id', req.user.id).then((response) => {
        res.status(200).json({success: 'added image'})
      }).catch((err) => console.log(err));
    })
  },
  async getImg (req, res, next) {
    const user_id = req.user === undefined ? req.body.user_id : req.user.id
    const selectPromise = await db('users').where({id: user_id}).select('profile_picture');
    if (selectPromise) {
      res.status(200).json(selectPromise);
    } else {
      res.status(500).json({msg: 'user doesnt have any images'})
    }
  }
}