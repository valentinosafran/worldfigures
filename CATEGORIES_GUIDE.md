# WorldFigures Categories Guide

## Overview
Updated categories structure for 2025-2026 reflecting current global influence landscape with **42 total profiles**.

## Category Breakdown

### 🤖 Technology & AI (11 profiles)
Focus: AI development, hardware innovation, platform leadership

**Profiles:**
1. Elon Musk - Tech CEO (Tesla, X, SpaceX)
2. Sam Altman - AI CEO (OpenAI)
3. Jensen Huang - Tech CEO (NVIDIA)
4. Mark Zuckerberg - Tech CEO (Meta)
5. Sundar Pichai - Tech CEO (Google)
6. Satya Nadella - Tech CEO (Microsoft)
7. Demis Hassabis - AI Researcher (DeepMind)
8. Lisa Su - Tech CEO (AMD)
9. Geoffrey Hinton - AI Researcher (AI Safety)
10. Tim Cook - Tech CEO (Apple)
11. Dario Amodei - AI CEO (Anthropic)
12. Yann LeCun - AI Researcher (Meta)

**Score Ranges:**
- Impact: 75-96 (AI leaders dominating)
- Controversy: 24-86 (Musk highest, Hassabis lowest)
- Trust: 44-74 (Nadella/Hassabis highest)
- Approval: 48-76 (Hassabis/Nadella highest)

### 🌍 Politics & Geopolitics (15 profiles)
Focus: National leadership, international relations, policy influence

**Profiles:**
1. Donald Trump - Political figure (US)
2. Xi Jinping - President (China)
3. Vladimir Putin - President (Russia)
4. Narendra Modi - Prime Minister (India)
5. Volodymyr Zelenskyy - President (Ukraine)
6. Ursula von der Leyen - EU leader (EU)
7. Emmanuel Macron - President (France)
8. Joe Biden - President (United States)
9. Kamala Harris - Vice President (United States)
10. Benjamin Netanyahu - Prime Minister (Israel)
11. Mohammed bin Salman - Crown Prince (Saudi Arabia)
12. Keir Starmer - Prime Minister (United Kingdom)
13. Giorgia Meloni - Prime Minister (Italy)
14. Recep Tayyip Erdoğan - President (Turkey)
15. Jacinda Ardern - Former Prime Minister (New Zealand)

**Score Ranges:**
- Impact: 68-97 (Putin/Trump highest)
- Controversy: 38-94 (Putin/Trump highest)
- Trust: 28-68 (Putin lowest, Ardern highest)
- Approval: 32-71 (Putin lowest, Ardern highest)

### 💼 Finance & Business (6 profiles)
Focus: Capital allocation, market influence, wealth management

**Profiles:**
1. Larry Fink - Finance CEO (BlackRock)
2. Warren Buffett - Investor (Berkshire Hathaway)
3. Jamie Dimon - Bank CEO (JPMorgan)
4. Jeff Bezos - Business figure (Amazon founder, Blue Origin)
5. Bernard Arnault - Business CEO (LVMH)
6. Bill Gates - Philanthropist (Gates Foundation)

**Score Ranges:**
- Impact: 72-86 (Fink highest)
- Controversy: 22-72 (Buffett lowest, Bezos/Gates highest)
- Trust: 44-78 (Buffett highest)
- Approval: 48-76 (Buffett highest)

### 🎭 Media, Culture & Internet (6 profiles)
Focus: Cultural influence, content creation, athletic excellence

**Profiles:**
1. Taylor Swift - Musician
2. Joe Rogan - Podcaster
3. MrBeast - Content Creator
4. Cristiano Ronaldo - Athlete
5. Oprah Winfrey - Media mogul
6. LeBron James - Athlete

**Score Ranges:**
- Impact: 76-88 (Taylor Swift highest)
- Controversy: 28-76 (Oprah lowest, Rogan highest)
- Trust: 48-76 (Taylor Swift/Oprah highest)
- Approval: 54-82 (Taylor Swift highest)

### 🔬 Science, Health & Thought Leaders (4 profiles)
Focus: Scientific breakthroughs, philosophical influence, future thinking

**Profiles:**
1. Yuval Noah Harari - Historian
2. Peter Thiel - Investor (PayPal, Palantir)
3. Jennifer Doudna - Scientist (CRISPR)
4. Geoffrey Hinton - AI Researcher (also in Tech & AI)

