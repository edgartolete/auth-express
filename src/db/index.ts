import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as userSchema from './schema/users.schema'
import * as profileSchema from './schema/profiles.schema'
import * as sessionSchema from './schema/sessions.schema'
import * as roleSchema from './schema/roles.schema'

dotenv.config({ quiet: true })

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined
})

export const db = drizzle(poolConnection, {
  schema: {
    ...userSchema,
    ...profileSchema,
    ...sessionSchema,
    ...roleSchema
  },
  mode: 'default'
})
