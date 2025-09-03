import { mysqlTable, varchar, date, int } from 'drizzle-orm/mysql-core'
import { users } from './users.schema'
import { relations } from 'drizzle-orm'

export const profiles = mysqlTable('profiles', {
  id: int({ unsigned: true }).notNull().autoincrement().primaryKey(),
  userId: int({ unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  avatarUrl: varchar({ length: 255 }),
  avatarKey: varchar({ length: 255 }),
  firstName: varchar({ length: 255 }),
  lastName: varchar({ length: 255 }),
  birthday: date()
})

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] })
}))
