const axios = require('axios')

module.exports = {
  async search(req, res, next) {
    try {
      const { q } = req.body
      const pageToken = req.body.pageToken ? req.body.pageToken : ''
      const result = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          q: q,
          pageToken: pageToken,
          part: 'snippet',
          maxResults: 12,
          type: 'video',
          key: process.env.YOUTUBE_API_KEY,
        },
      })

      res.status(200).json({
        items: result.data.items,
        nextPageToken: result.data.nextPageToken,
      })
    } catch (err) {
      const { status, data } = err.response

      res.status(status).json(data.error.errors)
    }
  },
}
