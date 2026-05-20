# New Profiles Added - May 2026

## Summary
Expanded from 8 to **45 profiles** across updated categories reflecting 2025-2026 global influence landscape.

## New Categories

### 1. Technology & AI (11 profiles)
- ✅ Elon Musk (existing)
- ✨ Sam Altman (OpenAI CEO)
- ✨ Jensen Huang (NVIDIA CEO)
- ✨ Mark Zuckerberg (Meta CEO)
- ✨ Sundar Pichai (Google CEO)
- ✨ Satya Nadella (Microsoft CEO)
- ✨ Demis Hassabis (DeepMind CEO)
- ✨ Lisa Su (AMD CEO)
- ✨ Geoffrey Hinton (AI Researcher)
- ✨ Tim Cook (Apple CEO)
- ✨ Dario Amodei (Anthropic CEO)
- ✨ Yann LeCun (Meta AI Researcher)

### 2. Politics & Geopolitics (15 profiles)
- ✅ Donald Trump (existing)
- ✅ Xi Jinping (existing)
- ✅ Vladimir Putin (existing)
- ✅ Narendra Modi (existing)
- ✅ Ursula von der Leyen (existing)
- ✅ Volodymyr Zelenskyy (existing)
- ✅ Emmanuel Macron (existing)
- ✅ Jacinda Ardern (existing - Former PM)
- ✨ Joe Biden (US President)
- ✨ Kamala Harris (US Vice President)
- ✨ Benjamin Netanyahu (Israel PM)
- ✨ Mohammed bin Salman (Saudi Crown Prince)
- ✨ Keir Starmer (UK PM)
- ✨ Giorgia Meloni (Italy PM)
- ✨ Recep Tayyip Erdoğan (Turkey President)

### 3. Finance & Business (6 profiles)
- ✨ Larry Fink (BlackRock CEO)
- ✨ Warren Buffett (Investor)
- ✨ Jamie Dimon (JPMorgan CEO)
- ✨ Jeff Bezos (Amazon Founder)
- ✨ Bernard Arnault (LVMH CEO)
- ✨ Bill Gates (Philanthropist)

### 4. Media, Culture & Internet (6 profiles)
- ✨ Taylor Swift (Musician)
- ✨ Joe Rogan (Podcaster)
- ✨ MrBeast (Content Creator)
- ✨ Cristiano Ronaldo (Athlete)
- ✨ Oprah Winfrey (Media Mogul)
- ✨ LeBron James (Athlete)

### 5. Science, Health & Thought Leaders (4 profiles)
- ✨ Yuval Noah Harari (Historian)
- ✨ Peter Thiel (Investor/Philosopher)
- ✨ Jennifer Doudna (CRISPR Scientist)
- ✨ Geoffrey Hinton (listed in Tech & AI)

## Images Needed

All new profiles (✨) need placeholder images at:
`/images/people/[slug].jpg`

### New Profile Image Paths Required:
```
/images/people/sam-altman.jpg
/images/people/jensen-huang.jpg
/images/people/mark-zuckerberg.jpg
/images/people/sundar-pichai.jpg
/images/people/satya-nadella.jpg
/images/people/demis-hassabis.jpg
/images/people/lisa-su.jpg
/images/people/geoffrey-hinton.jpg
/images/people/vladimir-putin.jpg
/images/people/joe-biden.jpg
/images/people/benjamin-netanyahu.jpg
/images/people/mohammed-bin-salman.jpg
/images/people/keir-starmer.jpg
/images/people/larry-fink.jpg
/images/people/warren-buffett.jpg
/images/people/jamie-dimon.jpg
/images/people/jeff-bezos.jpg
/images/people/taylor-swift.jpg
/images/people/joe-rogan.jpg
/images/people/mrbeast.jpg
/images/people/cristiano-ronaldo.jpg
/images/people/oprah-winfrey.jpg
/images/people/yuval-noah-harari.jpg
/images/people/peter-thiel.jpg
/images/people/jennifer-doudna.jpg
/images/people/kamala-harris.jpg
/images/people/tim-cook.jpg
/images/people/dario-amodei.jpg
/images/people/giorgia-meloni.jpg
/images/people/bill-gates.jpg
/images/people/lebron-james.jpg
/images/people/bernard-arnault.jpg
/images/people/recep-tayyip-erdogan.jpg
/images/people/yann-lecun.jpg
```

## Batch API Integration Status

✅ Wikipedia batch fetching implemented (reduces N calls to ceiling(N/50))
✅ News API batch generation (consistent fallback articles)
✅ Score calculator batch method created
✅ Bulk endpoint updated to use batch processing

With 45 profiles:
- **Before**: ~135 API calls (3 per profile × 45)
- **After**: ~10 API calls (batch processing)
- **Reduction**: 93% fewer API requests

## Next Steps

1. **Generate Placeholder Images**: Create or source 400x400px professional headshots for all new profiles
2. **Test Bulk Endpoint**: Verify batch processing works correctly with 45 profiles
3. **Verify Categories Page**: Ensure all profiles are properly categorized
4. **Update Top 100 Dashboard**: Confirm it displays all 45 profiles correctly
5. **Monitor API Rate Limits**: Track NewsAPI (100/day), Wikipedia usage with expanded dataset

## Score Distribution (New Profiles)

**Impact Range**: 68-97 (30-point spread)
**Controversy Range**: 18-94 (76-point spread)
**Trust Range**: 28-80 (52-point spread)
**Approval Range**: 32-82 (50-point spread)

Maintains good differentiation across all metrics with batch processing efficiency.
