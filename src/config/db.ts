import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from './env';
import * as schema from '../db/schema';

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });

export const connectDB = async (): Promise<void> => {
  const MAX_RETRIES = 6;
  let delay = 4000;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await sql`SELECT 1`;
      console.log('✅ Connected to Neon PostgreSQL (via HTTP)');
      return;
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        console.error('❌ Failed to connect to database after all retries:', error);
        process.exit(1);
      }
      console.warn(`⚠️  DB cold-start (attempt ${attempt}/${MAX_RETRIES}), retrying in ${delay / 1000}s...`);
      await new Promise(r => setTimeout(r, delay));
      delay = Math.min(delay * 1.5, 20000);
    }
  }
};

// Ping every 4 minutes to prevent Neon free-tier suspension (suspends after 5 min idle)
export const keepAlive = (): void => {
  setInterval(async () => {
    try {
      await sql`SELECT 1`;
    } catch {
      // silent — just a keep-alive, not critical
    }
  }, 4 * 60 * 1000);
};
