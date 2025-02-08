import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { threads, users, forumPosts } from "@/lib/schema";
import { desc, eq, sql } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { cookies } from "next/headers";

const threadSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
});

// Get all threads with pagination
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 15;
    const offset = (page - 1) * limit;

    const [threadsData, totalCount] = await Promise.all([
      db.select({
        id: threads.id,
        title: threads.title,
        authorId: threads.author_id,
        createdAt: threads.created_at,
        author: {
          name: users.name,
        },
        replyCount: sql<number>`COUNT(DISTINCT ${forumPosts.id})`,
      })
        .from(threads)
        .leftJoin(users, eq(threads.author_id, users.id))
        .leftJoin(forumPosts, eq(threads.id, forumPosts.thread_id))
        .groupBy(threads.id, users.name)
        .orderBy(desc(threads.created_at))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(threads),
    ]);

    return NextResponse.json({
      threads: threadsData,
      totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in GET /api/forums/threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}

// Create new thread (authenticated users only)
export async function POST(req: Request) {
  try {
    // Get token from cookie using the correct method
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token and get user data
    const userData = await verifyToken(token);
    if (!userData?.id) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const validatedData = threadSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: "Invalid thread data",
          details: validatedData.error.errors
        },
        { status: 400 }
      );
    }

    // Create thread
    const [newThread] = await db
      .insert(threads)
      .values({
        title: validatedData.data.title,
        body: validatedData.data.body,
        author_id: userData.id,
      })
      .returning();

    return NextResponse.json(newThread, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/forums/threads:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}
