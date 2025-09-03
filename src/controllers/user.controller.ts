import { Request, Response } from 'express'
import { db } from '../db'
import { and, asc, desc, eq, like, or, SQL } from 'drizzle-orm'
import { users } from '../db/schema/users.schema'
import { getFilters, getPagination, paginateFilter } from '../utils/request.util'
import { profiles } from '../db/schema/profiles.schema'
import * as bcrypt from 'bcrypt'
import { deleteSingleFile } from '../services/storage.service'
import { systemLogger } from '../utils/logger.util'

export const userController = {
  getAllUsers: async (req: Request, res: Response) => {
    const { keyword, pageNum, pageSize, order, activeOnly } = getFilters(req)

    const conditions: (SQL<unknown> | undefined)[] = []

    if (keyword) {
      conditions.push(or(like(users.username, `%${keyword}%`), like(users.email, `%${keyword}%`)))
    }

    if (activeOnly) {
      conditions.push(eq(users.isActive, true))
    }

    const whereClause = conditions.length > 0 ? { where: and(...conditions) } : { where: undefined }

    const result = await db.query.users.findMany({
      ...whereClause,
      with: {
        role: true,
        profile: true
      },
      orderBy: [order === 'desc' ? desc(users.orderId) : asc(users.orderId)],
      ...paginateFilter(pageSize, pageNum)
    })

    const totalItems = await db.query.users
      .findMany({
        ...whereClause,
        columns: {
          id: true
        }
      })
      .then((users) => users.length)

    const message = result.length ? 'Users fetched successfully' : 'No users found'

    res.status(200).json({
      success: true,
      message,
      data: result,
      pagination: getPagination(totalItems, pageNum, pageSize)
    })
  },
  getUserById: async (req: Request, res: Response) => {
    const userId = Number(req.params.id)

    const result = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        role: true,
        profile: true
      }
    })

    const message = result ? 'User fetched successfully' : 'User not found'

    res.status(200).json({ success: true, message, data: result })
  },
  createUser: async (req: Request, res: Response) => {
    const searchResult = await db.query.users.findFirst({
      where: or(eq(users.username, req.body.username), eq(users.email, req.body.email))
    })

    if (searchResult) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      })
    }

    const [latest] = await db
      .select({ orderId: users.orderId })
      .from(users)
      .orderBy(desc(users.orderId))
      .limit(1)

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    const newUser = {
      ...req.body,
      password: hashedPassword,
      orderId: latest?.orderId ? Number(latest?.orderId + 1) : 1
    }

    const result = await db.insert(users).values(newUser)

    const userId = result[0].insertId

    await db.insert(profiles).values({ userId })

    return res
      .status(201)
      .json({ success: true, message: 'User created successfully', data: result })
  },
  updateUser: async (req: Request, res: Response) => {
    const userId = Number(req.params.id)

    const searchResult = await db.query.users.findFirst({
      columns: { id: true },
      where: eq(users.id, userId)
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this ID'
      })
    }

    await db.update(users).set(req.body).where(eq(users.id, userId))

    return res.status(200).json({ success: true, message: `Updated user with ID ${userId}` })
  },
  reorderUsers: async (req: Request, res: Response) => {
    await db.transaction(async (tx) => {
      for (const u of req.body) {
        await tx.update(users).set({ orderId: u.orderId }).where(eq(users.id, u.id))
      }
    })

    res.status(200).json({ success: true, message: 'Users reordered successfully' })
  },
  deleteUser: async (req: Request, res: Response) => {
    const userId = Number(req.params.id)

    const isHardDelete = req.body?.hard

    const searchResult = await db.query.users.findFirst({
      columns: { id: true },
      with: {
        profile: true
      },
      where: eq(users.id, userId)
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this ID'
      })
    }

    if (!isHardDelete) {
      await db.update(users).set({ isActive: false }).where(eq(users.id, userId))
      return res.status(200).json({ success: true, message: `Soft deleted user with ID ${userId}` })
    }

    const profileAvatarKey = searchResult.profile?.avatarKey

    if (profileAvatarKey) {
      const result = await deleteSingleFile(profileAvatarKey)

      if (!result.success) {
        await systemLogger(req, {
          level: 'error',
          origin: 'userController.deleteUser',
          message: `failed to delete aws file`,
          payload: { params: req.params, result }
        })
      }
    }

    await db.delete(users).where(eq(users.id, userId))

    return res.status(200).json({ success: true, message: `Deleted user with ID ${userId}` })
  }
}
