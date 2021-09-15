const axios = require('axios')

module.exports = {
  async search(req, res, next) {
    const { q, offset } = req.body
    try {
      const result = await axios.get('https://listen-api.listennotes.com/api/v2/search', {
        headers: {
          'X-ListenAPI-Key': process.env.LISTEN_API_KEY,
        },
        params: {
          q,
          sort_by_date: 1,
          type: 'episode',
          offset: offset,
          language: 'English',
        },
      })

      res.status(200).json({
        results: result.data.results,
        next_offset: result.data.next_offset,
      })
    } catch (err) {
      const { status, data } = err.response
      res.status(status).json(data)
    }
  },
}
