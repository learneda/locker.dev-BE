const jwt = require('jsonwebtoken')
const _ = require('lodash')

/**
 * @param user active user
 * @returns auth token
 */
const generateToken = user => {
  if (_.isString(process.env.JWT_SECRET)) {
    const payload = {
      id: user.id,
    }
    const options = {
      expiresIn: '10d',
    }
    return jwt.sign(payload, process.env.JWT_SECRET, options)
  }
  throw new Error('process.env.JWT_SECRET undefined')
}

module.exports = { generateToken }
