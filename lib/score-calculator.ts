import { newsAPIFetcher } from './data-fetchers/news-api';
import { redditFetcher } from './data-fetchers/reddit';
import { googleTrendsFetcher } from './data-fetchers/google-trends';
import { wikipediaFetcher } from './data-fetchers/wikipedia';
import { contentAnalyzer } from './content-analyzer';
import { SCORING_WEIGHTS } from './config';
import { getWikipediaPageName } from './wikipedia-mappings';
import { ScoreBreakdown, AggregatedData, DataSource } from '../types';

export class ScoreCalculator {
  /**
   * Calculate all scores for a person
   */
  async calculateScores(personName: string, personSlug: string): Promise<AggregatedData> {
    console.log(`Calculating scores for ${personName}...`);

    const startTime = Date.now();

    // Get proper Wikipedia page name
    const wikiPageName = getWikipediaPageName(personSlug, personName);
    console.log(`Wikipedia page name: "${wikiPageName}"`);

    // Note: Reddit API is no longer accessible to third-party apps (as of 2023)
    // We'll try to fetch but expect 0 results - scores will auto-adjust
    console.log(`⚠️  Reddit API access restricted - scores will be calculated without Reddit data`);

    // Fetch data from all sources in parallel
    const [newsArticles, redditPosts, trendData, wikiPage] = await Promise.all([
      newsAPIFetcher.fetchNews(personName, 30),
      Promise.resolve([]), // Skip Reddit - API no longer accessible
      googleTrendsFetcher.getInterestOverTime(personName),
      this.getWikiData(wikiPageName),
    ]);

    console.log(`Data fetched in ${Date.now() - startTime}ms`);
    console.log(`- News articles: ${newsArticles.length}`);
    console.log(`- Reddit posts: ${redditPosts.length} (skipped - API restricted)`);
    console.log(`- Trend data points: ${trendData.length}`);
    console.log(`- Wikipedia data: ${wikiPage ? 'found' : 'not found'}`);

    // Calculate component scores
    const breakdown = this.calculateBreakdown(newsArticles, redditPosts, trendData, wikiPage);

    // Prepare data sources metadata - only include sources with data
    const sources: DataSource[] = [
      {
        type: 'news',
        name: 'NewsAPI',
        data: { articleCount: newsArticles.length },
        timestamp: new Date().toISOString(),
        confidence: this.calculateSourceConfidence(newsArticles.length, 50),
      },
      {
        type: 'trends',
        name: 'Google Trends',
        data: { dataPoints: trendData.length },
        timestamp: new Date().toISOString(),
        confidence: this.calculateSourceConfidence(trendData.length, 20),
      },
      {
        type: 'wikipedia',
        name: 'Wikipedia',
        data: wikiPage ? { pageViews: wikiPage.pageViews } : {},
        timestamp: new Date().toISOString(),
        confidence: wikiPage ? 100 : 0,
      },
    ];

    // Filter out sources with 0 confidence (no data)
    const activeSources = sources.filter(s => s.confidence > 0);

    const overallConfidence = this.calculateOverallConfidence(activeSources);

    // Analyze content to extract insights
    console.log('📊 Analyzing content for insights...');
    const insights = contentAnalyzer.analyzeProfile(newsArticles, breakdown, trendData);
    console.log(`✅ Insights extracted: ${insights.keyTopics.length} topics, ${insights.articles.length} articles`);

    return {
      personSlug,
      personName,
      sources: activeSources,
      breakdown,
      confidence: overallConfidence,
      lastUpdated: new Date().toISOString(),
      keyTopics: insights.keyTopics,
      movementNotes: insights.movementNotes,
      strengthSignals: insights.strengthSignals,
      riskSignals: insights.riskSignals,
      articles: insights.articles,
    };
  }

  /**
   * Get Wikipedia data for a person
   */
  private async getWikiData(personName: string) {
    console.log(`\n🔎 Looking up Wikipedia for: "${personName}"`);
    
    // Try direct page lookup first
    let wikiData = await wikipediaFetcher.getPageData(personName);
    
    // If not found, try searching
    if (!wikiData) {
      console.log(`⚠️ Direct lookup failed, searching Wikipedia...`);
      const searchResult = await wikipediaFetcher.searchPage(personName);
      if (searchResult) {
        console.log(`✅ Found via search: "${searchResult}"`);
        wikiData = await wikipediaFetcher.getPageData(searchResult);
      } else {
        console.warn(`❌ No Wikipedia page found for "${personName}"`);
      }
    } else {
      console.log(`✅ Wikipedia: Direct lookup successful`);
    }

    return wikiData;
  }

