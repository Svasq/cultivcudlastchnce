import { db } from "@/lib/db"
import { communities, users } from "@/lib/schema"
import { desc, eq, sql } from "drizzle-orm"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Video } from "lucide-react"
import { getJWTPayload } from "@/lib/auth"

async function getActiveStreams() {
  const activeStreams = await db
    .select({
      id: sql<string>`streams.id`,
      title: sql<string>`streams.title`,
      thumbnailUrl: sql<string>`streams.thumbnail_url`,
      viewerCount: sql<number>`streams.viewer_count`,
      startedAt: sql<string>`streams.created_at`,
      streamer: {
        id: users.id,
        name: users.name,
      },
      community: {
        id: communities.id,
        name: communities.name,
      },
    })
    .from(sql.raw('streams'))
    .innerJoin(users, sql`streams.user_id = ${users.id}`)
    .innerJoin(communities, sql`streams.community_id = ${communities.id}`)
    .where(sql`streams.status = 'active'`)
    .orderBy(desc(sql<number>`streams.viewer_count`))

  return activeStreams
}

export default async function LivePage() {
  const streams = await getActiveStreams()
  const user = await getJWTPayload()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Live Streams</h1>
          <p className="text-xl text-muted-foreground">
            Watch and create live streams with your community.
          </p>
        </div>
        {user && (
          <Link href="/live/create">
            <Button>
              <Video className="w-4 h-4 mr-2" />
              Go Live
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream) => (
          <Card key={stream.id} className="overflow-hidden">
            {stream.thumbnailUrl && (
              <div className="aspect-video w-full relative">
                <img
                  src={stream.thumbnailUrl}
                  alt={stream.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-sm font-medium">LIVE</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded-full text-sm">
                  {stream.viewerCount} watching
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-1">{stream.title}</CardTitle>
              <CardDescription>
                {stream.streamer.name} • {stream.community.name} • Started {new Date(stream.startedAt).toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {streams.length === 0 && (
        <Card className="p-12 text-center">
          <CardDescription>No active streams.</CardDescription>
          {user ? (
            <Button asChild className="mt-4">
              <Link href="/live/create">Start streaming</Link>
            </Button>
          ) : (
            <Button asChild variant="secondary" className="mt-4">
              <Link href="/auth/signup">Sign up to start streaming</Link>
            </Button>
          )}
        </Card>
      )}
    </div>
  )
} 