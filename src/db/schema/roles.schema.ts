import { relations } from 'drizzle-orm'
import { mysqlTable, int, varchar, uniqueIndex, boolean } from 'drizzle-orm/mysql-core'
import { users } from './users.schema'

//ROLES: admin | operator
export const roles = mysqlTable(
  'roles',
  {
    id: int({ unsigned: true }).notNull().autoincrement().primaryKey(),
    name: varchar({ length: 50 }).notNull().unique(),
    orderId: int({ unsigned: true }).notNull(),
    isActive: boolean().notNull().default(true)
  },
  (table) => [uniqueIndex('unique_role_name').on(table.name)]
)

export const roleRelations = relations(roles, ({ many }) => ({
  users: many(users)
}))