  /**
   * Calculate all score components with dynamic weight adjustment for missing data
   */
  private calculateBreakdown(
    newsArticles: any[],
    redditPosts: any[],
    trendData: any[],
    wikiData: any
  ): ScoreBreakdown {
    console.log('\n🧮 Calculating score breakdown...');
    
    const hasRedditData = redditPosts.length > 0;
    const hasTrendsData = trendData.length > 0;
    
    // APPROVAL COMPONENTS - exclude Reddit if no data
    const newsSentiment = newsAPIFetcher.getSentimentScore(newsArticles);
    const socialSentiment = hasRedditData ? redditFetcher.getSocialSentimentScore(redditPosts) : null;
    
    // Calculate favorability and polling trends without Reddit if missing
    let favorability, pollingTrends;
    if (hasRedditData) {
      favorability = Math.round((newsSentiment + socialSentiment!) / 2);
      pollingTrends = this.estimatePollingTrends(newsSentiment, socialSentiment!);
    } else {
      favorability = newsSentiment;
      pollingTrends = newsSentiment;
    }

    console.log(`  Approval components:`);
    console.log(`    News Sentiment: ${newsSentiment}`);
    console.log(`    Social Sentiment: ${hasRedditData ? socialSentiment : 'N/A (excluded)'}`);
    console.log(`    Favorability: ${favorability}`);
    console.log(`    Polling Trends: ${pollingTrends}`);

    // Dynamic weight calculation - redistribute Reddit's weight to other components
    let approvalScore;
    if (hasRedditData) {
      approvalScore = Math.round(
        favorability * SCORING_WEIGHTS.approval.favorability +
        newsSentiment * SCORING_WEIGHTS.approval.newsSentiment +
        pollingTrends * SCORING_WEIGHTS.approval.pollingTrends +
        socialSentiment! * SCORING_WEIGHTS.approval.socialSentiment
      );
    } else {
      // Redistribute weights: social 10% split between news (6%) and favorability (4%)
      const adjustedWeights = {
        favorability: 0.44, // 40% + 4%
        newsSentiment: 0.36, // 30% + 6%
        pollingTrends: 0.20  // 20%
      };
      approvalScore = Math.round(
        favorability * adjustedWeights.favorability +
        newsSentiment * adjustedWeights.newsSentiment +
        pollingTrends * adjustedWeights.pollingTrends
      );
      console.log(`    ⚠️ Reddit data missing - weights adjusted`);
    }
    
    console.log(`    → Approval Score: ${approvalScore}`);

    // TRUST COMPONENTS
    const institutional = this.estimateInstitutionalTrust(wikiData, newsArticles);
    const factCheck = this.estimateFactCheckScore(newsArticles);
    const expertEval = this.estimateExpertEvaluation(wikiData);
    const consistency = this.estimateConsistency(newsArticles);

    console.log(`  Trust components:`);
    console.log(`    Institutional: ${institutional}`);
    console.log(`    Fact Check: ${factCheck}`);
    console.log(`    Expert Eval: ${expertEval}`);
    console.log(`    Consistency: ${consistency}`);

    const trustScore = Math.round(
      institutional * SCORING_WEIGHTS.trust.institutional +
      factCheck * SCORING_WEIGHTS.trust.factCheck +
      expertEval * SCORING_WEIGHTS.trust.expertEval +
      consistency * SCORING_WEIGHTS.trust.consistency
    );
    
    console.log(`    → Trust Score: ${trustScore}`);

    // IMPACT COMPONENTS - exclude missing data sources
    const mediaCoverage = newsAPIFetcher.getCoverageScore(newsArticles);
    const socialReach = hasRedditData ? redditFetcher.getEngagementScore(redditPosts) : null;
    const searchVolume = hasTrendsData ? googleTrendsFetcher.getSearchVolumeScore(trendData) : null;
    const policyInfluence = wikipediaFetcher.getInfluenceScore(wikiData);
    const eventImpact = wikipediaFetcher.getRecencyScore(wikiData);

    console.log(`  Impact components:`);
    console.log(`    Media Coverage: ${mediaCoverage}`);
    console.log(`    Social Reach: ${hasRedditData ? socialReach : 'N/A (excluded)'}`);
    console.log(`    Search Volume: ${hasTrendsData ? searchVolume : 'N/A (excluded)'}`);
    console.log(`    Policy Influence: ${policyInfluence}`);
    console.log(`    Event Impact: ${eventImpact}`);

    // Dynamic weight calculation for impact
    let impactScore;
    const baseWeights = SCORING_WEIGHTS.impact;
    
    if (hasRedditData && hasTrendsData) {
      // All data available
      impactScore = Math.round(
        mediaCoverage * baseWeights.mediaCoverage +
        policyInfluence * baseWeights.policyInfluence +
        socialReach! * baseWeights.socialReach +
        searchVolume! * baseWeights.searchVolume +
        eventImpact * baseWeights.eventImpact
      );
    } else {
      // Redistribute missing weights
      let adjustedWeights = {
        mediaCoverage: baseWeights.mediaCoverage,
        policyInfluence: baseWeights.policyInfluence,
        socialReach: baseWeights.socialReach,
        searchVolume: baseWeights.searchVolume,
        eventImpact: baseWeights.eventImpact
      };
      
      // Redistribute Reddit's 20% to media (12%) and policy (8%)
      if (!hasRedditData) {
        adjustedWeights.mediaCoverage += 0.12;
        adjustedWeights.policyInfluence += 0.08;
        adjustedWeights.socialReach = 0;
      }
      
      // Redistribute Trends' 15% to media (9%) and policy (6%)
      if (!hasTrendsData) {
        adjustedWeights.mediaCoverage += 0.09;
        adjustedWeights.policyInfluence += 0.06;
        adjustedWeights.searchVolume = 0;
      }
      
      impactScore = Math.round(
        mediaCoverage * adjustedWeights.mediaCoverage +
        policyInfluence * adjustedWeights.policyInfluence +
        (socialReach || 0) * adjustedWeights.socialReach +
        (searchVolume || 0) * adjustedWeights.searchVolume +
        eventImpact * adjustedWeights.eventImpact
      );
      console.log(`    ⚠️ Missing data sources - weights redistributed`);
    }
    
    console.log(`    → Impact Score: ${impactScore}`);

    // CONTROVERSY COMPONENTS - use estimated polarization instead of Reddit
    const negativeCoverage = newsAPIFetcher.getNegativeCoverageScore(newsArticles);
    const polarization = this.estimatePolarization(newsArticles); // Use news-based polarization
    const scandalFrequency = this.estimateScandalFrequency(newsArticles);
    const criticismIntensity = this.estimateCriticismIntensity(newsArticles, redditPosts);
    const disputeVolume = this.estimateDisputeVolume(newsArticles);

    console.log(`  Controversy components:`);
    console.log(`    Negative Coverage: ${negativeCoverage}`);
    console.log(`    Polarization: ${polarization} (estimated from news)`);
    console.log(`    Scandal Frequency: ${scandalFrequency}`);
    console.log(`    Criticism Intensity: ${criticismIntensity}`);
    console.log(`    Dispute Volume: ${disputeVolume}`);

    // Use standard weights (no Reddit to exclude)
    const controversyScore = Math.round(
      negativeCoverage * SCORING_WEIGHTS.controversy.negativeCoverage +
      scandalFrequency * SCORING_WEIGHTS.controversy.scandalFrequency +
      polarization * SCORING_WEIGHTS.controversy.polarization +
      criticismIntensity * SCORING_WEIGHTS.controversy.criticismIntensity +
      disputeVolume * SCORING_WEIGHTS.controversy.disputeVolume
    );
    
    console.log(`    → Controversy Score: ${controversyScore}`);
    console.log('');

    return {
      approval: {
        score: approvalScore,
        components: {
          favorability,
          newsSentiment,
          pollingTrends,
          socialSentiment: socialSentiment !== null ? socialSentiment : 0,
        },
      },
      trust: {
        score: trustScore,
        components: {
          institutional,
          factCheck,
          expertEval,
          consistency,
        },
      },
      impact: {
        score: impactScore,
        components: {
          mediaCoverage,
          policyInfluence,
          socialReach: socialReach !== null ? socialReach : 0,
          searchVolume: searchVolume !== null ? searchVolume : 0,
          eventImpact,
        },
      },
      controversy: {
        score: controversyScore,
        components: {
          negativeCoverage,
          scandalFrequency,
          polarization,
          criticismIntensity,
          disputeVolume,
        },
      },
    };
  }

