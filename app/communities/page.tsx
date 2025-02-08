"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from 'lucide-react';
import Link from 'next/link';

interface Community {
  id: number;
  name: string;
  bio: string;
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities');
      const data = await response.json();
      if (Array.isArray(data)) {
        setCommunities(data);
      } else {
        console.error('Data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Communities</h1>
        <p className="text-muted-foreground">
          Join existing communities or create your own to connect with like-minded people.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <Card key={community.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="line-clamp-1">{community.name}</span>
                <Link href={`/communities/${community.id}/stream`}>
                  <Button variant="outline" size="sm">
                    <Video className="w-4 h-4 mr-2" />
                    Go Live
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">{community.bio}</p>
            </CardContent>
          </Card>
        ))}
        {communities.length === 0 && (
          <div className="text-center">
            <p className="text-muted-foreground">
              There are currently no communities. Community streaming allows you to connect with others who share your interests. Create your own community and start streaming!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
