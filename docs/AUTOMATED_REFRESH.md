# Automated Data Refresh System

## Overview
The platform now automatically refreshes all 42 profiles **once daily** at 6 AM UTC using Vercel Cron Jobs. This keeps cached data fresh without manual intervention while staying well within free API limits.

## How It Works

### 1. **Cron Schedule**
- **Frequency**: Once per day (Vercel Hobby plan limitation)
- **Time**: 6:00 AM UTC (±59 minutes scheduling precision)
- **API Calls**: 42 calls/day (42 profiles × 1) - well within NewsAPI's 100/day free limit

### 2. **Data Flow**
```
Vercel Cron (6 AM UTC daily)
  ↓
/api/cron/refresh endpoint
  ↓
Refresh all 42 profiles in parallel
  ↓
Fetch from NewsAPI, Wikipedia, Google Trends
  ↓
Update Redis cache (1-hour TTL)
  ↓
Users see fresh data on next visit
```

### 3. **Cache Strategy**
- **Cache Duration**: 1 hour (3600 seconds)
- **Automatic Refresh**: Every 12 hours via cron
- **Manual Refresh**: Visit profile with `?refresh=true` parameter
- **Fallback**: Returns cached data if APIs fail

### 4. **API Usage Management**
```
NewsAPI Free Tier:
- Limit: 100 requests/24 hours
- Our Usage: 42 requests/day (cron) + ~58 spare for manual refreshes
- Per Profile: 1 automatic update/day (morning)

Wikipedia:
- No rate limit on free tier
- Batch optimization: 1 call per 50 profiles

Google Trends:
- Rate limited after 3-4 sequential requests
- Skipped in batch mode
- Used only for individual profile requests with delays
```

## Setup Instructions

### 1. **Local Development**
The cron endpoint works locally but won't auto-trigger. Test manually:
```bash
# Test the cron endpoint
curl http://localhost:3000/api/cron/refresh

# Or visit in browser
http://localhost:3000/api/cron/refresh
```

### 2. **Vercel Production Setup**

#### Step 1: Add Cron Secret to Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name**: `CRON_SECRET`
   - **Value**: Generate a secure random string (e.g., use password generator)
   - **Environment**: Production, Preview, Development
3. Click "Save"

#### Step 2: Deploy
```bash
git add -A
git commit -m "Add automated cron refresh system"
git push
```

#### Step 3: Verify Cron is Active
1. Go to Vercel Dashboard → Your Project → Cron Jobs
2. You should see: `/api/cron/refresh` scheduled for "0 6 * * *"
3. Vercel will automatically start calling this endpoint

#### Step 4: Monitor Execution
- Check Vercel Logs (Observability tab) around 6 AM UTC (±59 min precision)
- Look for: `✅ Refresh complete: 42/42 succeeded`
- Failed refreshes will show: `❌ Failed profiles: [list]`

### 3. **Manual Testing**

#### Test Individual Profile Refresh
```bash
# Force refresh a single profile
curl "https://worldfigures.vercel.app/api/data/person/donald-trump?refresh=true"
```

#### Test Full Cron Endpoint (Requires Secret)
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://worldfigures.vercel.app/api/cron/refresh
```

## Configuration

### Adjust Refresh Frequency

Edit `vercel.json` to change schedule:
```json
{
  "crons": [
    {
      "path": "/api/cron/refresh",
      "schedule": "0 6 * * *"  // Change this cron expression
    }
  ]
}
```

**Cron Expression Examples**:
- Once daily at 6 AM: `"0 6 * * *"` (42 calls/day - current, Hobby plan compatible)
- Once daily at 12 PM: `"0 12 * * *"` (42 calls/day - alternative time)
- Once daily at 6 PM: `"0 18 * * *"` (42 calls/day - evening refresh)
- Every Monday at 9 AM: `"0 9 * * 1"` (6 calls/day - weekly only)

**⚠️ Important**: 
- Hobby plan minimum interval: Once per day
- Scheduling precision: ±59 minutes from scheduled time
- Keep API usage under 100 calls/day for NewsAPI free tier

## Data Freshness Indicators

Profile pages show data status:
- 🔴 **Live** - Fresh data (just fetched)
- 🔼 **Cached** - Recent cache (< 1 hour old)
- 📊 **Static** - Fallback data (APIs unavailable)

## Monitoring & Maintenance

### Check Cron Execution Logs
1. Vercel Dashboard → Project → Logs
2. Filter by `/api/cron/refresh`
3. Look for execution times at 6 AM/PM UTC

### Common Issues

**Cron not running?**
- Verify `vercel.json` is in project root
- Check Environment Variables include `CRON_SECRET`
- Cron jobs only work on Production (not Preview deployments)

**Too many API errors?**
- NewsAPI may be rate limiting - check free tier status
- Consider reducing cron frequency to once daily
- Check Vercel logs for specific error messages

**Profiles showing stale data?**
- Check Redis cache TTL (currently 1 hour)
- Verify cron jobs are executing successfully
- Try manual refresh: `?refresh=true` on profile URL

## API Limits Reference

| API | Free Tier Limit | Our Usage | Buffer |
|-----|----------------|-----------|---------|
| NewsAPI | 100/day | 42/day | 58/day |
| Wikipedia | Unlimited | ~1/batch | N/A |
| Google Trends | ~100/hour | Skipped in batch | N/A |

## Future Improvements

1. **Intelligent Refresh Scheduling**
   - Refresh popular profiles more frequently
   - Refresh less popular profiles less often
   - Use analytics to prioritize

2. **Progressive Batch Refresh**
   - Split 42 profiles into batches
   - Refresh 10 profiles every 3 hours
   - Better API distribution

3. **Webhook Triggers**
   - Refresh on-demand when specific events occur
   - GitHub webhooks for manual triggers
   - User-requested refresh queue

4. **Advanced Caching**
   - Longer TTL for stable profiles (politicians)
   - Shorter TTL for volatile profiles (CEOs)
   - Smarter cache invalidation
