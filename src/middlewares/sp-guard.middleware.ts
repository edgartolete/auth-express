import { Request, Response, NextFunction } from 'express'
import { extractTokenFromHeader } from '../utils/request.util'
import { MyJwtPayload, validateToken } from '../utils/token.util'
import { redisClient } from '../services/cache.service'

declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload
    }
  }
}

export async function superUserGuard(req: Request, res: Response, next: NextFunction) {
  const accessToken = extractTokenFromHeader(req)

  if (!accessToken) {
    return res.status(401).json({ success: false, message: 'Authorization header missing' })
  }

  const { expired, decoded } = validateToken(accessToken)
  const storedToken = await redisClient.get(`sp-access`)

  if (expired || !decoded || storedToken !== accessToken) {
    return res.status(401).json({ success: false, message: 'Token Invalid or expired token' })
  }

  next()
}
