import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/schema';

export const getMemberFunction = async () => {
  try {
    const data = await db.select().from(posts);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error', data: [] },
      { status: 500 }
    );
  }
}
