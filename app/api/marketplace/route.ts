import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { marketplace } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import { createSSEStream } from '@/lib/utils';

export const marketplaceFunction = async () => {
  try {
    const listings = await db
      .select()
      .from(marketplace)
      .where(eq(marketplace.status, 'active'))
      .orderBy(desc(marketplace.createdAt));

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

export const marketplaceFunctionPost = async (request: Request) => {
  try {
    const body = await request.json();
    const listing = await db.insert(marketplace).values({
      title: body.title,
      description: body.description,
      price: body.price,
      image_url: body.imageUrl,
      author_id: 1, // In a real app, this would come from auth
      status: 'active',
    }).returning();

    // Notify connected clients about the new listing
    return createSSEStream(async (controller) => {
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(listing[0])}\n\n`));
      controller.close();
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}
