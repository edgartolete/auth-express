import { Request, Response, NextFunction } from 'express'
import { redisClient } from '../services/cache.service'

export type AllowedRolesT = 'superadmin' | 'admin' | 'moderator' | 'self'

export function rootRoleGuard(allowedRoles: AllowedRolesT[] = []) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.user?.id)

    if (allowedRoles.includes('self') && userId === Number(req.params.id)) {
      return next()
    }

    const roleKey = `root-role:${req.params.appCode}:${userId}`

    const storedRoles = (await redisClient.get(roleKey)) as AllowedRolesT | null

    if (storedRoles && !allowedRoles.includes(storedRoles)) {
      return res
        .status(401)
        .json({ success: false, message: 'You are not authorized to access this endpoint.' })
    }
    next()
  }
}