  // Estimation methods for components without direct API access

  private estimatePollingTrends(newsSentiment: number, socialSentiment: number): number {
    // Average of news and social sentiment as proxy
    return Math.round((newsSentiment + socialSentiment) / 2);
  }

  private estimateInstitutionalTrust(wikiData: any, articles: any[]): number {
    if (articles.length === 0) return 35;
    
    // Look for trust-related keywords in coverage
    const trustKeywords = [
      'reliable', 'trustworthy', 'credible', 'honest', 'integrity',
      'transparent', 'accountable', 'dependable', 'authentic', 'legitimate',
      'respectable', 'ethical', 'principled', 'honorable'
    ];
    
    const distrustKeywords = [
      'unreliable', 'untrustworthy', 'dishonest', 'deceptive', 'misleading',
      'corrupt', 'scandal', 'fraud', 'lie', 'lied', 'lying', 'false claims',
      'misinformation', 'disinformation', 'unethical', 'questionable',
      'suspicious', 'dubious', 'shady', 'illegitimate'
    ];
    
    let trustCount = 0;
    let distrustCount = 0;
    let sentimentSum = 0;
    
    articles.forEach(a => {
      const text = `${a.title?.toLowerCase() || ''} ${a.description?.toLowerCase() || ''}`;
      if (trustKeywords.some(kw => text.includes(kw))) trustCount++;
      if (distrustKeywords.some(kw => text.includes(kw))) distrustCount++;
      sentimentSum += (a.sentiment || 0);
    });
    
    // MINIMUM base scores for MAXIMUM room to differentiate  
    const baseScore = wikiData ? 35 : 20;
    
    if (trustCount > 0 || distrustCount > 0) {
      // MAXIMUM POSSIBLE keyword scaling (×700!)
      const trustDiff = trustCount - distrustCount;
      const adjustment = (trustDiff / articles.length) * 700;
      return Math.max(5, Math.min(100, Math.round(baseScore + adjustment)));
    } else {
      // MAXIMUM POSSIBLE sentiment amplification (×1000!)
      const avgSentiment = sentimentSum / articles.length;
      const sentimentAdjustment = avgSentiment * 1000;
      return Math.max(5, Math.min(100, Math.round(baseScore + sentimentAdjustment)));
    }
  }

