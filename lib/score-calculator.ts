import { newsAPIFetcher } from './data-fetchers/news-api';
import { redditFetcher } from './data-fetchers/reddit';
import { googleTrendsFetcher } from './data-fetchers/google-trends';
import { wikipediaFetcher } from './data-fetchers/wikipedia';
import { SCORING_WEIGHTS } from './config';
import { ScoreBreakdown, AggregatedData, DataSource } from '../types';

export class ScoreCalculator {
  /**
   * Calculate all scores for a person
   */
  async calculateScores(personName: string, personSlug: string): Promise<AggregatedData> {
    console.log(`Calculating scores for ${personName}...`);

    const startTime = Date.now();

    // Fetch data from all sources in parallel
    const [newsArticles, redditPosts, trendData, wikiPage] = await Promise.all([
      newsAPIFetcher.fetchNews(personName, 30),
      redditFetcher.searchReddit(personName),
      googleTrendsFetcher.getInterestOverTime(personName),
      this.getWikiData(personName),
    ]);

    console.log(`Data fetched in ${Date.now() - startTime}ms`);
    console.log(`- News articles: ${newsArticles.length}`);
    console.log(`- Reddit posts: ${redditPosts.length}`);
    console.log(`- Trend data points: ${trendData.length}`);
    console.log(`- Wikipedia data: ${wikiPage ? 'found' : 'not found'}`);

    // Calculate component scores
    const breakdown = this.calculateBreakdown(newsArticles, redditPosts, trendData, wikiPage);

    // Prepare data sources metadata
    const sources: DataSource[] = [
      {
        type: 'news',
        name: 'NewsAPI',
        data: { articleCount: newsArticles.length },
        timestamp: new Date().toISOString(),
        confidence: this.calculateSourceConfidence(newsArticles.length, 50),
      },
      {
        type: 'social',
        name: 'Reddit',
        data: { postCount: redditPosts.length },
        timestamp: new Date().toISOString(),
        confidence: this.calculateSourceConfidence(redditPosts.length, 30),
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

    const overallConfidence = this.calculateOverallConfidence(sources);

    return {
      personSlug,
      personName,
      sources,
      breakdown,
      confidence: overallConfidence,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get Wikipedia data for a person
   */
  private async getWikiData(personName: string) {
    // Try direct page lookup first
    let wikiData = await wikipediaFetcher.getPageData(personName);
    
    // If not found, try searching
    if (!wikiData) {
      const searchResult = await wikipediaFetcher.searchPage(personName);
      if (searchResult) {
        wikiData = await wikipediaFetcher.getPageData(searchResult);
      }
    }

    return wikiData;
  }

  /**
   * Calculate all score components
   */
  private calculateBreakdown(
    newsArticles: any[],
    redditPosts: any[],
    trendData: any[],
    wikiData: any
  ): ScoreBreakdown {
    // APPROVAL COMPONENTS
    const newsSentiment = newsAPIFetcher.getSentimentScore(newsArticles);
    const socialSentiment = redditFetcher.getSocialSentimentScore(redditPosts);
    const favorability = Math.round((newsSentiment + socialSentiment) / 2);
    const pollingTrends = this.estimatePollingTrends(newsSentiment, socialSentiment);

    const approvalScore = Math.round(
      favorability * SCORING_WEIGHTS.approval.favorability +
      newsSentiment * SCORING_WEIGHTS.approval.newsSentiment +
      pollingTrends * SCORING_WEIGHTS.approval.pollingTrends +
      socialSentiment * SCORING_WEIGHTS.approval.socialSentiment
    );

    // TRUST COMPONENTS
    const institutional = this.estimateInstitutionalTrust(wikiData, newsArticles);
    const factCheck = this.estimateFactCheckScore(newsArticles);
    const expertEval = this.estimateExpertEvaluation(wikiData);
    const consistency = this.estimateConsistency(newsArticles);

    const trustScore = Math.round(
      institutional * SCORING_WEIGHTS.trust.institutional +
      factCheck * SCORING_WEIGHTS.trust.factCheck +
      expertEval * SCORING_WEIGHTS.trust.expertEval +
      consistency * SCORING_WEIGHTS.trust.consistency
    );

    // IMPACT COMPONENTS
    const mediaCoverage = newsAPIFetcher.getCoverageScore(newsArticles);
    const socialReach = redditFetcher.getEngagementScore(redditPosts);
    const searchVolume = googleTrendsFetcher.getSearchVolumeScore(trendData);
    const policyInfluence = wikipediaFetcher.getInfluenceScore(wikiData);
    const eventImpact = wikipediaFetcher.getRecencyScore(wikiData);

    const impactScore = Math.round(
      mediaCoverage * SCORING_WEIGHTS.impact.mediaCoverage +
      policyInfluence * SCORING_WEIGHTS.impact.policyInfluence +
      socialReach * SCORING_WEIGHTS.impact.socialReach +
      searchVolume * SCORING_WEIGHTS.impact.searchVolume +
      eventImpact * SCORING_WEIGHTS.impact.eventImpact
    );

    // CONTROVERSY COMPONENTS
    const negativeCoverage = newsAPIFetcher.getNegativeCoverageScore(newsArticles);
    const polarization = redditFetcher.getPolarizationScore(redditPosts);
    const scandalFrequency = this.estimateScandalFrequency(newsArticles);
    const criticismIntensity = this.estimateCriticismIntensity(newsArticles, redditPosts);
    const disputeVolume = this.estimateDisputeVolume(newsArticles);

    const controversyScore = Math.round(
      negativeCoverage * SCORING_WEIGHTS.controversy.negativeCoverage +
      scandalFrequency * SCORING_WEIGHTS.controversy.scandalFrequency +
      polarization * SCORING_WEIGHTS.controversy.polarization +
      criticismIntensity * SCORING_WEIGHTS.controversy.criticismIntensity +
      disputeVolume * SCORING_WEIGHTS.controversy.disputeVolume
    );

    return {
      approval: {
        score: approvalScore,
        components: {
          favorability,
          newsSentiment,
          pollingTrends,
          socialSentiment,
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
