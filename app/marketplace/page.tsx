import { Suspense } from 'react';
import { MarketplaceList } from './MarketplaceList';
import { CreateListing } from './CreateListing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from '@/lib/db';
import { marketplace } from '@/lib/schema';
import { desc } from 'drizzle-orm';

async function getListings() {
  return await db
    .select()
    .from(marketplace)
    .where(marketplace.status.eq('active'))
    .orderBy(desc(marketplace.createdAt));
}

export default async function MarketplacePage() {
  const initialListings = await getListings();

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Community Marketplace</CardTitle>
            <CardDescription>Buy, sell, or trade with other community members</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateListing />
          </CardContent>
        </Card>

        <Suspense fallback={<div>Loading listings...</div>}>
          <MarketplaceList initialListings={initialListings} />
        </Suspense>
      </div>
    </div>
  );
} 