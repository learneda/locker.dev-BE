import { verify } from 'jsonwebtoken'
import { config } from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import { isString } from 'lodash'
config()

/**
 * @description Authentication middleware
 */
export const isRequestAuthenticated = (req: Request & { decodedToken: object }, res: Response, next: NextFunction) => {
  // if we are in dev env allow req from REST clients to authenticate with token!
  if (process.env.NODE_ENV === 'development' && req.headers.authorization && isString(process.env.JWT_SECRET)) {
    const token = req.headers.authorization
    verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'not verified' })
      } else {
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
}
