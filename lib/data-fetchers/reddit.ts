import axios from 'axios';
import Sentiment from 'sentiment';
import { API_CONFIG } from '../config';
import { RedditPost } from '../../types';

const sentiment = new Sentiment();

export class RedditFetcher {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Get Reddit access token
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const { clientId, clientSecret, userAgent } = API_CONFIG.reddit;

    if (!clientId || !clientSecret) {
      console.warn('Reddit API credentials not configured');
      return '';
    }

    try {
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      
      const response = await axios.post(
        'https://www.reddit.com/api/v1/access_token',
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': userAgent,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      return this.accessToken || '';
    } catch (error) {
      console.error('Error getting Reddit token:', error);
      return '';
    }
  }

  /**
   * Search Reddit for mentions of a person
   */
  async searchReddit(
    personName: string,
    subreddits: string[] = ['worldnews', 'news', 'politics'],
    limit: number = 100
  ): Promise<RedditPost[]> {
    const token = await this.getAccessToken();
    if (!token) return [];

    const allPosts: RedditPost[] = [];

    try {
      for (const subreddit of subreddits) {
        const response = await axios.get(
          `${API_CONFIG.reddit.baseUrl}/r/${subreddit}/search.json`,
          {
            params: {
              q: personName,
              limit: Math.min(limit, 100),
              sort: 'relevance',
              t: 'month',
            },
            headers: {
              Authorization: `Bearer ${token}`,
              'User-Agent': API_CONFIG.reddit.userAgent,
            },
          }
        );

        if (response.data.data && response.data.data.children) {
          const posts = response.data.data.children.map((child: any) => {
            const post = child.data;
            return {
              title: post.title,
              score: post.score,
              subreddit: post.subreddit,
              url: `https://reddit.com${post.permalink}`,
              created: post.created_utc,
              numComments: post.num_comments,
              sentiment: this.analyzeSentiment(post.title),
            };
          });

          allPosts.push(...posts);
        }
      }

      return allPosts;
    } catch (error) {
      console.error('Error searching Reddit:', error);
      return [];
    }
  }

  /**
   * Analyze sentiment of text
   */
  private analyzeSentiment(text: string): number {
    if (!text) return 0;
    
    const result = sentiment.analyze(text);
    const score = result.comparative;
    return Math.max(-1, Math.min(1, score));
  }

  /**
   * Calculate social sentiment score (0-100)
   */
  getSocialSentimentScore(posts: RedditPost[]): number {
    if (posts.length === 0) return 50; // Neutral default

    const avgSentiment = posts.reduce((sum, post) => sum + (post.sentiment || 0), 0) / posts.length;
    return Math.round(((avgSentiment + 1) / 2) * 100);
  }

  /**
   * Calculate engagement score based on upvotes and comments
   */
  getEngagementScore(posts: RedditPost[]): number {
    if (posts.length === 0) return 0;

    const totalEngagement = posts.reduce(
      (sum, post) => sum + post.score + (post.numComments * 2),
      0
    );

    // Normalize to 0-100 scale (assume 10000 total engagement is excellent)
    return Math.min(100, Math.round((totalEngagement / 10000) * 100));
  }

  /**
   * Calculate polarization score (higher = more divided opinion)
   */
  getPolarizationScore(posts: RedditPost[]): number {
    if (posts.length === 0) return 0;

    const sentiments = posts.map(p => p.sentiment || 0);
    const variance = this.calculateVariance(sentiments);
    
    // Higher variance = more polarization
    return Math.min(100, Math.round(variance * 100));
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }
}

export const redditFetcher = new RedditFetcher();
