import { db } from "@/lib/db";
import { users, communities, threads, forumPosts } from "@/lib/schema";
import { hash } from "bcrypt";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create test user
    const hashedPassword = await hash("test123", 12);
    const [testUser] = await db.insert(users).values({
      name: "Test User",
      email: "test@example.com",
      hashedPassword,
      role: "user",
    }).returning();

    console.log("✅ Created test user");

    // Create test community
    const [community] = await db.insert(communities).values({
      name: "Test Community",
      bio: "A community for testing",
      ownerId: testUser.id,
      imageUrl: "https://picsum.photos/200",
      memberCount: 1,
    }).returning();

    console.log("✅ Created test community");

    // Create test thread
    const [thread] = await db.insert(threads).values({
      title: "Welcome to the Forums",
      body: "This is a test thread to get discussions started!",
      authorId: testUser.id,
    }).returning();

    console.log("✅ Created test thread");

    // Create test forum post
    await db.insert(forumPosts).values({
      threadId: thread.id,
      authorId: testUser.id,
      content: "This is a test reply to get the conversation going!",
    });

    console.log("✅ Created test forum post");
    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed(); 