import { db } from "@/lib/db"
import { products, users } from "@/lib/schema"
import { desc, eq } from "drizzle-orm"

export async function GET() {
  try {
    const productsWithSeller = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        imageUrl: products.image_url,
        status: products.status,
        createdAt: products.created_at,
        seller: {
          id: users.id,
          name: users.name,
        },
      })
      .from(products)
      .innerJoin(users, eq(products.seller_id, users.id))
      .where(eq(products.status, 'active'))
      .orderBy(desc(products.created_at))

    console.log("Products from database:", productsWithSeller);
    return Response.json(productsWithSeller)
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
