import { Request, Response } from 'express'
import { db } from '../db'
import { getFilters, getPagination, paginateFilter } from '../utils/request.util'
import { and, eq, like, or, SQL } from 'drizzle-orm'
import { groups } from '../db/schema/groups.schema'
import { users } from '../db/schema/users.schema'
import { groupRoles } from '../db/schema/groupRoles.schema'

export const groupController = {
  getAllGroups: async (req: Request, res: Response) => {
    const { keyword, pageNum, pageSize, activeOnly } = getFilters(req)

    const conditions: (SQL<unknown> | undefined)[] = []

    if (keyword) {
      conditions.push(
        or(like(groups.name, `%${keyword}%`), like(groups.description, `%${keyword}%`))
      )
    }

    if (activeOnly) {
      conditions.push(eq(groups.isActive, true))
    }

    conditions.push(eq(groups.appId, req.user?.appId!))

    const result = await db.query.groups.findMany({
      where: and(...conditions),
      extras: {
        total: db.$count(groups).as('total')
      },
      ...paginateFilter(pageSize, pageNum)
    })

    const totalItems = result && result.length > 0 ? (result[0] as any).total : 0

    const message = result.length ? 'Groups fetched successfully' : 'No resources found'

    res.status(200).json({
      success: true,
      message,
      data: result,
      pagination: getPagination(totalItems, pageNum, pageSize)
    })
  },
  getGroupById: async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId)

    const { activeOnly } = getFilters(req)

    const conditions: (SQL<unknown> | undefined)[] = []

    if (activeOnly) {
      conditions.push(eq(groups.isActive, true))
    }

    conditions.push(eq(groups.appId, req.user?.appId!))

    conditions.push(eq(groups.id, groupId))

    const result = await db.query.groups.findFirst({
      where: and(...conditions)
    })

    if (!result) {
      return res.status(400).json({ success: false, message: 'Group not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Group fetched successfully',
      data: result
    })
  },
  createGroup: async (req: Request, res: Response) => {
    const searchResult = await db.query.groups.findFirst({
      where: and(eq(groups.appId, req.user?.appId!), eq(groups.name, req.body.name))
    })

    if (searchResult) {
      return res.status(400).json({
        success: false,
        message: 'group with this code already exists'
      })
    }

    const newGroup = {
      appId: req.user?.appId,
      ...req.body
    }

    const result = await db.insert(groups).values(newGroup).$returningId()

    res.status(201).json({ success: true, message: 'Group created successfully', data: result })
  },
  updateGroup: async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId)
    const whereClause = eq(groups.id, groupId)

    const searchResult = await db.query.groups.findFirst({
      columns: { id: true },
      where: whereClause
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'Group not found with this ID'
      })
    }

    await db.update(groups).set(req.body).where(whereClause)

    return res.status(200).json({ success: true, message: `Updated group with ID ${groupId}` })
  },
  deleteGroup: async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId)

    const isHardDelete = req.body?.hard

    const whereClause = eq(groups.id, groupId)

    const searchResult = await db.query.groups.findFirst({
      columns: { id: true },
      where: whereClause
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'Group not found with this ID'
      })
    }

    if (!isHardDelete) {
      await db.update(groups).set({ isActive: false }).where(whereClause)
      return res
        .status(200)
        .json({ success: true, message: `Soft deleted user with ID ${groupId}` })
    }

    await db.delete(groups).where(whereClause)

    return res.status(200).json({ success: true, message: `Deleted user with ID ${groupId}` })
  },
  getGroupUsers: async (req: Request, res: Response) => {
    const { keyword, pageNum, pageSize, activeOnly } = getFilters(req)

    const groupId = Number(req.params.groupId)

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'GroupId is required'
      })
    }

    const conditions: (SQL<unknown> | undefined)[] = []

    if (activeOnly) {
      conditions.push(eq(users.isActive, true))
    }

    if (keyword) {
      conditions.push(like(users.username, `%${keyword}%`))
    }

    conditions.push(eq(groupRoles.userId, users.id))

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0]

    const result = await db
      .select({
        users,
        total: db.$count(groupRoles, eq(groupRoles.groupId, groupId)).as('total')
      })
      .from(groupRoles)
      .where(eq(groupRoles.groupId, groupId))
      .leftJoin(users, whereClause)
      .limit(pageSize)
      .offset(pageNum - 1)

    const totalItems = result && result.length > 0 ? (result[0] as any).total : 0

    const data = result.map((i) => i.users) ?? []

    const message = result.length ? 'Groups fetched successfully' : 'No groups user found'

    res.status(200).json({
      success: true,
      message,
      data,
      pagination: getPagination(totalItems, pageNum, pageSize)
    })
  }
}
