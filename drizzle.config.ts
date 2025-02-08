import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load .env.local instead of .env
dotenv.config({ path: '.env.local' });

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config; 