import { neon } from '@neondatabase/serverless';

// Using .env.local by default in Next.js
const sql = neon(process.env.DATABASE_URL!);

async function verifyDatabase() {
  try {
    // Test connection
    const result = await sql`SELECT NOW();`;
    console.log('✅ Database connection successful');

    // Check feedback table
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'feedback';
    `;
    
    if (tables.length > 0) {
      console.log('✅ Feedback table exists');
      
      // Count rows
      const count = await sql`SELECT COUNT(*) FROM feedback;`;
      console.log(`ℹ️ Current feedback entries: ${count[0].count}`);
    } else {
      console.log('❌ Feedback table not found');
    }
  } catch (error) {
    console.error('Error verifying database:', error);
  }
}

verifyDatabase(); 