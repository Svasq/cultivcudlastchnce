'use client';

import { useOptimistic } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Users } from 'lucide-react';

interface Stream {
  id: number;
  title: string;
  communityId: number;
  status: string;
  viewerCount: number;
  thumbnailUrl?: string;
  createdAt: string;
}

interface LiveGridProps {
  initialStreams: Stream[];
}

export function LiveGrid({ initialStreams }: LiveGridProps) {
  const [streams, addStream] = useOptimistic<Stream[]>(
    initialStreams,
    (state, newStream: Stream) => [...state, newStream]
  );

  if (streams.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No active streams. Start one from your community dashboard!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {streams.map((stream) => (
        <Link href={`/live/${stream.id}`} key={stream.id}>
          <Card className="hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden rounded-t-lg bg-muted">
              {stream.thumbnailUrl ? (
                <img 
                  src={stream.thumbnailUrl} 
                  alt={stream.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-muted-foreground">No preview available</span>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                LIVE
              </div>
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                <Users size={14} />
                {stream.viewerCount}
              </div>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{stream.title}</CardTitle>
            </CardHeader>
            <CardFooter className="text-sm text-muted-foreground">
              Started {formatDistanceToNow(new Date(stream.createdAt))} ago
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
} 