  private estimateFactCheckScore(articles: any[]): number {
    if (articles.length === 0) return 45;
    
    // Enhanced fact-check keywords
    const truthfulKeywords = [
      'fact-check', 'verified', 'accurate', 'true', 'confirmed', 'validated',
      'evidence-based', 'substantiated', 'factual', 'proven', 'documented'
    ];
    
    const falsehoodKeywords = [
      'false', 'misleading', 'misinformation', 'disinformation', 'debunked',
      'unverified', 'baseless', 'unfounded', 'fabricated', 'fake news',
      'false claim', 'inaccurate', 'disputed', 'questionable claim'
    ];
    
    let truthfulCount = 0;
    let falsehoodCount = 0;
    
    articles.forEach(a => {
      const text = `${a.title?.toLowerCase() || ''} ${a.description?.toLowerCase() || ''}`;
      if (truthfulKeywords.some(kw => text.includes(kw))) truthfulCount++;
      if (falsehoodKeywords.some(kw => text.includes(kw))) falsehoodCount++;
    });
    
    // If no fact-check mentions, use positive vs negative sentiment as proxy
    if (truthfulCount === 0 && falsehoodCount === 0) {
      const positiveSentiment = articles.filter(a => (a.sentiment || 0) > 0.15).length;
      const negativeSentiment = articles.filter(a => (a.sentiment || 0) < -0.15).length;
      const sentimentRatio = (positiveSentiment - negativeSentiment) / articles.length;
      // HARSHER grading (×120 instead of ×60)
      return Math.max(20, Math.min(75, Math.round(45 + (sentimentRatio * 120))));
    }
    
    // EXTREME scaling (×450 instead of ×300)
    const ratio = (truthfulCount - falsehoodCount) / articles.length;
    return Math.max(10, Math.min(98, Math.round(45 + (ratio * 450))));
  }

