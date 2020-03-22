import { sign } from 'jsonwebtoken'
import { isString } from 'lodash'

export type User = {
  id: number
}

/**
 * @param user active user
 * @returns auth token
 */
export const generateToken = (user: User) => {
  if (isString(process.env.JWT_SECRET)) {
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
