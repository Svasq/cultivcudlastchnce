import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { communities } from '../lib/schema';
import { config } from 'dotenv';

// Load .env.local
config({ path: '../.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const sampleCommunities = [
  {
    name: 'Tech Enthusiasts',
    bio: 'A community for tech lovers to discuss the latest in technology.',
  },
  {
    name: 'Digital Artists',
    bio: 'Share your digital art, get feedback, and collaborate with other artists.',
  },
  {
    name: 'Web Developers',
    bio: 'Connect with fellow web developers, share knowledge, and solve coding challenges.',
  },
  {
    name: 'Startup Founders',
    bio: 'Network with other founders, share experiences, and get advice on building startups.',
  },
];

async function seedCommunities() {
  try {
    console.log('🌱 Seeding communities...');
    
    for (const community of sampleCommunities) {
      await db.insert(communities).values(community);
      console.log(`✅ Created community: ${community.name}`);
    }
    
    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding communities:', error);
  }
}

seedCommunities();
