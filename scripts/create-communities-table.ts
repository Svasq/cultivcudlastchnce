import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

async function createCommunitiesTable() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    console.log('🏗️ Creating communities table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS communities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        bio TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;
    
    console.log('✅ Communities table created successfully!');
  } catch (error) {
    console.error('Error creating communities table:', error);
  }
}

createCommunitiesTable(); 