import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { threads, forumPosts } from "@/lib/schema";
import { desc, eq, and } from "drizzle-orm";
import { auth } from '@/lib/auth'; 
import { z } from "zod";

// Define a basic User type
interface User {
  id: number;
  name: string;
  // Add other properties as needed
}

// Ensure AuthUser includes 'user'
interface AuthUser {
  user: User;
  // other properties...
}

const replySchema = z.object({
  content: z.string().min(1),
});

// Get single thread with its replies
export const getThread = async (req: Request, { params }: { params: { threadId: string } }) => {
  try {
    const threadId = parseInt(params.threadId);

    // Get thread details
    const thread = await db
      .select({
        id: threads.id,
        title: threads.title,
        body: threads.body,
        created_at: threads.created_at,
        author: {
          name: threads.author.name,
        },
      })
      .from(threads)
      .leftJoin("users", eq(threads.author_id, "users.id"))
      .where(eq(threads.id, threadId))
      .limit(1);

    if (!thread.length) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Get thread replies
    const replies = await db
      .select({
        id: forumPosts.id,
        content: forumPosts.content,
        created_at: forumPosts.created_at,
        author: {
          name: "users.name",
        },
      })
      .from(forumPosts)
      .leftJoin("users", eq(forumPosts.author_id, "users.id"))
      .where(eq(forumPosts.thread_id, threadId))
      .orderBy(desc(forumPosts.created_at));

    return NextResponse.json({
      thread: thread[0],
      replies,
    });
  } catch (error) {
    console.error("Error fetching thread:", error);
    return NextResponse.json(
      { error: "Failed to fetch thread" },
      { status: 500 }
    );
  }
}

// Add reply to thread (authenticated users only)
export const addReply = async (req: Request, { params }: { params: { threadId: string } }) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const threadId = parseInt(params.threadId);
    
    // Verify thread exists
    const threadExists = await db
      .select({ id: threads.id })
      .from(threads)
      .where(eq(threads.id, threadId))
      .limit(1);

    if (!threadExists.length) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = replySchema.parse(body);

    const newReply = await db
      .insert(forumPosts)
      .values({
        thread_id: threadId,
        author_id: session.user.id,
        content: validatedData.content,
        created_at: new Date(),
      })
      .returning();

    return NextResponse.json(newReply[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid reply data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
