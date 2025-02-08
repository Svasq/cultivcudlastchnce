import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode('data: connected\n\n'));
      
      // Keep connection alive with periodic heartbeat
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode('data: heartbeat\n\n'));
      }, 30000);

      // Clean up on close
      return () => {
        clearInterval(heartbeat);
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 