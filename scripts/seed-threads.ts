import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { threads } from '../lib/schema.js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
config({ path: path.resolve(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const sampleThreads = [
  {
    title: 'First Thread',
    body: 'This is the body of the first thread.',
    authorId: 1,
  },
  {
    title: 'Second Thread',
    body: 'This is the body of the second thread.',
    authorId: 2,
  },
];

async function seedThreads() {
  try {
    console.log('🌱 Seeding threads...');
    
    for (const thread of sampleThreads) {
      await db.insert(threads).values(thread);
      console.log(`✅ Created thread: ${thread.title}`);
    }
    
    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding threads:', error);
  }
}

seedThreads();
