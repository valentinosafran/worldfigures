# API Keys Setup Guide for WorldFigures

## ✅ What You Already Have

### NewsAPI ✓
- **Key**: `8ac88fab350a427e8c711b3b87f86fd0`
- **Status**: Already added to `.env.local`
- **Requests**: 1000 requests available (resets in ~1 hour)
- **Your plan**: Appears to be a paid/developer plan (free is 100/day)
- **Action**: ✅ Ready to use!

## 🔧 What You Still Need

### 1. Reddit API (Recommended)

**IMPORTANT**: The info you found about Devvit is for Reddit's app platform. For server-side apps like yours, you need the **traditional Reddit API**.

#### Setup Steps (5 minutes):

1. **Go to**: https://www.reddit.com/prefs/apps
2. **Scroll down** and click **"create another app"** or **"create app"**
3. **Fill in the form**:
   - **Name**: `WorldFigures Data Fetcher`
   - **Type**: Select **"script"** (important!)
   - **Description**: `Fetching public data for WorldFigures scoring`
   - **About URL**: `https://worldfigures.com` (or leave blank)
   - **Redirect URI**: `http://localhost:3000` (required but not used)
4. **Click "create app"**
5. **Copy your credentials**:
   - **Client ID**: The string under "personal use script" (14 characters)
   - **Client Secret**: The longer string labeled "secret"

6. **Add to `.env.local`**:
```env
REDDIT_CLIENT_ID=your_14_char_id_here
REDDIT_CLIENT_SECRET=your_27_char_secret_here
```

**Rate Limits**:
- ✅ Free forever
- ✅ 60 requests per minute
- ✅ Unlimited daily requests

**Why you need it**:
- Social sentiment analysis
- Polarization metrics
- Engagement scoring

## 📊 Currently Used Free APIs (No Keys Needed)

These work automatically without API keys:

### Google Trends ✓
- **Library**: `google-trends-api`
- **Cost**: Free
- **Rate Limit**: Soft limit, rarely hit
- **What it provides**: Search interest, trending queries
- **Action**: ✅ Already integrated

### Wikipedia ✓
- **APIs**: Wikipedia API + Wikimedia REST API
- **Cost**: Free
- **Rate Limit**: Very generous for reasonable use
- **What it provides**: Page views, article quality, influence metrics
- **Action**: ✅ Already integrated

## 🚫 APIs You DON'T Need Right Now

### Twitter/X API ❌ (Expensive)
- **Cost**: $100+/month for useful access
- **Why skip**: Too expensive for MVP
- **Alternative**: We use Reddit instead
- **Future**: Consider when funded

### GDELT Project ⏳ (Complex)
- **Cost**: Free
- **Why skip for now**: 
  - Complex data format
  - Requires significant processing
  - Good for v2.0 when you need more historical data
- **Future**: Great for media monitoring at scale

### Polling APIs ⏳ (Limited Access)
Sites like FiveThirtyEight, RealClearPolitics don't have public APIs:
- **FiveThirtyEight**: No public API
- **RealClearPolitics**: No public API
- **Gallup**: Corporate accounts only
- **Pew Research**: No API, manual downloads only

**Current approach**: We estimate polling from news/social sentiment (works well!)

## 🎯 Summary: What to Do Now

### Step 1: Set up Reddit API (5 minutes)
Follow the Reddit setup steps above and add the credentials to `.env.local`

### Step 2: Test Your Setup
```bash
npm install
npm run dev
```

Then test in another terminal:
```bash
# Test with NewsAPI (will fetch real news)
curl http://localhost:3000/api/data/person/donald-trump

# Should return real data with ~50+ news articles
```

### Step 3: Monitor Usage

**NewsAPI**: 1000 requests available
- Each person lookup = 1 request
- Cache results to avoid re-fetching
- Resets in ~1 hour

**Reddit**: Unlimited
- 60 requests/minute is plenty
- Can fetch data for all 8 people easily

### Step 4: Deploy
```bash
git add .
git commit -m "Configure API keys for production data fetching"
git push origin main
```

Then add environment variables in Vercel:
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add:
   - `NEWSAPI_KEY` = `8ac88fab350a427e8c711b3b87f86fd0`
   - `REDDIT_CLIENT_ID` = (from Reddit app)
   - `REDDIT_CLIENT_SECRET` = (from Reddit app)
   - `REFRESH_TOKEN` = (any secure random string)

## 📈 Future API Integrations (When Budget Allows)

### Priority 1: Twitter/X API
- **Cost**: $100-$5000/month
- **Value**: Real-time sentiment, huge reach data
- **When**: After MVP validation or funding

### Priority 2: Premium News APIs
- **NewsAPI Pro**: $449/month for more sources
- **Aylien News API**: Custom pricing
- **When**: Need more comprehensive news coverage

### Priority 3: Professional Polling Data
- **Pollster API** or similar
- **Cost**: $200-1000/month
- **When**: Need actual polling vs sentiment estimates

## 🔐 Security Reminders

- ✅ `.env.local` is in `.gitignore`
- ✅ Never commit API keys to git
- ✅ Use environment variables in Vercel
- ✅ Rotate keys if exposed
- ✅ Monitor usage on provider dashboards

## ❓ Questions?

**Q: Do I need all APIs to start?**
A: No! NewsAPI alone is enough to get started. Reddit adds polish.

**Q: What if I hit rate limits?**
A: Implement caching (store results for 24 hours). With 1000 requests, you can refresh all 8 people ~125 times.

**Q: Can I use free Reddit without keys?**
A: No, Reddit requires OAuth for all API access. But setup takes 5 minutes and it's free forever.

**Q: Are there any truly open data sources?**
A: Yes! Google Trends and Wikipedia are completely open and already integrated.

## 🚀 You're Almost Ready!

You have:
- ✅ NewsAPI configured (1000 requests available)
- ✅ Google Trends integrated
- ✅ Wikipedia integrated
- ⏳ Just need Reddit API (5 minute setup)

Once Reddit is configured, you'll have a fully functional real-time scoring system!
