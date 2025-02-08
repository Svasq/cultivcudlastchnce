import { db } from "@/lib/db";
import { products, users } from "@/lib/schema";

async function seedProducts() {
  try {
    console.log("🌱 Starting products seeding...");

    // Get the first user to use as seller
    const seller = await db.select().from(users).limit(1);
    
    if (seller.length === 0) {
      throw new Error("No users found to use as seller");
    }

    // Create test products
    const testProducts = [
      {
        title: "Gaming Laptop",
        description: "High-performance gaming laptop with RTX 3080",
        price: 1499.99,
        imageUrl: "https://picsum.photos/400/300",
        sellerId: seller[0].id,
      },
      {
        title: "Mechanical Keyboard",
        description: "RGB mechanical keyboard with Cherry MX switches",
        price: 129.99,
        imageUrl: "https://picsum.photos/400/300",
        sellerId: seller[0].id,
      },
      {
        title: "4K Monitor",
        description: "32-inch 4K HDR gaming monitor",
        price: 599.99,
        imageUrl: "https://picsum.photos/400/300",
        sellerId: seller[0].id,
      }
    ];

    await db.insert(products).values(testProducts);

    console.log("✅ Created test products");
    console.log("✅ Products seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Products seeding failed:", error);
    process.exit(1);
  }
}

seedProducts(); 