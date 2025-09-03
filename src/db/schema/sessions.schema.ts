import {
  mysqlTable,
  int,
  varchar,
  boolean,
  datetime,
  longtext,
  uniqueIndex,
  timestamp
} from 'drizzle-orm/mysql-core'
import { users } from './users.schema'
import { relations } from 'drizzle-orm'

export const sessions = mysqlTable(
  'sessions',
  {
    id: int({ unsigned: true }).notNull().autoincrement().primaryKey(),
    userId: int({ unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    refreshToken: varchar({ length: 255 }).notNull().unique(),
    ipAddress: varchar({ length: 255 }).notNull(),
    userAgent: longtext().notNull(),
    expiryDate: datetime({ mode: 'date' }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    isActive: boolean().notNull().default(true)
  },
  (table) => [uniqueIndex('unique_session_refresh_token').on(table.refreshToken)]
)

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] })
}))
