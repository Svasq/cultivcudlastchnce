import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { communities, streams } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StreamSetup } from '@/components/live/stream-setup';

async function getCommunity(id: number) {
  const community = await db.select()
    .from(communities)
    .where(eq(communities.id, id))
    .limit(1);
  
  return community[0];
}

export default async function StreamSetupPage({ params }: { params: { id: string } }) {
  const community = await getCommunity(parseInt(params.id));

  if (!community) {
    notFound();
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Stream Setup</h1>
        <p className="text-muted-foreground">
          Set up your live stream for {community.name}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stream Settings</CardTitle>
            <CardDescription>Configure your stream settings</CardDescription>
          </CardHeader>
          <CardContent>
            <StreamSetup communityId={community.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stream Information</CardTitle>
            <CardDescription>Important information for your stream</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Server URL</h3>
              <Input 
                readOnly 
                value={`rtmp://${process.env.NEXT_PUBLIC_STREAM_SERVER}/live`} 
              />
            </div>
            <div>
              <h3 className="font-medium mb-2">Stream Key</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Keep this private! You'll need this to connect your streaming software.
              </p>
              <Input 
                type="password" 
                readOnly 
                value="your-stream-key-here"
              />
              <Button variant="outline" className="mt-2" size="sm">
                Show Stream Key
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 