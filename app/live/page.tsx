import { Suspense } from 'react';
import { db } from '@/lib/db';
import { streams, communities } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import { LiveGrid } from '@/components/live/live-grid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Video } from 'lucide-react';

async function getActiveStreams() {
  // Join with communities to get community info
  const activeStreams = await db.select({
    id: streams.id,
    title: streams.title,
    communityId: streams.communityId,
    status: streams.status,
    viewerCount: streams.viewerCount,
    thumbnailUrl: streams.thumbnailUrl,
    createdAt: streams.createdAt,
    communityName: communities.name,
  })
  .from(streams)
  .innerJoin(communities, eq(streams.communityId, communities.id))
  .where(eq(streams.status, 'active'))
  .orderBy(desc(streams.viewerCount));

  return activeStreams;
}

export default async function LivePage() {
  const activeStreams = await getActiveStreams();
  const isAuthenticated = false; // TODO: Replace with actual auth check

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Live Streams</h1>
          <p className="text-muted-foreground">
            Watch and interact with live community streams
          </p>
        </div>

        {isAuthenticated ? (
          <Button asChild>
            <Link href="/communities">
              <Video className="w-4 h-4 mr-2" />
              Start Streaming
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/signup">
              Sign up to start streaming
            </Link>
          </Button>
        )}
      </div>

      <Suspense fallback={<div>Loading streams...</div>}>
        <LiveGrid initialStreams={activeStreams} />
      </Suspense>

      {activeStreams.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Active Streams</h3>
            <p className="text-muted-foreground mb-4">
              {isAuthenticated 
                ? "Start your own stream and be the first to go live!"
                : "Sign up to start streaming and join our community!"}
            </p>
            {isAuthenticated ? (
              <Button asChild>
                <Link href="/communities">Start Streaming</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 