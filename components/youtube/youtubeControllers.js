const axios = require('axios')

module.exports = {
  async search(req, res, next) {
    try {
      console.log('this got hit', req.body)
      const { q } = req.body
      const pageToken = req.body.pageToken ? req.body.pageToken : ''
      console.log(q, typeof pageToken)
      axios
        .get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            q: q,
            pageToken: pageToken,
            part: 'snippet',
            maxResults: 12,
            type: 'video',
            key: process.env.YOUTUBE_API_KEY,
          },
        })
        .then(result =>
          res.status(200).json({
            items: result.data.items,
            nextPageToken: result.data.nextPageToken,
          })
        )
    } catch (err) {
      console.log(err)
      res.status(err.status).json(err)
    }
  },
}
