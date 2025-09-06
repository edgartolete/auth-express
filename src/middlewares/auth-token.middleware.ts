import { Request, Response, NextFunction } from 'express'
import { extractTokenFromHeader } from '../utils/request.util'
import { MyJwtPayload, validateToken } from '../utils/token.util'

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

    const { id, username, role, profileId } = decoded

    req.user = { id, username, role, profileId }

    next()
  }
}
