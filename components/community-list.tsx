'use client';

import { useOptimistic } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Community } from '@/lib/schema';

interface CommunityListProps {
  initialCommunities: Community[];
}

export function CommunityList({ initialCommunities }: CommunityListProps) {
  const [communities, addCommunity] = useOptimistic(
    initialCommunities,
    (state, newCommunity: Community) => [...state, newCommunity]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {communities.map((community) => (
        <Card key={community.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="line-clamp-1">{community.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground line-clamp-3">{community.bio}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 