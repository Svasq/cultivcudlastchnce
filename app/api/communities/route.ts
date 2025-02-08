import { db } from "@/lib/db"
import { communities } from "@/lib/schema"
import { desc, sql } from "drizzle-orm"
import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { z } from "zod"
import { cookies } from "next/headers"

const createCommunitySchema = z.object({
  name: z.string().min(1).max(50),
  bio: z.string().min(1).max(500),
  image_url: z.string().url().optional(),
});

// Public endpoint to fetch communities
export async function GET(req: Request) {
  try {
    const communitiesWithStats = await db
      .select({
        id: communities.id,
        name: communities.name,
        bio: communities.bio,
        image_url: communities.image_url,
        member_count: communities.member_count,
        created_at: communities.created_at,
        isLive: sql<boolean>`exists (
          select 1 from ${sql.raw('streams')} 
          where ${sql.raw('streams')}.community_id = ${communities.id} 
          and ${sql.raw('streams')}.status = 'active'
        )`.mapWith(Boolean),
      })
      .from(communities)
      .orderBy(desc(communities.member_count));

    return NextResponse.json({
      communities: communitiesWithStats.map(c => ({
        ...c,
        image_url: c.image_url || '/images/default-community.png'
      }))
    });
  } catch (error) {
    console.error("Error fetching communities:", error);
    return NextResponse.json(
      { error: "Failed to fetch communities" },
      { status: 500 }
    );
  }
}

// Protected endpoint to create a community
export async function POST(req: Request) {
  try {
    // Verify user is authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await req.json();
    const validatedData = createCommunitySchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid community data", details: validatedData.error.errors },
        { status: 400 }
      );
    }

    // Check if community name is already taken
    const existingCommunity = await db
      .select({ id: communities.id })
      .from(communities)
      .where(sql`lower(${communities.name}) = lower(${validatedData.data.name})`)
      .limit(1);

    if (existingCommunity.length > 0) {
      return NextResponse.json(
        { error: "Community name already exists" },
        { status: 400 }
      );
    }

    // Create community
    const [newCommunity] = await db
      .insert(communities)
      .values({
        name: validatedData.data.name,
        bio: validatedData.data.bio,
        image_url: validatedData.data.image_url,
        owner_id: userData.id,
        member_count: 1, // Owner is first member
      })
      .returning();

    const data = { created_at: newCommunity.created_at, owner_id: newCommunity.owner_id, member_count: newCommunity.member_count };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating community:", error);
    return NextResponse.json(
      { error: "Failed to create community" },
      { status: 500 }
    );
  }
}
