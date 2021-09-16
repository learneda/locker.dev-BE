const db = require('../../dbConfig')

const selectRedirect = (res, route) => {
  res.redirect(`${process.env.LEARN_LOCKER_FRONTEND_URL}${route}`)
}

module.exports = {
  gitHubHandler(req, res, next) {
    selectRedirect(res, '/success')
  },
  googleHandler(req, res, next) {
    selectRedirect(res, '/success')
  },
  meetupHandler(req, res, next) {
    selectRedirect(res, '/')
  },
  logoutHandler(req, res, next) {
    req.session = null
    selectRedirect(res, '/landing')
  },
  async getSocialNetworkIDs(req, res, next) {
    const id = req.user.id
    const socialIds = await db('users').select('github_id', 'google_id').where({ id }).first()
    try {
      if (socialIds) {
        res.status(200).json(socialIds)
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },
}
