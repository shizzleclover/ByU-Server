import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from './env';
import * as schema from '../db/schema';

/**
 * Standard PostgreSQL Pool.
 * Uses TCP (port 5432) which is often more reliable for local development.
 */
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/**
 * Drizzle ORM instance with node-postgres driver.
 */
export const db = drizzle(pool, { schema });

/**
 * Connection check.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Neon PostgreSQL (via TCP)');
    client.release();
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
};
