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

type Role = string | null | undefined

export function authTokenGuard(allowedRoles: Role[] = []) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const accessToken = extractTokenFromHeader(req)

    if (!accessToken) {
      return res.status(401).json({ success: false, message: 'Authorization header missing' })
    }

    const { expired, decoded } = validateToken(accessToken)

    if (expired || !decoded) {
      return res.status(401).json({ success: false, message: 'Token Invalid or expired token' })
    }

    const userId = await redisClient.get(accessToken)

    if (!userId || Number(userId) !== decoded.id) {
      return res.status(401).json({ success: false, message: 'Token does not exist in record' })
    }

    const { id, username, role, profileId } = decoded

    if (Array.isArray(allowedRoles) && allowedRoles.length) {
      if (allowedRoles.includes('self')) {
        if (id !== Number(req.params.id)) {
          return res
            .status(403)
            .json({ success: false, message: 'Forbidden: insufficient permissions' })
        }
        req.user = { id, username, role, profileId }
        return next()
      }

      if (!allowedRoles.includes(role)) {
        return res
          .status(403)
          .json({ success: false, message: 'Forbidden: insufficient permissions' })
      }
    }

    req.user = { id, username, role, profileId }

    next()
  }
}
