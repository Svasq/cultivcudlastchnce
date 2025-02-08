import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { streamChat } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import { createSSEStream } from '@/lib/utils';

const runtime = 'edge';

async function getChat({ params }: { params: { id: string } }) {
  const streamId = parseInt(params.id);

  return createSSEStream(async (controller) => {
    // Send initial connection message
    controller.enqueue(new TextEncoder().encode('data: connected\n\n'));

    // Send recent messages
    const recentMessages = await db.select()
      .from(streamChat)
      .where(eq(streamChat.streamId, streamId))
      .orderBy(desc(streamChat.created_at))
      .limit(50);

    for (const message of recentMessages.reverse()) {
      const data = { created_at: message.created_at, stream_id: streamId, ...message };
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
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

async function postChat({ params }: { params: { id: string } }) {
  try {
    const streamId = parseInt(params.id);
    const body = await request.json();
    
    const message = await db.insert(streamChat).values({
      stream_id: streamId,
      user_id: 1, // In a real app, this would come from auth
      message: body.message || '',
      type: body.type || 'text',
      media_url: body.mediaUrl,
    }).returning();

    // Broadcast to all connected clients
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const data = { ...message[0] };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
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

export { runtime, getChat, postChat };
