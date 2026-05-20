import axios from 'axios';
import { API_CONFIG } from '../config';
import { WikipediaData } from '../../types';

export class WikipediaFetcher {
  private baseUrl: string;
  private restApiUrl: string = 'https://en.wikipedia.org/w/rest.php/v1';

  constructor() {
    this.baseUrl = API_CONFIG.wikipedia.baseUrl;
  }

  /**
   * Get Wikipedia page data
   */
  async getPageData(pageName: string): Promise<WikipediaData | null> {
    // Convert underscores to spaces and clean the name
    const cleanName = pageName.replace(/_/g, ' ').trim();
    console.log(`📖 Fetching Wikipedia data for "${cleanName}"...`);
    
    try {
      // Get page extract and info
      const response = await axios.get(this.baseUrl, {
        params: {
          action: 'query',
          format: 'json',
          titles: cleanName,
          prop: 'extracts|categories|revisions',
          exintro: true,
          explaintext: true,
          rvprop: 'timestamp',
          rvlimit: 1,
        },
        timeout: 10000,
      });

      const pages = response.data.query?.pages;
      if (!pages) {
        console.warn('⚠️ Wikipedia: No pages in response');
        return null;
      }

      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (pageId === '-1' || !page) {
        console.warn(`⚠️ Wikipedia: Page not found for "${cleanName}"`);
        return null;
      }

      const categories = page.categories?.map((cat: any) => cat.title.replace('Category:', '')) || [];
      const lastEdited = page.revisions?.[0]?.timestamp || '';

      // Get page view statistics (use cleaned name with spaces)
      const pageViews = await this.getPageViews(cleanName);

      console.log(`✅ Wikipedia: Found page with ${pageViews} views (30 days)`);

      return {
        pageViews,
        extract: page.extract || '',
        categories,
        lastEdited,
      };
    } catch (error: any) {
      console.error('❌ Error fetching Wikipedia data:');
      console.error('  Message:', error.message);
      console.error('  Status:', error.response?.status);
      console.error('  Data:', JSON.stringify(error.response?.data));
      console.error('  URL:', error.config?.url);
      return null;
    }
  }

  /**
   * Get page view statistics (last 30 days)
   */
  async getPageViews(pageName: string): Promise<number> {
    try {
      // Wikipedia pageview API uses underscores in URLs
      const urlSafeName = pageName.replace(/ /g, '_');
      
      const endDate = new Date();
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0].replace(/-/g, '');
      };

      const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${encodeURIComponent(urlSafeName)}/daily/${formatDate(startDate)}/${formatDate(endDate)}`;

      const response = await axios.get(url, { timeout: 10000 });

      if (response.data.items) {
        const totalViews = response.data.items.reduce(
          (sum: number, item: any) => sum + (item.views || 0),
          0
        );
        console.log(`✅ Wikipedia pageviews: ${totalViews} views for "${pageName}"`);
        return totalViews;
      }

      return 0;
    } catch (error: any) {
      console.error('❌ Error fetching Wikipedia page views:', error.message);
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
   * Search for a person's Wikipedia page using REST API
   */
  async searchPage(personName: string): Promise<string | null> {
    // Convert underscores to spaces and clean the name
    const cleanName = personName.replace(/_/g, ' ').trim();
    console.log(`🔍 Searching Wikipedia REST API for "${cleanName}"...`);
    
    try {
      const response = await axios.get(`${this.restApiUrl}/search/page`, {
        params: {
          q: cleanName,
          limit: 5,
        },
        headers: {
          'Api-User-Agent': 'WorldFigures/1.0 (https://worldfigures.com)',
        },
        timeout: 10000,
      });

      const pages = response.data.pages;
      if (pages && pages.length > 0) {
        console.log(`✅ Wikipedia REST search: Found ${pages.length} results`);
        pages.forEach((page: any, i: number) => {
          console.log(`  ${i + 1}. "${page.title}" (key: ${page.key})`);
        });
        
        // Return the top result's title
        return pages[0].title;
      }

      console.warn(`⚠️ Wikipedia search: No results for "${cleanName}"`);
      return null;
    } catch (error: any) {
      console.error('❌ Error searching Wikipedia:');
      console.error('  Message:', error.message);
      console.error('  Status:', error.response?.status);
      console.error('  Data:', JSON.stringify(error.response?.data));
      console.error('  URL:', error.config?.url);
      return null;
    }
  }

}

export const wikipediaFetcher = new WikipediaFetcher();
