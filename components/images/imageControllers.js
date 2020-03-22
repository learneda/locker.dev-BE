require('dotenv').config()
const multer = require('multer')
const cloudinary = require('cloudinary')
const cloudinaryStorage = require('multer-storage-cloudinary')
const db = require('../../dbConfig')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'demo',
  allowedFormats: ['jpg', 'png', 'gif'],
})

const upload = multer({ storage }).single('profile_pic')

module.exports = {
  async uploadImg(req, res, next) {
    const user_id = req.user === undefined ? req.body.user : req.user.id
    upload(req, res, function(err) {
      if (err) {
        console.log(err)
      }
      db('users')
        .update('profile_picture', req.file.secure_url)
        .where('id', req.user.id)
        .returning('*')
        .then(response => {
          console.log('cloud response', response[0])
          res.status(200).json({ success: 'added image', user: response[0] })
        })
        .catch(err => console.log(err))
    })
  },
  async uploadHeader(req, res, next) {
    upload(req, res, function(err) {
      if (err) {
        console.log(err)
      }
      console.log(req.file)
      if (req.file.secure_url) {
        db('users')
          .update('header_picture', req.file.secure_url)
          .where('id', req.user.id)
          .returning('*')
          .then(response => {
            console.log('from this one ? wtf', response[0])
            res.status(200).json({ success: 'added image', user: response[0] })
          })
          .catch(err => console.log(err))
      } else {
        res.status(200).json({ success: 'added image' })
      }
    })
  },
  async getImg(req, res, next) {
    try {
      const user_id = req.user === undefined ? req.body.user_id : req.user.id
      const selectPromise = await db('users')
        .where({ id: user_id })
        .select('profile_picture')
      if (selectPromise) {
        res.status(200).json(selectPromise)
      } else {
        res.status(500).json({ msg: `user doesn't have an a image` })
      }
    } catch (error) {
      console.log(error, ' 🦄')
    }
  },
}
