require('dotenv').config()
const axios = require('axios')
const qs = require('qs')

const db = require('../../dbConfig')

let token

module.exports = {
  async login(req, res, next) {
    const redirect_uri =
      process.env.NODE_ENV === 'production'
        ? 'https://learned-a.herokuapp.com/api/pocket/cb'
        : 'http://localhost:8000/api/pocket/cb'
    axios
      .post('https://getpocket.com/v3/oauth/request', {
        consumer_key: process.env.POCKET_KEY,
        redirect_uri: redirect_uri,
      })
      .then(result => {
        console.log('my response', result.data)
        const code = result.data
        token = code.split('=')[1]

        console.log(code.split('=')[1])
        res.redirect(`https://getpocket.com/auth/authorize?request_token=${token}&redirect_uri=${redirect_uri}`)
      })
  },
  async pocketCB(req, res, next) {
    console.log('\n line 23:', token)
    if (req.user) {
      await db('pocket')
        .del()
        .where('user_id', req.user.id)
      axios
        .post('https://getpocket.com/v3/oauth/authorize', {
          consumer_key: process.env.POCKET_KEY,
          code: token,
        })
        .then(response => {
          console.log('this is response.data', response.data)
          const encodedResponse = response.data
          console.log(qs.parse(encodedResponse))
          const decoded = qs.parse(encodedResponse)
          axios
            .post('https://getpocket.com/v3/get', {
              consumer_key: process.env.POCKET_KEY,
              access_token: decoded.access_token,
            })
            .then(async result => {
              for (const post in result.data.list) {
                const obj = result.data.list[post]
                await db('pocket')
                  .insert({
                    resolved_title: obj.resolved_title,
                    resolved_url: obj.resolved_url,
                    excerpt: obj.excerpt,
                    top_image_url: obj.top_image_url,
                    favorited: obj.time_favorited === 0 ? false : true,
                    user_id: req.user.id,
                    item_id: obj.item_id,
                    type_id: 6,
                  })
                  .returning('*')
                  .then(async result => {
                    await db('locker').insert({
                      user_id: req.user.id,
                      pocket_id: result[0].id,
                    })
                  })
              }
              const redirectUrl =
                process.env.NODE_ENV === 'production'
                  ? 'https://learnlocker.app/locker'
                  : 'http://localhost:3000/locker'
              res.redirect(redirectUrl)
            })
        })
    }
  },
}
