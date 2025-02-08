import { Suspense } from 'react';
import { db } from '@/lib/db';
import { communities } from '@/lib/schema';
import { desc } from 'drizzle-orm';
import { CreateCommunity } from '@/components/create-community';
import { CommunityList } from '@/components/community-list';

async function getInitialCommunities() {
  return await db.query.communities.findMany({
    orderBy: [desc(communities.createdAt)],
  });
}

export default async function CommunitiesPage() {
  const initialCommunities = await getInitialCommunities();

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Communities</h1>
        <p className="text-muted-foreground">
          Join existing communities or create your own to connect with like-minded people.
        </p>
      </div>

      <CreateCommunity />

      <Suspense fallback={<div>Loading communities...</div>}>
        <CommunityList initialCommunities={initialCommunities} />
      </Suspense>
    </div>
  );
}
