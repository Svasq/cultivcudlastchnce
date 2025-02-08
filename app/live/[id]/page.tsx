import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { streams } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { LiveChat } from '@/components/live/live-chat';
import { VideoPlayer } from '@/components/live/video-player';

async function getStream(id: number) {
  const stream = await db.select()
    .from(streams)
    .where(eq(streams.id, id))
    .limit(1);
  
  return stream[0];
}

export default async function StreamPage({ params }: { params: { id: string } }) {
  const stream = await getStream(parseInt(params.id));

  if (!stream || stream.status !== 'active') {
    notFound();
  }

  const liveKitUrl = process.env.LIVEKIT_URL;
  const liveKitApiKey = process.env.LIVEKIT_API_KEY;
  const liveKitApiSecret = process.env.LIVEKIT_API_SECRET;

  return (
    <div className="container py-6">
      <div className="grid lg:grid-cols-[1fr,400px] gap-6">
        <div className="space-y-4">
          <VideoPlayer
            streamKey={stream.streamKey}
            liveKitUrl={liveKitUrl}
            liveKitApiKey={liveKitApiKey}
            liveKitApiSecret={liveKitApiSecret}
          />
          <h1 className="text-2xl font-bold">{stream.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{stream.viewerCount} watching</span>
          </div>
        </div>

        <Suspense fallback={<div>Loading chat...</div>}>
          <LiveChat streamId={stream.id} />
        </Suspense>
      </div>
    </div>
  );
}
