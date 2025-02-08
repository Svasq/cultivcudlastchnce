"use client";

import { useState, useEffect } from 'react';

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
    <div>
      <h1>Communities</h1>
      <ul>
        {communities.map((community) => (
          <li key={community.id}>
            <h2>{community.name}</h2>
            <p>{community.bio}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
