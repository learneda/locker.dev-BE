const { sign } = require('jsonwebtoken')
const _ = require('lodash')

type User = {
  id: number
}

/**
 * @param user active user
 * @returns auth token
 */
const generateToken = (user: User) => {
  if (_.isString(process.env.JWT_SECRET)) {
    const payload = {
      id: user.id,
    }
    const options = {
      expiresIn: '10d',
    }
    return sign(payload, process.env.JWT_SECRET, options)
  }
  throw new Error('process.env.JWT_SECRET undefined')
}

module.exports = { generateToken }
