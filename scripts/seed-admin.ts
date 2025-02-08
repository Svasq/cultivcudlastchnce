import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { admins } from '../lib/schema';
import { config } from 'dotenv';
import { createHash, randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';

// Load .env.local
config({ path: '../.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

function hashPassword(password: string, salt: string): string {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

function generateSalt(): string {
  return randomBytes(16).toString('hex');
}

const defaultAdmin = {
  email: 'admin@example.com',
  password: 'admin12345678',
  name: 'Admin User',
};

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user...');
    
    // Check if admin already exists
    const existingAdmin = await db.select()
      .from(admins)
      .where(eq(admins.email, defaultAdmin.email))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('⚠️ Admin user already exists');
      return;
    }

    // Create admin user
    const salt = generateSalt();
    const hashedPassword = hashPassword(defaultAdmin.password, salt);

    await db.insert(admins).values({
      email: defaultAdmin.email,
      hashedPassword: `${salt}:${hashedPassword}`,
      name: defaultAdmin.name,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', defaultAdmin.email);
    console.log('🔑 Password:', defaultAdmin.password);
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}

seedAdmin(); 