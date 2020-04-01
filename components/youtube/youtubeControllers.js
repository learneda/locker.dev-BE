const axios = require('axios')
require('dotenv').config
module.exports = {
  async search(req, res, next) {
    try {
      const { q } = req.body
      const pageToken = req.body.pageToken ? req.body.pageToken : ''
      axios
        .get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            q,
            pageToken,
            part: 'snippet',
            maxResults: 12,
            type: 'video',
            key: process.env.YOUTUBE_KEY,
          },
        })
        .then(result =>
          res.status(200).json({
            items: result.data.items,
            nextPageToken: result.data.nextPageToken,
          })
        )
    } catch (err) {
      res.status(err.status).json(err)
    }
  },
}
