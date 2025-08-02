import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config() // ✅ Should load synchronously

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is not set in .env file')
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
