import { Request, Response, NextFunction } from 'express'
import { extractTokenFromHeader } from '../utils/request.util'
import { MyJwtPayload, validateToken } from '../utils/token.util'
import { apps } from '../db/schema/apps.schema'
import { eq } from 'drizzle-orm'
import { db } from '../db'

declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload
    }
  }
}

export async function authTokenGuard(req: Request, res: Response, next: NextFunction) {
  const accessToken = extractTokenFromHeader(req)

  if (!accessToken) {
    return res.status(401).json({ success: false, message: 'Authorization header missing' })
  }

  const { expired, decoded } = validateToken(accessToken)

  if (expired || !decoded) {
    return res.status(401).json({ success: false, message: 'Token Invalid or expired token' })
  }

  const { id, username, appId } = decoded

  const search = await db.query.apps.findFirst({ where: eq(apps.code, req.params.appCode) })

  if (!appId || appId !== search?.id) {
    return res.status(401).json({ success: false, message: 'Token Invalid for this App' })
  }

  req.user = { id, username, appId }

  next()
}
