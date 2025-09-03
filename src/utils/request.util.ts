import { Request } from 'express'
import { config } from '../config'

export function paginateFilter(pageSize: number, pageNum: number) {
  return {
    limit: Math.round(pageSize),
    offset: Math.round((pageNum - 1) * pageSize)
  }
}

export function getFilters(req: Request) {
  const keyword = req.query.keyword as string | undefined
  const pageNum = Number(req.query.pageNum) || config.pagination.DEFAULT_PAGE_NUMBER
  const pageSize = Number(req.query.pageSize) || config.pagination.DEFAULT_PAGE_SIZE
  const order = req.query.orderBy || config.pagination.DEFAULT_ORDER
  const activeOnly = req.query.activeOnly !== 'false'

  return {
    keyword,
    pageNum,
    pageSize,
    order,
    activeOnly
  }
}

export function getPagination(totalItems: number, pageNum: number, pageSize: number) {
  return {
    totalItems,
    page: pageNum,
    pageSize: pageSize,
    totalPages: Math.ceil(totalItems / pageSize),
    hasNextPage: totalItems > pageNum * pageSize,
    hasPreviousPage: pageNum > 1
  }
}

export function extractTokenFromHeader(request: Request): string | null {
  const [type, token] = request?.headers?.authorization?.split(' ') ?? []
  return type === 'Bearer' ? token : null
}
