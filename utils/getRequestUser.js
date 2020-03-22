const jwt = require('jsonwebtoken')
module.exports = {
  isRequestAuthenticated(req, res, next) {
    // if we are in dev env allow req from REST clients to authenticate with token!
    if (process.env.NODE_ENV === 'development' && req.headers.authorization) {
      const token = req.headers.authorization
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          res.status(401).json({ message: 'not verified' })
        } else {
          req.decodedToken = decodedToken
          req.user = decodedToken
          next()
        }
      })
    } else {
      // else check if passport attached a user obj from cookie session
      if (!req.user) {
        res.status(400).json({ err: 'probably missing token or cookie session' })
      } else {
        next()
      }
    }
  },
}
