import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { communities, forumPosts, products } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Verify authentication
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userData = await verifyToken(token);
    if (!userData || userData.id !== parseInt(params.userId)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get user stats
    const [communityCount, forumPostCount, marketListingCount] = await Promise.all([
      // Count communities owned by user
      db.select({ count: sql<number>`count(*)` })
        .from(communities)
        .where(eq(communities.ownerId, parseInt(params.userId)))
        .then(result => result[0]?.count || 0),

      // Count forum posts by user
      db.select({ count: sql<number>`count(*)` })
        .from(forumPosts)
        .where(eq(forumPosts.authorId, parseInt(params.userId)))
        .then(result => result[0]?.count || 0),

      // Count market listings by user
      db.select({ count: sql<number>`count(*)` })
        .from(products)
        .where(eq(products.sellerId, parseInt(params.userId)))
        .then(result => result[0]?.count || 0),
    ]);

    return NextResponse.json({
      communityCount,
      forumPosts: forumPostCount,
      marketListings: marketListingCount,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
} 