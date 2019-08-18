require('dotenv').config()

const googleTranslate = require('google-translate')(
  process.env.GOOGLE_TRANSLATE_KEY
)

module.exports = {
  async translate(req, res, next) {
    const payload = req.body.msg
    googleTranslate.translate(payload, 'es', function(err, translation) {
      res.status(200).json({ msg: translation.translatedText })
    })
  },
}
