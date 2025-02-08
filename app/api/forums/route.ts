import { db } from '@/lib/db';
import { threads } from '@/lib/schema';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const allThreads = await db.select().from(threads);
    return NextResponse.json(allThreads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json({ error: 'Failed to fetch threads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, authorId } = await request.json(); // Assuming request body contains title and authorId
    const newThread = await db.insert(threads).values({ title, authorId }).returning();

    // TODO: Integrate Blob to trigger real-time updates

    return NextResponse.json([newThread[0]], { status: 201 });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
  }
}
