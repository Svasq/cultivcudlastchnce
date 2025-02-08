import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communityMembers, communities } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { createApiHandler } from '@/lib/api-utils';

export const POST = createApiHandler(async (req, { params, userId }) => {
  const communityId = Number(params.id);
  
  const [community, existingMembership] = await Promise.all([
    db.query.communities.findFirst({
      where: eq(communities.id, communityId)
    }),
    db.query.communityMembers.findFirst({
      where: and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, userId)
      )
    })
  ]);

  if (!community) {
    return NextResponse.json({ error: 'Community not found' }, { status: 404 });
  }

  if (existingMembership) {
    return NextResponse.json({ error: 'Already a member' }, { status: 400 });
  }

  await db.transaction(async (tx) => {
    const data = { community_id: communityId, user_id: userId, role: 'member' };
    await tx.insert(communityMembers).values(data);

    await tx
      .update(communities)
      .set({ member_count: community.member_count + 1 })
      .where(eq(communities.id, communityId));
  });

  return NextResponse.json({ message: 'Joined successfully' });
}); 