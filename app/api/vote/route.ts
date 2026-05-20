import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '../../../lib/redis';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Simple rate limiting using IP
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_VOTES_PER_WINDOW = 10;

interface VoteRequest {
  slug: string;
  action: 'upvote' | 'downvote';
  userId: string; // Client-generated ID from localStorage
}

export async function POST(request: NextRequest) {
  try {
    const body: VoteRequest = await request.json();
    const { slug, action, userId } = body;

    if (!slug || !action || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    
    const redis = getRedisClient();
    
    if (!redis) {
      return NextResponse.json(
        { success: false, error: 'Database connection unavailable' },
        { status: 503 }
      );
    }
    
    // Check rate limit
    const rateLimitKey = `rateLimit:vote:${ip}`;
    const currentVotes = await redis.incr(rateLimitKey);
    
    if (currentVotes === 1) {
      // First vote in window, set expiry
      await redis.expire(rateLimitKey, 60);
    }
    
    if (currentVotes > MAX_VOTES_PER_WINDOW) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    // Check if user has already voted on this profile
    const userVoteKey = `userVote:${slug}:${userId}`;
    const existingVote = await redis.get(userVoteKey);

    let voteChange = 0;
    
    if (existingVote === action) {
      // User clicking same vote again - remove it
      await redis.del(userVoteKey);
      voteChange = action === 'upvote' ? -1 : 1;
    } else if (existingVote) {
      // User switching vote
      await redis.set(userVoteKey, action);
      voteChange = action === 'upvote' ? 2 : -2;
    } else {
      // New vote
      await redis.set(userVoteKey, action);
      await redis.expire(userVoteKey, 365 * 24 * 60 * 60); // 1 year expiry
      voteChange = action === 'upvote' ? 1 : -1;
    }

    // Update vote count
    const voteCountKey = `voteCount:${slug}`;
    const newCount = await redis.incrby(voteCountKey, voteChange);

    // Store vote timestamp
    const voteTimestampKey = `voteTimestamp:${slug}`;
    await redis.zadd(voteTimestampKey, { score: Date.now(), member: userId });
    
    // Get updated stats
    const upvoteKey = `upvotes:${slug}`;
    const downvoteKey = `downvotes:${slug}`;
    
    if (action === 'upvote') {
      if (existingVote === 'downvote') {
        await redis.decr(downvoteKey);
      }
      if (existingVote !== action) {
        await redis.incr(upvoteKey);
      } else {
        await redis.decr(upvoteKey);
      }
    } else {
      if (existingVote === 'upvote') {
        await redis.decr(upvoteKey);
      }
      if (existingVote !== action) {
        await redis.incr(downvoteKey);
      } else {
        await redis.decr(downvoteKey);
      }
    }

    const upvotes = Number(await redis.get(upvoteKey) || 0);
    const downvotes = Number(await redis.get(downvoteKey) || 0);

    return NextResponse.json({
      success: true,
      data: {
        netVotes: Number(newCount || 0),
        upvotes,
        downvotes,
        userVote: existingVote === action ? null : action,
      },
    });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const userId = searchParams.get('userId');

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Missing slug parameter' },
        { status: 400 }
      );
    }

    const redis = getRedisClient();
    
    if (!redis) {
      return NextResponse.json(
        { success: false, error: 'Database connection unavailable' },
        { status: 503 }
      );
    }
    
    const voteCountKey = `voteCount:${slug}`;
    const upvoteKey = `upvotes:${slug}`;
    const downvoteKey = `downvotes:${slug}`;
    
    const [netVotes, upvotes, downvotes] = await Promise.all([
      redis.get(voteCountKey),
      redis.get(upvoteKey),
      redis.get(downvoteKey),
    ]);

    let userVote = null;
    if (userId) {
      const userVoteKey = `userVote:${slug}:${userId}`;
      userVote = await redis.get(userVoteKey);
    }

    return NextResponse.json({
      success: true,
      data: {
        netVotes: Number(netVotes || 0),
        upvotes: Number(upvotes || 0),
        downvotes: Number(downvotes || 0),
        userVote,
      },
    });
  } catch (error) {
    console.error('Error fetching vote data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
