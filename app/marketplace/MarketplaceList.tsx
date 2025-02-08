'use client';

import { useOptimistic, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

interface MarketplaceListing {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  authorName: string;
  createdAt: string;
  status: string;
}

interface Props {
  initialListings: MarketplaceListing[];
}

export function MarketplaceList({ initialListings }: Props) {
  const [listings, addListing] = useOptimistic<MarketplaceListing[]>(
    initialListings,
    (state, newListing: MarketplaceListing) => [newListing, ...state]
  );

  useEffect(() => {
    // Set up real-time updates using EventSource
    const events = new EventSource('/api/marketplace/events');
    
    events.onmessage = (event) => {
      if (event.data === 'connected' || event.data === 'heartbeat') return;
      const data = JSON.parse(event.data);
      addListing(data);
    };

    return () => events.close();
  }, []);

  if (listings.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No listings yet. Be the first to create one!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <Card key={listing.id} className="flex flex-col">
          {listing.imageUrl && (
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
              <img 
                src={listing.imageUrl} 
                alt={listing.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
            <CardDescription className="line-clamp-2">{listing.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold">
              ${listing.price.toFixed(2)}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <div className="truncate">Listed by {listing.authorName}</div>
            <div>{new Date(listing.createdAt).toISOString().split('T')[0]}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
