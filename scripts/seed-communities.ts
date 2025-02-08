import { db } from '@/lib/db';
import { communities } from '@/lib/schema';

async function main() {
  try {
    await db.insert(communities).values([
      { name: 'Web Developers', bio: 'A community for web developers to share knowledge and collaborate.' },
      { name: 'Mobile App Developers', bio: 'A community for mobile app developers to discuss best practices and new technologies.' },
      { name: 'Data Scientists', bio: 'A community for data scientists to learn and share insights.' },
    ]);
    console.log('Successfully seeded communities table.');
  } catch (error) {
    console.error('Error seeding communities table:', error);
  }
}

main();
