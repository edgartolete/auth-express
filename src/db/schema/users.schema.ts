import { relations, sql, SQL } from 'drizzle-orm'
import {
  AnyMySqlColumn,
  boolean,
  int,
  mysqlTable,
  uniqueIndex,
  varchar
} from 'drizzle-orm/mysql-core'
import { profiles } from './profiles.schema'
import { sessions } from './sessions.schema'
import { roles } from './roles.schema'

export const users = mysqlTable(
  'users',
  {
    id: int({ unsigned: true }).notNull().autoincrement().primaryKey(),
    username: varchar({ length: 50 }).notNull().unique(),
    email: varchar({ length: 100 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    orderId: int({ unsigned: true }).notNull(),
    roleId: int({ unsigned: true }).references(() => roles.id, { onDelete: 'set null' }),
    isActive: boolean().notNull().default(true)
  },
  (table) => [
    uniqueIndex('unique_username').on(lower(table.username)),
    uniqueIndex('unique_user_email').on(lower(table.email))
  ]
)

export const userRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id]
  }),
  profile: one(profiles),
  sessions: many(sessions)
}))

export function lower(email: AnyMySqlColumn): SQL {
  return sql`(lower(${email}))`
}