  private estimateExpertEvaluation(wikiData: any): number {
    // EXTREME range for maximum differentiation
    if (!wikiData) return 10; // Much lower for no Wikipedia

    const categories = wikiData.categories || [];
    
    // High-status indicators
    const prestigeIndicators = [
      'Living people', 'Presidents', 'Prime Ministers', 'heads of state',
      'world leaders', 'Nobel', 'award', 'Fellows', 'Members of',
      'Leaders', 'Politicians', 'Statespeople'
    ];
    
    // Count prestige indicators
    const prestigeCount = categories.filter((cat: string) => 
      prestigeIndicators.some(indicator => 
        cat.toLowerCase().includes(indicator.toLowerCase())
      )
    ).length;
    
    // MUCH WIDER scale: 0 indicators = 25, 1 = 40, 2 = 55, 3 = 70, 4 = 85, 5+ = 95
    const baseScore = 25 + Math.min(70, prestigeCount * 15);
    
    return baseScore;
  }

  private estimateConsistency(articles: any[]): number {
    if (articles.length === 0) return 45;

    // Look for consistency/flip-flop keywords
    const consistencyKeywords = [
      'consistent', 'steadfast', 'principled', 'unwavering', 'reliable',
      'predictable', 'stable', 'steady', 'committed', 'dedicated'
    ];
    
    const inconsistencyKeywords = [
      'flip-flop', 'inconsistent', 'changed position', 'reversed',
      'contradicted', 'contradictory', 'backtrack', 'u-turn',
      'shifted stance', 'changed mind', 'wavering', 'unpredictable'
    ];
    
    let consistentCount = 0;
    let inconsistentCount = 0;
    
    articles.forEach(a => {
      const text = `${a.title?.toLowerCase() || ''} ${a.description?.toLowerCase() || ''}`;
      if (consistencyKeywords.some(kw => text.includes(kw))) consistentCount++;
      if (inconsistencyKeywords.some(kw => text.includes(kw))) inconsistentCount++;
    });
    
    // Also measure sentiment consistency (but give it less weight)
    const sentiments = articles.map(a => a.sentiment || 0);
    const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    const variance = sentiments.reduce((sum, s) => sum + Math.pow(s - avgSentiment, 2), 0) / sentiments.length;
    
    // EXTREME variance penalty (×450 instead of ×300)
    const sentimentConsistency = Math.max(0, 100 - (variance * 450));
    
    // EXTREME keyword scaling (×450 instead of ×300)
    const keywordDiff = consistentCount - inconsistentCount;
    const keywordScore = 40 + (keywordDiff / articles.length) * 450;
    
    // Combine: 80% keywords, 20% sentiment variance
    const combined = (keywordScore * 0.8) + (sentimentConsistency * 0.2);
    
    return Math.max(15, Math.min(100, Math.round(combined)));
  }

  private estimateScandalFrequency(articles: any[]): number {
    if (articles.length === 0) return 0;
    
    const scandalKeywords = [
      'scandal', 'controversy', 'investigation', 'accused', 'allegations', 
      'corrupt', 'fraud', 'impeachment', 'indictment', 'lawsuit', 'probe',
      'criminal', 'unethical', 'misconduct', 'violation', 'breach',
      'embezzlement', 'bribery', 'collusion', 'coverup', 'exposed'
    ];
    
    const scandalArticles = articles.filter(a => {
      const text = `${a.title?.toLowerCase() || ''} ${a.description?.toLowerCase() || ''}`;
      return scandalKeywords.some(keyword => text.includes(keyword));
    });

    // ULTRA-AGGRESSIVE scaling (×700 instead of ×400)
    const percentage = (scandalArticles.length / articles.length);
    return Math.min(100, Math.round(percentage * 700));
  }

