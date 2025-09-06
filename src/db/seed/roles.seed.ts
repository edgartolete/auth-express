import { sql } from 'drizzle-orm'
import { db } from '..'
import { roles } from '../schema/roles.schema'

export async function rolesSeed() {
  await db
    .insert(roles)
    .values([
      { id: 1, appId: 1, code: 'admin', name: 'Administrator', isActive: true },
      { id: 2, appId: 1, code: 'mod', name: 'Moderator', isActive: true },
      { id: 3, appId: 1, code: 'normal', name: 'Normal User', isActive: true },
      { id: 4, appId: 1, code: 'guest', name: 'Guest', isActive: true }
    ])
    .onDuplicateKeyUpdate({ set: { id: sql`id` } }) // keep existing record

  console.log('✅ Done seeding Roles!')
}
