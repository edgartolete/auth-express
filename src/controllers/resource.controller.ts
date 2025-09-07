import { Request, Response } from 'express'
import { db } from '../db'
import { extractAppId, getFilters, getPagination, paginateFilter } from '../utils/request.util'
import { and, eq, like, or, SQL, sql } from 'drizzle-orm'
import { resources } from '../db/schema/resources.schema'
import { users } from '../db/schema/users.schema'
import { resourceRoles } from '../db/schema/resourceRoles.schema'
import { Pool } from 'mysql2/typings/mysql/lib/Pool'

export const resourceController = {
  getAllResources: async (req: Request, res: Response) => {
    const { keyword, pageNum, pageSize, activeOnly } = getFilters(req)

    const appId = await extractAppId(req)

    if (!appId) {
      return res
        .status(400)
        .json({ success: false, message: 'App ID is required to create action' })
    }

    const conditions: (SQL<unknown> | undefined)[] = []

    if (keyword) {
      conditions.push(
        or(like(resources.name, `%${keyword}%`), like(resources.description, `%${keyword}%`))
      )
    }

    if (activeOnly) {
      conditions.push(eq(resources.isActive, true))
    }

    conditions.push(eq(resources.appId, appId))

    const result = await db.query.resources.findMany({
      where: and(...conditions),
      extras: {
        total: db.$count(resources).as('total')
      },
      ...paginateFilter(pageSize, pageNum)
    })

    const totalItems = result && result.length > 0 ? (result[0] as any).total : 0

    const message = result.length ? 'Resources fetched successfully' : 'No resources found'

    res.status(200).json({
      success: true,
      message,
      data: result,
      pagination: getPagination(totalItems, pageNum, pageSize)
    })
  },
  getResourceById: async (req: Request, res: Response) => {
    const resourceId = Number(req.params.resourceId)

    const appId = await extractAppId(req)

    if (!appId) {
      return res
        .status(400)
        .json({ success: false, message: 'App ID is required to create action' })
    }

    const { activeOnly } = getFilters(req)

    const conditions: (SQL<unknown> | undefined)[] = []

    if (activeOnly) {
      conditions.push(eq(resources.isActive, true))
    }

    conditions.push(eq(resources.appId, appId))

    conditions.push(eq(resources.id, resourceId))

    const result = await db.query.resources.findFirst({
      where: and(...conditions)
    })

    if (!result) {
      return res.status(400).json({ success: false, message: 'Resource not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Resource fetched successfully',
      data: result
    })
  },
  createResource: async (req: Request, res: Response) => {
    const appId = await extractAppId(req)

    if (!appId) {
      return res
        .status(400)
        .json({ success: false, message: 'App ID is required to create action' })
    }

    const searchResult = await db.query.resources.findFirst({
      where: and(eq(resources.appId, appId), eq(resources.name, req.body.name))
    })

    if (searchResult) {
      return res.status(400).json({
        success: false,
        message: 'resource with this code already exists'
      })
    }

    const newResource = {
      ...req.body,
      appId
    }

    const result = await db.insert(resources).values(newResource).$returningId()

    res.status(201).json({ success: true, message: 'Resource created successfully', data: result })
  },
  updateResource: async (req: Request, res: Response) => {
    const resourceId = Number(req.params.resourceId)
    const whereClause = eq(resources.id, resourceId)

    const searchResult = await db.query.resources.findFirst({
      columns: { id: true },
      where: whereClause
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found with this ID'
      })
    }

    await db.update(resources).set(req.body).where(whereClause)

    return res
      .status(200)
      .json({ success: true, message: `Updated resource with ID ${resourceId}` })
  },
  deleteResource: async (req: Request, res: Response) => {
    const resourceId = Number(req.params.resourceId)

    const isHardDelete = req.body?.hard

    const whereClause = eq(resources.id, resourceId)

    const searchResult = await db.query.resources.findFirst({
      columns: { id: true },
      where: whereClause
    })

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found with this ID'
      })
    }

    if (!isHardDelete) {
      await db.update(resources).set({ isActive: false }).where(whereClause)
      return res
        .status(200)
        .json({ success: true, message: `Soft deleted user with ID ${resourceId}` })
    }

    await db.delete(resources).where(whereClause)

    return res.status(200).json({ success: true, message: `Deleted user with ID ${resourceId}` })
  },
  getResourceUsers: async (req: Request, res: Response) => {
    const { keyword, pageNum, pageSize, activeOnly } = getFilters(req)

    const resourceId = Number(req.params.resourceId)

    if (!resourceId) {
      return res.status(400).json({
        success: false,
        message: 'ResourceId is required'
      })
    }

    const conditions: (SQL<unknown> | undefined)[] = []

    if (activeOnly) {
      conditions.push(eq(users.isActive, true))
    }

    conditions.push(eq(resourceRoles.userId, users.id))

    if (keyword) {
      conditions.push(like(users.username, `%${keyword}%`))
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0]

    const result = await db
      .select({
        users,
        total: db.$count(resourceRoles, eq(resourceRoles.resourceId, resourceId)).as('total')
      })
      .from(resourceRoles)
      .where(eq(resourceRoles.resourceId, resourceId))
      .leftJoin(users, whereClause)
      .limit(pageSize)
      .offset(pageNum - 1)

    const totalItems = result && result.length > 0 ? (result[0] as any).total : 0

    const data = result.map((i) => i.users) ?? []

    const message = result.length ? 'Resources fetched successfully' : 'No resources found'

    res.status(200).json({
      success: true,
      message,
      data,
      pagination: getPagination(totalItems, pageNum, pageSize)
    })
  },
  addResourceUsers: async (req: Request, res: Response) => {
    return res.status(200).json({ success: true })
  },
  updateResourceUsers: async (req: Request, res: Response) => {
    return res.status(200).json({ success: true })
  },
  removeResourceUsers: async (req: Request, res: Response) => {
    return res.status(200).json({ success: true })
  },
  getResourceRoles: async (req: Request, res: Response) => {
    return res.status(200).json({ success: true })
  },
  updateResourceRoles: async (req: Request, res: Response) => {
    return res.status(200).json({ success: true })
  }
}
