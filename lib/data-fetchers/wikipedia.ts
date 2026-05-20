import axios from 'axios';
import { API_CONFIG } from '../config';
import { WikipediaData } from '../../types';

export class WikipediaFetcher {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.wikipedia.baseUrl;
  }

  /**
   * Get Wikipedia page data
   */
  async getPageData(pageName: string): Promise<WikipediaData | null> {
    try {
      // Get page extract and info
      const response = await axios.get(this.baseUrl, {
        params: {
          action: 'query',
          format: 'json',
          titles: pageName,
          prop: 'extracts|categories|revisions',
          exintro: true,
          explaintext: true,
          rvprop: 'timestamp',
          rvlimit: 1,
        },
      });

      const pages = response.data.query?.pages;
      if (!pages) return null;

      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (pageId === '-1' || !page) return null;

      const categories = page.categories?.map((cat: any) => cat.title.replace('Category:', '')) || [];
      const lastEdited = page.revisions?.[0]?.timestamp || '';

      // Get page view statistics
      const pageViews = await this.getPageViews(pageName);

      return {
        pageViews,
        extract: page.extract || '',
        categories,
        lastEdited,
      };
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
      return null;
    }
  }

  /**
   * Get page view statistics (last 30 days)
   */
  async getPageViews(pageName: string): Promise<number> {
    try {
      const endDate = new Date();
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0].replace(/-/g, '');
      };

      const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${encodeURIComponent(pageName)}/daily/${formatDate(startDate)}/${formatDate(endDate)}`;

      const response = await axios.get(url);

      if (response.data.items) {
        const totalViews = response.data.items.reduce(
          (sum: number, item: any) => sum + (item.views || 0),
          0
        );
        return totalViews;
      }

      return 0;
    } catch (error) {
      console.error('Error fetching page views:', error);
      return 0;
    }
  }

  /**
   * Calculate influence score based on Wikipedia metrics (0-100)
   */
  getInfluenceScore(data: WikipediaData | null): number {
    if (!data) return 0;

    // Score based on page views (normalize to 0-100)
    // Assume 100,000 views per month is high influence
    const viewScore = Math.min(100, (data.pageViews / 100000) * 100);

    // Score based on article length
    const lengthScore = Math.min(100, (data.extract.length / 5000) * 100);

    // Score based on categories (more categories = more notable)
    const categoryScore = Math.min(100, data.categories.length * 5);

    // Weighted average
    return Math.round(viewScore * 0.5 + lengthScore * 0.3 + categoryScore * 0.2);
  }

  /**
   * Calculate recency score (how recently edited)
   */
  getRecencyScore(data: WikipediaData | null): number {
    if (!data || !data.lastEdited) return 0;

    const lastEdit = new Date(data.lastEdited);
    const daysSinceEdit = (Date.now() - lastEdit.getTime()) / (1000 * 60 * 60 * 24);

    // Score decreases with time
    // Edited today = 100, edited 30 days ago = 50, edited 180+ days ago = 0
    if (daysSinceEdit <= 1) return 100;
    if (daysSinceEdit <= 7) return 90;
    if (daysSinceEdit <= 30) return 75;
    if (daysSinceEdit <= 90) return 50;
    if (daysSinceEdit <= 180) return 25;
    return 10;
  }

  /**
   * Search for a person's Wikipedia page
   */
  async searchPage(personName: string): Promise<string | null> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          action: 'query',
          format: 'json',
          list: 'search',
          srsearch: personName,
          srlimit: 1,
        },
      });

      const results = response.data.query?.search;
      if (results && results.length > 0) {
        return results[0].title;
      }

      return null;
    } catch (error) {
      console.error('Error searching Wikipedia:', error);
      return null;
    }
  }
}

export const wikipediaFetcher = new WikipediaFetcher();
