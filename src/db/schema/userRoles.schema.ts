import { bigint, index, int, mysqlTable, uniqueIndex } from 'drizzle-orm/mysql-core'
import { users } from './users.schema'
import { roles } from './roles.schema'
import { relations } from 'drizzle-orm'

export const userRoles = mysqlTable(
  'userRoles',
  {
    userId: bigint('userId', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: int({ unsigned: true })
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' })
  },
  (t) => [
    uniqueIndex('unique_resource_roles').on(t.userId, t.roleId),
    index('idx_resource_role_user').on(t.userId),
    index('idx_resource_role_resource').on(t.roleId)
  ]
)

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id]
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id]
  })
}))
