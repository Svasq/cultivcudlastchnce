import useSWR, { mutate } from 'swr';
import { toast } from 'sonner';

// Ensure this interface is exported for use in other components.
export interface Community {
  id: number;
  name: string;
  bio: string;
  member_count: number;
  imageUrl?: string;
  isOwner?: boolean;
  isMember?: boolean;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export function useCommunity() {
  const { data: communities, error, isLoading } = useSWR<Community[]>('/api/communities', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000, // Cache for 30 seconds
  });

  const joinCommunity = async (communityId: number) => {
    // Optimistically update the UI
    const oldCommunities = communities || [];
    const newCommunities = oldCommunities.map(c => 
      c.id === communityId 
        ? { ...c, isMember: true, member_count: c.member_count + 1 }
        : c
    );

    try {
      // Update local data immediately
      mutate('/api/communities', newCommunities, false);

      const res = await fetch(`/api/communities/${communityId}/join`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error(await res.text());
      
      toast.success('Successfully joined community');
      // Revalidate the data
      mutate('/api/communities');
    } catch (error) {
      // Revert on error
      mutate('/api/communities', oldCommunities, false);
      toast.error(error instanceof Error ? error.message : 'Failed to join community');
    }
  };

  const createCommunity = async (data: { name: string; bio: string; imageUrl?: string }) => {
    try {
      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(await res.text());

      const newCommunity = await res.json();
      toast.success('Community created successfully');
      
      // Update cache with new community
      mutate('/api/communities', [...(communities || []), newCommunity]);
      return newCommunity;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create community');
      throw error;
    }
  };

  return {
    communities,
    error,
    isLoading,
    joinCommunity,
    createCommunity,
  };
}
