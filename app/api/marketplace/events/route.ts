import { NextResponse } from 'next/server';
import { createSSEStream } from '@/lib/utils';

export const runtime = 'edge';

export async function GET() {
  return createSSEStream(async (controller) => {
    // Send initial connection message
    controller.enqueue(new TextEncoder().encode('data: connected\n\n'));

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
