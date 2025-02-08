import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load .env.local instead of .env
config({ path: '.env.local' });

async function createMarketplaceTable() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS marketplace (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        author_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;
    console.log('Marketplace table created successfully!');
  } catch (error) {
    console.error('Error creating marketplace table:', error);
  }
}

createMarketplaceTable(); 