**Score Ranges:**
- Impact: 73-79 (Hinton highest)
- Controversy: 36-78 (Thiel highest)
- Trust: 42-80 (Hinton highest)
- Approval: 46-78 (Hinton highest)

### 🇪🇺 EU Leaders (1 profile)
Focus: European Union governance and policy

**Profiles:**
1. Ursula von der Leyen - EU leader

## Category Filtering Logic

Categories use role-based filtering in `app/categories/page.tsx`:

```typescript
Technology & AI: role includes "tech", "ai", "researcher"
Politics & Geopolitics: role includes "president", "prime minister", "crown prince", "political"
Finance & Business: role includes "finance", "bank", "investor", "business" (excluding tech)
Media & Culture: role includes "musician", "podcaster", "content creator", "athlete", "media mogul"
Science & Thought Leaders: role includes "scientist", "historian", "researcher"
EU Leaders: role includes "eu"
```

## Regional Distribution

- **United States**: 21 profiles (50%)
- **Global**: 2 profiles (5%)
- **China**: 1 profile
- **Russia**: 1 profile
- **India**: 1 profile
- **Ukraine**: 1 profile
- **European Union**: 1 profile
- **France**: 2 profiles
- **United Kingdom**: 1 profile
- **Israel**: 2 profiles
- **Saudi Arabia**: 1 profile
- **Turkey**: 1 profile
- **Italy**: 1 profile
- **New Zealand**: 1 profile
- **Canada**: 1 profile

## Score Statistics Across All Profiles

**Impact** (Global influence):
- Minimum: 68 (Keir Starmer)
- Maximum: 97 (Vladimir Putin)
- Average: ~82
- Spread: 29 points

**Controversy** (Polarization level):
- Minimum: 18 (Lisa Su)
- Maximum: 94 (Vladimir Putin)
- Average: ~52
- Spread: 76 points ✅ Excellent differentiation

**Trust** (Credibility perception):
- Minimum: 28 (Vladimir Putin)
- Maximum: 80 (Geoffrey Hinton)
- Average: ~57
- Spread: 52 points ✅ Good differentiation

**Approval** (Public support):
- Minimum: 32 (Vladimir Putin)
- Maximum: 82 (Taylor Swift)
- Average: ~60
- Spread: 50 points ✅ Good differentiation

## API Batch Processing Impact

With 42 profiles (up from 8):

**Traditional Processing:**
- News: 42 API calls
- Wikipedia pages: 42 API calls
- Wikipedia pageviews: 42 API calls
- **Total: ~126 API calls per refresh**

**Batch Processing:**
- News: 1 batch generation (fallback articles)
- Wikipedia pages: 1 batch call (up to 50 per call)
- Wikipedia pageviews: 9 parallel batches (5 at a time)
- **Total: ~11 API calls per refresh**

**Efficiency Gain: 91% reduction in API calls**

## Usage Notes

1. **Homepage**: Displays benchmark stats averaged across all 42 profiles
2. **Categories Page**: Shows profiles organized by these 6 categories
3. **Top 100 Dashboard**: Will display all 42 profiles (expandable to 100)
4. **Profile Pages**: Individual detail pages for each figure
5. **Trending Section**: Shows top 3 by signal score with movement indicators

## Future Expansion

Current capacity: 42/100 profiles used (58 slots available)

**Potential additions:**
- More Asian leaders (Japan PM, South Korea President)
- Climate activists (Greta Thunberg)
- More AI researchers (Ilya Sutskever, Andrew Ng)
- More business leaders (TSMC, Samsung)
- Entertainment figures (more musicians, directors)
- Academic thought leaders
- Emerging political figures

## Technical Integration

All profiles automatically integrated with:
- ✅ Dynamic scoring system (NewsAPI + Wikipedia)
- ✅ Batch API processing
- ✅ Redis caching (3600s TTL)
- ✅ Historical tracking (30-day retention)
- ✅ Signal score calculation
- ✅ Movement indicators (7-day trends)
- ✅ Content analysis and insights
- ✅ Cache fallback for resilience

## Last Updated
May 20, 2026 - Initial expansion from 8 to 42 profiles
