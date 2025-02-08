import { Suspense } from 'react';
import { db } from '@/lib/db';
import { streams } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import { LiveGrid } from '@/components/live/live-grid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function getActiveStreams() {
  return await db.select()
    .from(streams)
    .where(eq(streams.status, 'active'))
    .orderBy(desc(streams.viewerCount));
}

export default async function LivePage() {
  const activeStreams = await getActiveStreams();

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Live Streams</h1>
        <p className="text-muted-foreground">
          Watch and interact with live community streams
        </p>
      </div>

      <Suspense fallback={<div>Loading streams...</div>}>
        <LiveGrid initialStreams={activeStreams} />
      </Suspense>
    </div>
  );
} 