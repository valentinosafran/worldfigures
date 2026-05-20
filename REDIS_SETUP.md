# Upstash Redis Setup Guide

## Why Redis?

We use Upstash Redis to cache calculated scores because:
- ✅ **Fast**: < 1ms read latency
- ✅ **Cost-effective**: Free tier covers 10k requests/day
- ✅ **Prevents API abuse**: Cache for 1 hour, avoid hitting NewsAPI/Wikipedia limits
- ✅ **Serverless**: Auto-scales, no maintenance

## Setup Steps

### 1. Create Upstash Redis on Vercel

1. Go to your Vercel project: https://vercel.com/your-username/worldfigures
2. Click **"Storage"** tab
3. Click **"Create Database"** → Select **"Upstash Redis"**
4. Configure:
   - Name: `worldfigures-cache`
   - Region: Choose closest to your primary users
   - Click **"Create"**

Vercel automatically adds these environment variables to your project:
```
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### 2. Set Production Base URL

Add this environment variable in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add:
   - Key: `NEXT_PUBLIC_BASE_URL`
   - Value: `https://worldfigures.vercel.app`
   - Apply to: **Production**, **Preview**, **Development**

### 3. Deploy

Push your code - Vercel will automatically redeploy with Redis enabled:

```bash
git add -A
git commit -m "Add Redis caching"
git push origin main
```

### 4. Verify Setup

After deployment, visit:
- **Test API**: https://worldfigures.vercel.app/test-api
- **Any Profile**: https://worldfigures.vercel.app/profile/donald-trump

You should see:
- ✅ "🔴 Live" status (not "📊 Static")
- ✅ Real scores (different from static data)
- ✅ Recent timestamp ("Just now" or "X mins ago")

## Local Development

To test locally with Redis:

1. Get your Redis credentials from Upstash dashboard:
   - Go to: https://console.upstash.com/redis
   - Click your database → **"REST API"** tab
   - Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

2. Create `.env.local`:

```bash
cp .env.local.example .env.local
```

3. Add your credentials to `.env.local`:

```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEWSAPI_KEY=your-newsapi-key
```

4. Run locally:

```bash
npm run dev
```

Visit http://localhost:3000 - you should see live data!

## How Caching Works

### Cache Strategy

1. **Person Page Request** → `/api/data/person/donald-trump`
   - Check Redis cache first
   - If found (< 1 hour old) → Return cached data
   - If not found → Calculate fresh scores → Cache for 1 hour

2. **Homepage/Dashboard Request** → `/api/data/bulk`
   - Check Redis for all people
   - If found → Return all cached data
   - If not found → Calculate all in batches → Cache all

3. **Force Refresh** → `/api/data/person/donald-trump?refresh=true`
   - Skip cache, calculate fresh
   - Update cache with new data

### Cache Lifetimes

- **Person data**: 1 hour (3600 seconds)
- **All people data**: 30 minutes (1800 seconds)
- **Last refresh**: 24 hours

### Cache Keys

```
person:donald-trump → { scores, sources, confidence, ... }
person:elon-musk    → { scores, sources, confidence, ... }
people:all          → { donald-trump: {...}, elon-musk: {...}, ... }
meta:last-refresh   → timestamp
```

## Monitoring

### Check Cache Status

Look for these logs in Vercel:

- `✅ Cache HIT for donald-trump` = Data served from cache
- `🔄 Calculating fresh data for donald-trump...` = API calls being made
- `💾 Cached data for donald-trump` = Data stored in Redis
- `⚠️ Redis not configured - caching disabled` = Redis env vars missing

### Check API Usage

NewsAPI has limits:
- **Free**: 100 requests/day
- **Developer**: 250 requests/day

With Redis caching (1 hour), a person's data is calculated:
- Max 24 times/day (once per hour)
- For 8 people: 24 × 8 = 192 requests/day ✅ Fits in free tier!

Without caching, every page view would trigger API calls 🚫

## Troubleshooting

### "Static" data still showing

1. **Check environment variables** in Vercel:
   ```
   UPSTASH_REDIS_REST_URL ✅
   UPSTASH_REDIS_REST_TOKEN ✅
   NEXT_PUBLIC_BASE_URL ✅
   NEWSAPI_KEY ✅
   ```

2. **Check Vercel logs**:
   - Go to: https://vercel.com/your-username/worldfigures/logs
   - Look for errors or "⚠️ Redis not configured"

3. **Force refresh**:
   - Visit: https://worldfigures.vercel.app/api/data/person/donald-trump?refresh=true
   - Should trigger fresh calculation

### Redis connection errors

1. **Verify Redis is created**:
   - Go to Vercel → Storage tab
   - Should see `worldfigures-cache`

2. **Regenerate tokens** if needed:
   - Upstash dashboard → Database → Settings → Regenerate Token

3. **Check region**: Use same region as Vercel deployment for best latency

## Cost Estimate

### Upstash Redis Free Tier

- **Requests**: 10,000/day
- **Storage**: 256 MB
- **Bandwidth**: 200 MB/day

### Our Usage

With 8 people and 1-hour cache:
- **Writes**: ~192/day (24 refreshes × 8 people)
- **Reads**: Depends on traffic, but cached for 1 hour reduces load
- **Storage**: ~50 KB total (well under 256 MB)

**Verdict**: Free tier is plenty for current scale! 🎉

### Scaling Up

When you add more people:
- 50 people: ~1,200 requests/day (still free tier)
- 100 people: ~2,400 requests/day (still free tier)
- 500+ people: Consider increasing cache time to 2-4 hours

## Next Steps

1. ✅ Set up Upstash Redis on Vercel
2. ✅ Add `NEXT_PUBLIC_BASE_URL` environment variable
3. ✅ Deploy and verify live data is showing
4. 🔄 Optional: Set up automated refresh (cron job) to warm cache
5. 📊 Optional: Add analytics to track cache hit rates

## Support

- **Upstash Docs**: https://docs.upstash.com/redis
- **Next.js + Upstash**: https://vercel.com/docs/storage/vercel-kv
- **Redis Commands**: https://redis.io/commands/