  private estimateCriticismIntensity(articles: any[], posts: any[]): number {
    if (articles.length === 0) return 0;
    
    const criticismKeywords = [
      'criticized', 'condemned', 'attacked', 'slammed', 'blasted',
      'denounced', 'rejected', 'opposed', 'protest', 'backlash',
      'outrage', 'anger', 'fury', 'uproar', 'dispute', 'challenge',
      'questioned', 'doubt', 'concern', 'worry', 'fear', 'threat'
    ];
    
    // Count articles with criticism keywords
    const criticismArticles = articles.filter(a => {
      const text = `${a.title?.toLowerCase() || ''} ${a.description?.toLowerCase() || ''}`;
      return criticismKeywords.some(keyword => text.includes(keyword));
    });
    
    // HARSHER negative sentiment threshold (-0.1 instead of -0.15)
    const negativeSentiments = articles.filter(a => (a.sentiment || 0) < -0.1);
    
    // Combine both factors
    const criticismPercentage = criticismArticles.length / articles.length;
    const negativeSentimentPercentage = negativeSentiments.length / articles.length;
    
    const combinedScore = Math.max(criticismPercentage, negativeSentimentPercentage);
    
    // ULTRA-AGGRESSIVE scaling (×600 instead of ×300)
    return Math.min(100, Math.round(combinedScore * 600));
  }

  private estimateDisputeVolume(articles: any[]): number {
    if (articles.length === 0) return 0;
    
    const disputeKeywords = [
      'debate', 'dispute', 'conflict', 'disagreement', 'divided',
      'polarizing', 'controversial', 'contentious', 'divisive',
      'clash', 'battle', 'fight', 'confrontation', 'showdown',
      'tension', 'friction', 'rivalry', 'feud', 'row'
    ];
    
    const disputeArticles = articles.filter(a => {
      const text = `${a.title?.toLowerCase() || ''} ${a.description?.toLowerCase() || ''}`;
      return disputeKeywords.some(keyword => text.includes(keyword));
    });
    
    // Also detect polarization from sentiment variance
    const sentiments = articles.map(a => a.sentiment || 0);
    const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    const variance = sentiments.reduce((sum, s) => sum + Math.pow(s - avgSentiment, 2), 0) / sentiments.length;
    
    // HARSHER variance detection (×250 instead of ×150)
    const polarizationScore = Math.min(60, variance * 250);
    
    // ULTRA-AGGRESSIVE dispute scaling (×450 instead of ×250)
    const disputePercentage = (disputeArticles.length / articles.length) * 450;
    
    return Math.min(100, Math.round(disputePercentage + polarizationScore));
  }

  /**
   * Estimate polarization from news articles (replaces Reddit polarization)
   * Looks at sentiment variance and controversial keywords
   */
  private estimatePolarization(articles: any[]): number {
    if (articles.length === 0) return 0;
    
    // 1. ULTRA-AGGRESSIVE sentiment variance (×350 instead of ×200)
    const sentiments = articles.map(a => a.sentiment || 0);
    const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    const variance = sentiments.reduce((sum, s) => sum + Math.pow(s - avgSentiment, 2), 0) / sentiments.length;
    const varianceScore = Math.min(60, variance * 350);
    
    // 2. ULTRA-AGGRESSIVE polarization keywords (×700 instead of ×400)
    const polarizationKeywords = [
      'polarizing', 'divisive', 'divided', 'controversial', 'contentious',
      'split', 'partisan', 'bipartisan', 'supporters', 'critics',
      'love him', 'hate him', 'both sides', 'opinions divided'
    ];
    
    const polarizingArticles = articles.filter(a => {
      const text = `${a.title?.toLowerCase() || ''} ${a.description?.toLowerCase() || ''}`;
      return polarizationKeywords.some(keyword => text.includes(keyword));
    });
    
    const keywordScore = Math.min(60, (polarizingArticles.length / articles.length) * 700);
    
    return Math.round(varianceScore + keywordScore);
  }

  private calculateSourceConfidence(dataCount: number, expected: number): number {
    return Math.min(100, Math.round((dataCount / expected) * 100));
  }

  private calculateOverallConfidence(sources: DataSource[]): number {
    const totalConfidence = sources.reduce((sum, source) => sum + source.confidence, 0);
    return Math.round(totalConfidence / sources.length);
  }
}

export const scoreCalculator = new ScoreCalculator();
