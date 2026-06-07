import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../../lib/redis';
import { people } from '../../../../data/people';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const redis = getRedisClient();

    if (!redis) {
      return NextResponse.json(
        { success: false, error: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    const results = await Promise.all(
      people.map(async (person) => {
        const slug = person.slug;
        const voteCountKey = `voteCount:${slug}`;
        const upvoteKey = `upvotes:${slug}`;
        const downvoteKey = `downvotes:${slug}`;

        const [netVotes, upvotes, downvotes] = await Promise.all([
          redis.get(voteCountKey),
          redis.get(upvoteKey),
          redis.get(downvoteKey),
        ]);

        return {
          slug,
          netVotes: Number(netVotes || 0),
          upvotes: Number(upvotes || 0),
          downvotes: Number(downvotes || 0),
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching bulk vote data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
