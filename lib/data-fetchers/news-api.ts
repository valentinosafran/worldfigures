import axios from 'axios';
import Sentiment from 'sentiment';
import { API_CONFIG } from '../config';
import { NewsArticle } from '../../types';

const sentiment = new Sentiment();

export class NewsAPIFetcher {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = API_CONFIG.newsApi.key;
    this.baseUrl = API_CONFIG.newsApi.baseUrl;
  }

  /**
   * Fetch news articles about a person
   */
  async fetchNews(personName: string, daysBack: number = 30): Promise<NewsArticle[]> {
    if (!this.apiKey) {
      console.error('❌ NewsAPI key not configured - set NEWSAPI_KEY environment variable');
      return [];
    }

    console.log(`📰 Fetching news for "${personName}" from NewsAPI...`);

    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - daysBack);

      // Try with quotes for exact match first
      const searchQuery = `"${personName}"`;

      const response = await axios.get(`${this.baseUrl}/everything`, {
        params: {
          q: searchQuery,
          from: fromDate.toISOString().split('T')[0],
          sortBy: 'relevancy',
          pageSize: API_CONFIG.newsApi.maxResults,
          apiKey: this.apiKey,
          language: 'en',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log(`📰 NewsAPI response status: ${response.data.status}`);

      if (response.data.status === 'ok') {
        const articles = response.data.articles.map((article: any) => {
          const sentimentValue = this.analyzeSentiment(
            `${article.title} ${article.description || ''}`
          );
          
          return {
            title: article.title,
            description: article.description || '',
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt,
            sentiment: sentimentValue,
          };
        });
        
        // Log sentiment statistics
        const avgSentiment = articles.reduce((sum: number, a: NewsArticle) => sum + (a.sentiment || 0), 0) / articles.length;
        const positiveCount = articles.filter((a: NewsArticle) => (a.sentiment || 0) > 0.1).length;
        const negativeCount = articles.filter((a: NewsArticle) => (a.sentiment || 0) < -0.1).length;
        const neutralCount = articles.length - positiveCount - negativeCount;
        
        console.log(`✅ NewsAPI: Found ${articles.length} articles for "${searchQuery}"`);
        console.log(`   Sentiment: avg=${avgSentiment.toFixed(3)}, +${positiveCount}/-${negativeCount}/~${neutralCount}`);
        
        return articles;
      }

      console.warn(`⚠️ NewsAPI returned status: ${response.data.status}`);
      return [];
    } catch (error: any) {
      console.error('❌ Error fetching news:', error.message);
      if (error.response) {
        console.error('NewsAPI Error Response:', error.response.data);
      }
      return [];
    }
  }

  /**
   * Analyze sentiment of text with enhanced keyword detection (-1 to 1 scale)
   */
  private analyzeSentiment(text: string): number {
    if (!text) return 0;
    
    const lowerText = text.toLowerCase();
    
    // Strong positive indicators
    const strongPositive = [
      'excellent', 'outstanding', 'exceptional', 'triumph', 'breakthrough',
      'praised', 'celebrated', 'acclaimed', 'victory', 'success', 'achieve',
      'brilliant', 'innovative', 'revolutionary', 'historic', 'landmark'
    ];
    
    // Moderate positive indicators
    const moderatePositive = [
      'good', 'positive', 'improved', 'growth', 'progress', 'gained',
      'support', 'approved', 'welcomed', 'rising', 'boost', 'strengthen'
    ];
    
    // Strong negative indicators
    const strongNegative = [
      'scandal', 'corruption', 'fraud', 'crisis', 'disaster', 'catastrophe',
      'condemned', 'criticized', 'attacked', 'failed', 'collapsed', 'resigned',
      'impeachment', 'investigation', 'accused', 'allegations', 'illegal',
      'controversial', 'outrage', 'backlash', 'protest', 'resign'
    ];
    
    // Moderate negative indicators
    const moderateNegative = [
      'concern', 'worry', 'decline', 'drop', 'fell', 'questioned',
      'doubt', 'uncertain', 'struggle', 'challenge', 'opposition', 'dispute'
    ];
    
    let sentimentScore = 0;
    
    // Count keywords (weighted)
    strongPositive.forEach(word => {
      if (lowerText.includes(word)) sentimentScore += 0.3;
    });
    
    moderatePositive.forEach(word => {
      if (lowerText.includes(word)) sentimentScore += 0.15;
    });
    
    strongNegative.forEach(word => {
      if (lowerText.includes(word)) sentimentScore -= 0.3;
    });
    
    moderateNegative.forEach(word => {
      if (lowerText.includes(word)) sentimentScore -= 0.15;
    });
    
    // Also use the basic sentiment library as a baseline
    const basicResult = sentiment.analyze(text);
    const basicScore = basicResult.comparative * 2; // Amplify the basic score
    
    // Combine keyword-based and library-based scores
    const combinedScore = (sentimentScore * 0.7) + (basicScore * 0.3);
    
    // Normalize to -1 to 1 scale
    return Math.max(-1, Math.min(1, combinedScore));
  }

  /**
   * Calculate average sentiment from articles
   */
  calculateAverageSentiment(articles: NewsArticle[]): number {
    if (articles.length === 0) return 0;

    const total = articles.reduce((sum, article) => sum + (article.sentiment || 0), 0);
    return total / articles.length;
  }

  /**
   * Calculate sentiment score (0-100 scale)
   */
  getSentimentScore(articles: NewsArticle[]): number {
    const avgSentiment = this.calculateAverageSentiment(articles);
    // Convert from -1/1 scale to 0-100 scale
    return Math.round(((avgSentiment + 1) / 2) * 100);
  }

  /**
   * Get coverage volume score (0-100 based on article count)
   */
  getCoverageScore(articles: NewsArticle[], maxExpected: number = 100): number {
    return Math.min(100, Math.round((articles.length / maxExpected) * 100));
  }

  /**
   * Calculate negative coverage percentage
   * Includes both sentiment-based and keyword-based detection
   */
  getNegativeCoverageScore(articles: NewsArticle[]): number {
    if (articles.length === 0) return 0;

    const controversyKeywords = [
      // Legal/Scandal terms
      'scandal', 'controversy', 'criticized', 'backlash', 'outrage',
      'protest', 'investigation', 'accused', 'allegations', 'condemned',
      'crisis', 'failed', 'disaster', 'fraud', 'corruption', 'illegal',
      'impeachment', 'resign', 'attacked', 'disputed', 'conflict',
      // Political controversy
      'lawsuit', 'indictment', 'charges', 'trial', 'criminal', 'probe',
      'scandal-hit', 'embattled', 'under fire', 'facing criticism',
      'controversial statement', 'sparks outrage', 'draws criticism',
      // Opposition/Criticism
      'opponents', 'critics say', 'opposition', 'reject', 'denounce',
      'slam', 'blast', 'hit out', 'lash out', 'rebuke', 'censure'
    ];

    const negativeArticles = articles.filter(a => {
      const sentiment = a.sentiment || 0;
      const text = `${a.title} ${a.description}`.toLowerCase();
      
      // Count if negative sentiment OR contains controversy keywords
      const hasNegativeSentiment = sentiment < -0.05;  // More sensitive threshold
      const hasControversyKeywords = controversyKeywords.some(kw => text.includes(kw));
      
      return hasNegativeSentiment || hasControversyKeywords;
    });

    // Be more aggressive: even 20% negative = high score
    const percentage = negativeArticles.length / articles.length;
    return Math.min(100, Math.round(percentage * 200));
  }
}

export const newsAPIFetcher = new NewsAPIFetcher();
