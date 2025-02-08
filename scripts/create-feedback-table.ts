import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load .env.local instead of .env
config({ path: '.env.local' });

async function createFeedbackTable() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;
    console.log('Feedback table created successfully!');
  } catch (error) {
    console.error('Error creating feedback table:', error);
  }
}

createFeedbackTable(); 