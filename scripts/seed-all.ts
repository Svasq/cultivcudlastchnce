import { db } from "@/lib/db";
import { users, communities, threads, forumPosts, products, streams } from "@/lib/schema";
import { hash } from "bcrypt";
import { eq } from "drizzle-orm";

async function seedAll() {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if test user exists
    let testUser = await db.query.users.findFirst({
      where: eq(users.email, "test@example.com")
    });

    if (!testUser) {
      // Create test user if doesn't exist
      const hashedPassword = await hash("test123", 12);
      [testUser] = await db.insert(users).values({
        name: "Test User",
        email: "test@example.com",
        hashed_password: hashedPassword,
        role: "user",
      }).returning();
      console.log("✅ Created test user");
    } else {
      console.log("ℹ️ Test user already exists");
    }

    // Check if test community exists
    let community = await db.query.communities.findFirst({
      where: eq(communities.name, "Test Community")
    });

    if (!community) {
      // Create test community if doesn't exist
      [community] = await db.insert(communities).values({
        name: "Test Community",
        bio: "A community for testing",
        owner_id: testUser.id,
        image_url: "https://picsum.photos/200",
        member_count: 1,
      }).returning();
      console.log("✅ Created test community");
    } else {
      console.log("ℹ️ Test community already exists");
    }

    // Check if test thread exists
    let thread = await db.query.threads.findFirst({
      where: eq(threads.title, "Welcome to the Forums")
    });

    if (!thread) {
      // Create test thread if doesn't exist
      [thread] = await db.insert(threads).values({
        title: "Welcome to the Forums",
        body: "This is a test thread to get discussions started!",
        author_id: testUser.id,
      }).returning();
      console.log("✅ Created test thread");

      // Create test forum post
      await db.insert(forumPosts).values({
        thread_id: thread.id,
        author_id: testUser.id,
        content: "This is a test reply to get the conversation going!",
      });
      console.log("✅ Created test forum post");
    } else {
      console.log("ℹ️ Test thread and forum post already exist");
    }

    // Check if test products exist
    const existingProducts = await db.query.products.findMany({
      where: eq(products.seller_id, testUser.id)
    });

    if (existingProducts.length === 0) {
      // Create test products if none exist
      await db.insert(products).values([
        {
          title: "Gaming Laptop",
          description: "High-performance gaming laptop with RTX 3080",
          price: "1499.99",
          image_url: "https://picsum.photos/400/300",
          seller_id: testUser.id,
          status: "active"
        },
        {
          title: "Mechanical Keyboard",
          description: "RGB mechanical keyboard with Cherry MX switches",
          price: "129.99",
          image_url: "https://picsum.photos/400/300",
          seller_id: testUser.id,
          status: "active"
        }
      ]);
      console.log("✅ Created test products");
    } else {
      console.log("ℹ️ Test products already exist");
    }

    // Check if test stream exists
    const existingStream = await db.query.streams.findFirst({
      where: eq(streams.stream_key, "test-stream-key-123")
    });

    if (!existingStream) {
      // Create test stream if doesn't exist
      await db.insert(streams).values({
        title: "Test Stream",
        community_id: community.id,
        user_id: testUser.id,
        stream_key: "test-stream-key-123",
        status: "inactive",
        viewer_count: 0,
      });
      console.log("✅ Created test stream");
    } else {
      console.log("ℹ️ Test stream already exists");
    }

    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedAll(); 