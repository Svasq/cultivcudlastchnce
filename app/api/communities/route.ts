import { db } from '@/lib/db';
import { communities } from '@/lib/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allCommunities = await db.select().from(communities);
    return NextResponse.json(allCommunities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json({ error: 'Failed to fetch communities' }, { status: 500 });
  }
}
