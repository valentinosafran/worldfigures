# WorldFigures API Setup Guide

This guide explains how to set up the backend APIs to fetch real data for WorldFigures scoring.

## Overview

The WorldFigures scoring system aggregates data from multiple free sources:

- **NewsAPI**: News articles and sentiment analysis
- **Reddit**: Social media sentiment and engagement
- **Google Trends**: Search interest and trending topics
- **Wikipedia**: Page views, influence metrics, and notability

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up API Keys

Copy the environment template:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:

#### NewsAPI (Required)
1. Go to https://newsapi.org
2. Sign up for a free account (100 requests/day)
3. Copy your API key
4. Add to `.env.local`: `NEWSAPI_KEY=your_key_here`

#### Reddit API (Optional but Recommended)
1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Choose "script" type
4. Fill in name and redirect URI (can be http://localhost)
5. Copy the client ID and secret
6. Add to `.env.local`:
   ```
   REDDIT_CLIENT_ID=your_client_id
   REDDIT_CLIENT_SECRET=your_client_secret
   ```

#### Refresh Token (Required)
Generate a secure random token for your refresh endpoint:

```bash
# On Linux/Mac
openssl rand -hex 32

# Or use any random string
```

Add to `.env.local`: `REFRESH_TOKEN=your_secure_token`

### 3. Update .gitignore

Make sure `.env.local` is in your `.gitignore`:

```
.env*.local
.env
```

## API Endpoints

### GET /api/data/person/[slug]

Fetches and calculates real-time scores for a specific person.

**Example:**
```bash
curl http://localhost:3000/api/data/person/donald-trump
```

**Response:**
```json
{
  "success": true,
  "data": {
    "personSlug": "donald-trump",
    "personName": "Donald Trump",
    "sources": [...],
    "breakdown": {
      "approval": { "score": 49, "components": {...} },
      "trust": { "score": 42, "components": {...} },
      "impact": { "score": 94, "components": {...} },
      "controversy": { "score": 89, "components": {...} }
    },
    "confidence": 88,
    "lastUpdated": "2026-05-20T10:30:00.000Z"
  }
}
```

### POST /api/data/refresh

Refreshes data for one or all people. Requires authorization.

**Refresh single person:**
```bash
curl -X POST http://localhost:3000/api/data/refresh \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"slug": "donald-trump"}'
```

**Refresh all people:**
```bash
curl -X POST http://localhost:3000/api/data/refresh \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"all": true}'
```

## Scoring Methodology

### Approval Score (0-100)
Combines:
- **Favorability (40%)**: Average of news and social sentiment
- **News Sentiment (30%)**: Sentiment analysis of news articles
- **Polling Trends (20%)**: Derived from sentiment patterns
- **Social Sentiment (10%)**: Reddit discussion sentiment

### Trust Score (0-100)
Combines:
- **Institutional (35%)**: Wikipedia presence + neutral coverage
- **Fact Check (25%)**: Fact-checking article sentiment
- **Expert Evaluation (25%)**: Wikipedia quality indicators
- **Consistency (15%)**: Sentiment consistency across articles

### Impact Score (0-100)
Combines:
- **Media Coverage (35%)**: Number of news articles
- **Policy Influence (25%)**: Wikipedia metrics
- **Social Reach (20%)**: Reddit engagement
- **Search Volume (15%)**: Google Trends interest
- **Event Impact (5%)**: Wikipedia edit recency

### Controversy Score (0-100)
Combines:
- **Negative Coverage (30%)**: Percentage of negative articles
- **Scandal Frequency (25%)**: Scandal-related keywords
- **Polarization (25%)**: Reddit sentiment variance
- **Criticism Intensity (15%)**: Average negative sentiment
- **Dispute Volume (5%)**: Dispute-related keywords

## Data Fetchers

### NewsAPIFetcher
- Fetches articles from the past 30 days
- Analyzes sentiment using the `sentiment` package
- Calculates coverage volume and negative coverage percentage

### RedditFetcher
- Searches multiple subreddits (worldnews, news, politics)
- Analyzes post and comment sentiment
- Calculates engagement and polarization metrics

### GoogleTrendsFetcher
- Gets search interest over time (30 days)
- Calculates search volume scores
- Identifies trending patterns

### WikipediaFetcher
- Retrieves page views (30-day total)
- Gets article metadata and categories
- Calculates influence based on views and article quality

## Development

### Run Development Server

```bash
npm run dev
```

### Test API Endpoints

```bash
# Test single person data fetch
npm run dev
# Then visit: http://localhost:3000/api/data/person/donald-trump

# Test refresh endpoint
curl -X POST http://localhost:3000/api/data/refresh \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"slug": "donald-trump"}'
```

### Add New People

Edit `data/people.ts` to add new profiles. The API will automatically fetch data for any person in the list.

## Free Tier Limitations

- **NewsAPI**: 100 requests/day (1 request per person lookup)
- **Reddit**: 60 requests/minute (unlimited daily)
- **Google Trends**: No official limit (rate-limited)
- **Wikipedia**: No limit for reasonable usage

**Recommendation**: Cache results and refresh daily or weekly to stay within limits.

## Next Steps

1. **Add Caching**: Implement Redis or file-based caching to store results
2. **Schedule Updates**: Use cron jobs or Vercel cron to auto-refresh data
3. **Add More Sources**:
   - Twitter/X API (if budget allows)
   - GDELT Project for media monitoring
   - Polling aggregators (FiveThirtyEight, RealClearPolitics)
4. **Implement Database**: Store historical data and trends
5. **Add Authentication**: Secure refresh endpoint properly

## Troubleshooting

### "NewsAPI key not configured"
- Make sure `.env.local` exists and contains `NEWSAPI_KEY`
- Restart the development server after adding environment variables

### "Reddit API credentials not configured"
- Reddit integration is optional; app will work without it
- To enable, add `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET`

### Low confidence scores
- Check that API keys are valid
- Verify network connectivity
- Check console logs for API errors
- Some people may have less available data

### Rate limiting
- NewsAPI free tier: 100 requests/day
- Wait 24 hours or upgrade to paid tier
- Consider implementing caching

## Production Deployment

### Environment Variables on Vercel

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all keys from `.env.local`:
   - `NEWSAPI_KEY`
   - `REDDIT_CLIENT_ID`
   - `REDDIT_CLIENT_SECRET`
   - `REFRESH_TOKEN`
4. Redeploy your application

### Caching Strategy

Consider implementing:
- Vercel KV for Redis-like caching
- File-based caching in `/tmp` directory
- Database for historical trends
- Edge caching for API responses

## Support

For issues or questions:
1. Check console logs for detailed error messages
2. Verify all API keys are correctly configured
3. Test each data fetcher individually
4. Review API documentation for each service
