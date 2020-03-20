const jwt = require('jsonwebtoken')

module.exports = {
  generateToken(user) {
    const payload = {
      id: user.id,
    }
    const options = {
      expiresIn: '10d',
    }

    return jwt.sign(payload, process.env.JWT_SECRET, options)
  },
}
