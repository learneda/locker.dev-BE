import { sign } from 'jsonwebtoken'

type User = {
  id: number
}

export const generateToken = (user: User) => {
  const payload = {
    id: user.id,
  }
  const options = {
    expiresIn: '10d',
  }

  return sign(payload, process.env.JWT_SECRET, options)
}
