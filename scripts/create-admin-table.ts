import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load .env.local instead of .env
config({ path: '../.env.local' });

async function createAdminTable() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    console.log('🏗️ Creating admins table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        hashed_password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;
    
    console.log('✅ Admins table created successfully!');
  } catch (error) {
    console.error('Error creating admins table:', error);
  }
}

createAdminTable(); 