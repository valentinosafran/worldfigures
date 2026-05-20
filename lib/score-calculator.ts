import { newsAPIFetcher } from './data-fetchers/news-api';
import { redditFetcher } from './data-fetchers/reddit';
import { googleTrendsFetcher } from './data-fetchers/google-trends';
import { wikipediaFetcher } from './data-fetchers/wikipedia';
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

    return {
      personSlug,
      personName,
      sources: activeSources,
      breakdown,
      confidence: overallConfidence,
      lastUpdated: new Date().toISOString(),
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

    // CONTROVERSY COMPONENTS - exclude Reddit if no data
    const negativeCoverage = newsAPIFetcher.getNegativeCoverageScore(newsArticles);
    const polarization = hasRedditData ? redditFetcher.getPolarizationScore(redditPosts) : null;
    const scandalFrequency = this.estimateScandalFrequency(newsArticles);
    const criticismIntensity = this.estimateCriticismIntensity(newsArticles, redditPosts);
    const disputeVolume = this.estimateDisputeVolume(newsArticles);

    console.log(`  Controversy components:`);
    console.log(`    Negative Coverage: ${negativeCoverage}`);
    console.log(`    Polarization: ${hasRedditData ? polarization : 'N/A (excluded)'}`);
    console.log(`    Scandal Frequency: ${scandalFrequency}`);
    console.log(`    Criticism Intensity: ${criticismIntensity}`);
    console.log(`    Dispute Volume: ${disputeVolume}`);

    // Dynamic weight calculation for controversy
    let controversyScore;
    if (hasRedditData) {
      controversyScore = Math.round(
        negativeCoverage * SCORING_WEIGHTS.controversy.negativeCoverage +
        scandalFrequency * SCORING_WEIGHTS.controversy.scandalFrequency +
        polarization! * SCORING_WEIGHTS.controversy.polarization +
        criticismIntensity * SCORING_WEIGHTS.controversy.criticismIntensity +
        disputeVolume * SCORING_WEIGHTS.controversy.disputeVolume
      );
    } else {
      // Redistribute polarization's 25% to negative coverage (15%) and scandal (10%)
      const adjustedWeights = {
        negativeCoverage: 0.45,  // 30% + 15%
        scandalFrequency: 0.35,  // 25% + 10%
        criticismIntensity: 0.15,
        disputeVolume: 0.05
      };
      controversyScore = Math.round(
        negativeCoverage * adjustedWeights.negativeCoverage +
        scandalFrequency * adjustedWeights.scandalFrequency +
        criticismIntensity * adjustedWeights.criticismIntensity +
        disputeVolume * adjustedWeights.disputeVolume
      );
      console.log(`    ⚠️ Reddit data missing - weights adjusted`);
    }
    
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
          polarization: polarization !== null ? polarization : 0,
          criticismIntensity,
          disputeVolume,
        },
      },
          socialReach,
          searchVolume,
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
    // Base on Wikipedia presence and neutral article count
    const wikiScore = wikiData ? 60 : 30;
    const neutralArticles = articles.filter(a => Math.abs(a.sentiment || 0) < 0.3).length;
    const neutralScore = Math.min(40, (neutralArticles / articles.length) * 100);
    return Math.round(wikiScore * 0.6 + neutralScore * 0.4);
  }

  private estimateFactCheckScore(articles: any[]): number {
    // Look for fact-check related keywords in articles
    const factCheckKeywords = ['fact-check', 'verified', 'accurate', 'false', 'misleading'];
    const factCheckArticles = articles.filter(a => 
      factCheckKeywords.some(keyword => 
        (a.title?.toLowerCase() || '').includes(keyword) ||
        (a.description?.toLowerCase() || '').includes(keyword)
      )
    );

    // If there are fact-check articles, analyze their sentiment
    if (factCheckArticles.length > 0) {
      const avgSentiment = factCheckArticles.reduce((sum, a) => sum + (a.sentiment || 0), 0) / factCheckArticles.length;
      return Math.round(((avgSentiment + 1) / 2) * 100);
    }

    // Default to neutral if no fact-check data
    return 50;
  }

  private estimateExpertEvaluation(wikiData: any): number {
    // Base on Wikipedia article quality indicators
    if (!wikiData) return 40;

    const categories = wikiData.categories || [];
    const hasQualityIndicators = categories.some((cat: string) => 
      cat.includes('Living people') || 
      cat.includes('Politicians') ||
      cat.includes('leaders')
    );

    return hasQualityIndicators ? 65 : 50;
  }

  private estimateConsistency(articles: any[]): number {
    if (articles.length === 0) return 50;

    // Measure sentiment consistency
    const sentiments = articles.map(a => a.sentiment || 0);
    const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    
    // Calculate how consistent sentiments are (low variance = high consistency)
    const variance = sentiments.reduce((sum, s) => sum + Math.pow(s - avgSentiment, 2), 0) / sentiments.length;
    
    // Low variance (< 0.2) = high consistency
    const consistencyScore = Math.max(0, 100 - (variance * 250));
    return Math.round(consistencyScore);
  }

  private estimateScandalFrequency(articles: any[]): number {
    const scandalKeywords = ['scandal', 'controversy', 'investigation', 'accused', 'allegations', 'corrupt'];
    
    const scandalArticles = articles.filter(a =>
      scandalKeywords.some(keyword =>
        (a.title?.toLowerCase() || '').includes(keyword) ||
        (a.description?.toLowerCase() || '').includes(keyword)
      )
    );

    return Math.min(100, Math.round((scandalArticles.length / Math.max(1, articles.length)) * 200));
  }

  private estimateCriticismIntensity(articles: any[], posts: any[]): number {
    const negativeSentiments = [
      ...articles.map(a => a.sentiment || 0),
      ...posts.map(p => p.sentiment || 0)
    ].filter(s => s < -0.3);

    const avgNegativeSentiment = negativeSentiments.length > 0
      ? negativeSentiments.reduce((a, b) => a + b, 0) / negativeSentiments.length
      : 0;

    // Convert from -1 scale to 0-100 (more negative = higher score)
    return Math.round(Math.abs(avgNegativeSentiment) * 100);
  }

  private estimateDisputeVolume(articles: any[]): number {
    const disputeKeywords = ['debate', 'dispute', 'conflict', 'disagreement', 'divided'];
    
    const disputeArticles = articles.filter(a =>
      disputeKeywords.some(keyword =>
        (a.title?.toLowerCase() || '').includes(keyword) ||
        (a.description?.toLowerCase() || '').includes(keyword)
      )
    );

    return Math.min(100, Math.round((disputeArticles.length / Math.max(1, articles.length)) * 150));
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
