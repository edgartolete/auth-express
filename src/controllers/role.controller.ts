import { Request, Response } from 'express'
import { getFilters, getPagination, paginateFilter } from '../utils/request.util'
import { and, asc, desc, eq, like, SQL } from 'drizzle-orm'
import { roles } from '../db/schema/roles.schema'
import { db } from '../db'

export const roleController = {
  getAllRoles: async (req: Request, res: Response) => {
    const { keyword, pageNum, pageSize, order, activeOnly } = getFilters(req)

    const conditions: (SQL<unknown> | undefined)[] = []

    if (keyword) {
      conditions.push(like(roles.name, `%${keyword}%`))
    }

    if (activeOnly) {
      conditions.push(eq(roles.isActive, true))
    }

    const whereClause = conditions.length > 0 ? { where: and(...conditions) } : { where: undefined }

    const result = await db.query.roles.findMany({
      ...whereClause,
      orderBy: [order === 'desc' ? desc(roles.orderId) : asc(roles.orderId)],
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

    const message = result.length ? 'Roles fetched successfully' : 'No roles found'

    res.status(200).json({
      success: true,
      message,
      data: result,
      pagination: getPagination(totalItems, pageNum, pageSize)
    })
  },
  getRoleById: async (req: Request, res: Response) => {
    const roleId = Number(req.params.id)

    const result = await db.query.roles.findFirst({
      where: eq(roles.id, roleId)
    })

    const message = result ? 'Role fetched successfully' : 'Role not found'

    res.status(200).json({ success: true, message, data: result })
  },
  createRole: async (req: Request, res: Response) => {
    const searchResult = await db.query.roles.findFirst({
      where: eq(roles.name, req.body.name)
    })

    if (searchResult) {
      return res.status(400).json({
        success: false,
        message: 'Role already exists'
      })
    }

    const [latest] = await db
      .select({ orderId: roles.orderId })
      .from(roles)
      .orderBy(desc(roles.orderId))
      .limit(1)

    const newRole = {
      ...req.body,
      orderId: latest?.orderId ? Number(latest?.orderId + 1) : 1
    }

    const result = await db.insert(roles).values(newRole)

    res.status(201).json({ success: true, message: 'Role created successfully', data: result })
  },

  updateRole: async (req: Request, res: Response) => {
    const roleId = Number(req.params.id)

    const searchResult = await db.query.roles.findFirst({
      columns: { id: true },
      where: eq(roles.id, roleId)
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this ID'
      })
    }

    const result = await db.update(roles).set(req.body).where(eq(roles.id, roleId))

    res.status(200).json({ success: true, message: `Updated role with ID ${roleId}`, data: result })
  },
  reorderRoles: async (req: Request, res: Response) => {
    await db.transaction(async (tx) => {
      for (const i of req.body) {
        await tx.update(roles).set({ orderId: i.orderId }).where(eq(roles.id, i.id))
      }
    })

    res.status(200).json({ success: true, message: 'roles reordered successfully' })
  },

  deleteRole: async (req: Request, res: Response) => {
    const roleId = Number(req.params.id)

    const isHardDelete = req.body?.hard

    const searchResult = await db.query.roles.findFirst({
      columns: { id: true },
      where: eq(roles.id, roleId)
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'Role not found with this ID'
      })
    }

    if (!isHardDelete) {
      const result = await db.update(roles).set({ isActive: false }).where(eq(roles.id, roleId))

      return res
        .status(200)
        .json({ success: true, message: `Deleted role with ID ${roleId}`, data: result })
    }

    const result = await db.delete(roles).where(eq(roles.id, roleId))

    return res
      .status(200)
      .json({ success: true, message: `Deleted role with ID ${roleId}`, data: result })
  }
}
