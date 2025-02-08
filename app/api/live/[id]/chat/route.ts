import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { streamChat } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import { createSSEStream } from '@/lib/utils';

export const runtime = 'edge';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const streamId = parseInt(params.id);

  return createSSEStream(async (controller) => {
    // Send initial connection message
    controller.enqueue(new TextEncoder().encode('data: connected\n\n'));

    // Send recent messages
    const recentMessages = await db.select()
      .from(streamChat)
      .where(eq(streamChat.streamId, streamId))
      .orderBy(desc(streamChat.createdAt))
      .limit(50);

    for (const message of recentMessages.reverse()) {
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(message)}\n\n`));
    }

    // Keep connection alive with periodic heartbeat
    const heartbeat = setInterval(() => {
      controller.enqueue(new TextEncoder().encode('data: heartbeat\n\n'));
    }, 30000);

    // Clean up on close
    return () => {
      clearInterval(heartbeat);
    };
  });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const streamId = parseInt(params.id);
    const body = await request.json();
    
    const message = await db.insert(streamChat).values({
      streamId,
      userId: 'anonymous', // In a real app, this would come from auth
      username: 'Anonymous User', // In a real app, this would come from auth
      message: body.message || '',
      type: body.type || 'text',
      mediaUrl: body.mediaUrl,
    }).returning();

    // Broadcast to all connected clients
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(message[0])}\n\n`));
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
