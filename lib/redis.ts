import { Redis } from '@upstash/redis';

// Initialize Redis client
let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  // Vercel uses KV_ prefix for environment variables
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('⚠️  Redis not configured - caching disabled');
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url,
      token,
    });
    console.log('✅ Redis client initialized');
  }

  return redis;
}

/**
 * Cache keys for different data types
 */
export const CacheKeys = {
  personData: (slug: string) => `person:${slug}`,
  personHistory: (slug: string) => `history:${slug}`,
  allPeople: () => 'people:all',
  lastRefresh: () => 'meta:last-refresh',
};

/**
 * Cache TTL (time-to-live) in seconds
 */
export const CacheTTL = {
  personData: 60 * 60, // 1 hour
  personHistory: 60 * 60 * 24 * 30, // 30 days
  allPeople: 60 * 30, // 30 minutes
  lastRefresh: 60 * 60 * 24, // 24 hours
};

/**
 * Get cached person data
 */
export async function getCachedPersonData(slug: string): Promise<any | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get(CacheKeys.personData(slug));
    if (data) {
      console.log(`✅ Cache HIT for ${slug}`);
    }
    return data;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

/**
 * Cache person data
 */
export async function cachePersonData(slug: string, data: any): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.setex(CacheKeys.personData(slug), CacheTTL.personData, JSON.stringify(data));
    console.log(`💾 Cached data for ${slug}`);
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

/**
 * Get all cached people data
 */
export async function getAllCachedPeopleData(): Promise<Map<string, any> | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get(CacheKeys.allPeople());
    if (data) {
      console.log('✅ Cache HIT for all people');
      return new Map(Object.entries(data as Record<string, any>));
    }
    return null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

/**
 * Cache all people data
 */
export async function cacheAllPeopleData(dataMap: Map<string, any>): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    const dataObject = Object.fromEntries(dataMap);
    await client.setex(CacheKeys.allPeople(), CacheTTL.allPeople, JSON.stringify(dataObject));
    console.log('💾 Cached all people data');
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

/**
 * Invalidate cache for a person
 */
export async function invalidatePersonCache(slug: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.del(CacheKeys.personData(slug));
    console.log(`🗑️  Invalidated cache for ${slug}`);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

/**
 * Invalidate all caches
 */
export async function invalidateAllCaches(): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.del(CacheKeys.allPeople());
    console.log('🗑️  Invalidated all people cache');
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

/**
 * Store historical snapshot of person data
 */
export async function storeHistoricalSnapshot(slug: string, data: any): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    const timestamp = Date.now();
    const snapshot = {
      timestamp,
      date: new Date().toISOString(),
      scores: data.breakdown,
      confidence: data.confidence,
    };

    // Store in a sorted set with timestamp as score
    await client.zadd(CacheKeys.personHistory(slug), {
      score: timestamp,
      member: JSON.stringify(snapshot),
    });

    // Keep only last 90 days of history (cleanup old data)
    const ninetyDaysAgo = timestamp - (90 * 24 * 60 * 60 * 1000);
    await client.zremrangebyscore(CacheKeys.personHistory(slug), '-inf', ninetyDaysAgo);

    console.log(`📊 Stored historical snapshot for ${slug}`);
  } catch (error) {
    console.error('Redis history store error:', error);
  }
}

/**
 * Get historical data for calculating trends
 */
export async function getHistoricalData(slug: string, daysAgo: number): Promise<any | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const targetTime = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);
    
    // Get snapshots within ±12 hours of target time
    const rangeStart = targetTime - (12 * 60 * 60 * 1000);
    const rangeEnd = targetTime + (12 * 60 * 60 * 1000);
    
    const snapshots = await client.zrangebyscore(
      CacheKeys.personHistory(slug),
      rangeStart,
      rangeEnd
    );

    if (!snapshots || snapshots.length === 0) {
      return null;
    }

    // Return the closest snapshot
    const parsed = snapshots.map((s: string) => JSON.parse(s));
    parsed.sort((a, b) => Math.abs(a.timestamp - targetTime) - Math.abs(b.timestamp - targetTime));
    
    return parsed[0];
  } catch (error) {
    console.error('Redis history fetch error:', error);
    return null;
  }
}
