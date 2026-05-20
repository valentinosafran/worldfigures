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
        headers: {
          'User-Agent': 'WorldFigures/1.0 (https://worldfigures.com)',
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
   * Batch fetch Wikipedia data for multiple people at once
   * Uses Wikipedia's batch API to reduce number of requests
   */
  async batchGetPageData(pageNames: string[]): Promise<Map<string, WikipediaData | null>> {
    const results = new Map<string, WikipediaData | null>();
    
    if (pageNames.length === 0) return results;

    console.log(`📖 Batch fetching Wikipedia data for ${pageNames.length} people...`);
    
    try {
      // Wikipedia API can handle multiple titles separated by |
      // Split into chunks of 50 (API limit)
      const chunkSize = 50;
      const chunks: string[][] = [];
      for (let i = 0; i < pageNames.length; i += chunkSize) {
        chunks.push(pageNames.slice(i, i + chunkSize));
      }

      for (const chunk of chunks) {
        const cleanNames = chunk.map(name => name.replace(/_/g, ' ').trim());
        const titlesParam = cleanNames.join('|');

        const response = await axios.get(this.baseUrl, {
          params: {
            action: 'query',
            format: 'json',
            titles: titlesParam,
            prop: 'extracts|categories|revisions',
            exintro: true,
            explaintext: true,
            rvprop: 'timestamp',
            rvlimit: 1,
          },
          headers: {
            'User-Agent': 'WorldFigures/1.0 (https://worldfigures.com)',
          },
          timeout: 15000,
        });

        const pages = response.data.query?.pages;
        if (!pages) continue;

        // Process each page in the batch response
        for (const pageId of Object.keys(pages)) {
          const page = pages[pageId];
          
          if (pageId === '-1' || !page || !page.title) continue;

          const categories = page.categories?.map((cat: any) => cat.title.replace('Category:', '')) || [];
          const lastEdited = page.revisions?.[0]?.timestamp || '';

          // Store temporarily without pageviews
          results.set(page.title, {
            pageViews: 0, // Will be fetched in bulk
            extract: page.extract || '',
            categories,
            lastEdited,
          });
        }
      }

      // Batch fetch page views (this is slower, but necessary)
      // We'll fetch them in parallel with limited concurrency
      const viewsPromises = Array.from(results.keys()).map(async (pageName) => {
        const views = await this.getPageViews(pageName);
        const existingData = results.get(pageName);
        if (existingData) {
          results.set(pageName, { ...existingData, pageViews: views });
        }
      });

      // Process pageviews in batches of 5 to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < viewsPromises.length; i += batchSize) {
        await Promise.all(viewsPromises.slice(i, i + batchSize));
        if (i + batchSize < viewsPromises.length) {
          await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between batches
        }
      }

      console.log(`✅ Wikipedia batch: Retrieved data for ${results.size} pages`);
      return results;
    } catch (error: any) {
      console.error('❌ Error in batch Wikipedia fetch:', error.message);
      return results;
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

      const response = await axios.get(url, { 
        headers: {
          'User-Agent': 'WorldFigures/1.0 (https://worldfigures.com)',
        },
        timeout: 10000 
      });

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
   * Heavily weighted towards page views for better differentiation
   */
  getInfluenceScore(data: WikipediaData | null): number {
    if (!data) return 0;

    // Score based on page views (normalize to 0-100)
    // Adjusted thresholds for better distribution:
    // 50k views = 50, 200k = 100
    const viewScore = Math.min(100, (data.pageViews / 200000) * 100);

    // Score based on article length
    const lengthScore = Math.min(100, (data.extract.length / 5000) * 100);

    // Score based on categories (more categories = more notable)
    const categoryScore = Math.min(100, data.categories.length * 5);

    // Heavily weighted towards page views (70% instead of 50%)
    return Math.round(viewScore * 0.7 + lengthScore * 0.2 + categoryScore * 0.1);
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
   * Generate name variations to try for search
   */
  private generateNameVariations(personName: string): string[] {
    const variations: string[] = [personName]; // Start with full name
    
    const parts = personName.split(' ').filter(p => p.length > 0);
    
    if (parts.length >= 2) {
      // Try last name only
      variations.push(parts[parts.length - 1]);
      
      // Try first + last (skip middle names)
      if (parts.length >= 3) {
        variations.push(`${parts[0]} ${parts[parts.length - 1]}`);
      }
      
      // Try removing common prefixes/suffixes
      const cleaned = personName
        .replace(/\b(Jr\.|Sr\.|III|II|Dr\.|President|Prime Minister|Chancellor)\b/gi, '')
        .trim();
      if (cleaned !== personName) {
        variations.push(cleaned);
      }
    }
    
    return [...new Set(variations)]; // Remove duplicates
  }

  /**
   * Verify if a Wikipedia page is about the right person
   */
  private verifyPersonMatch(page: any, searchName: string): boolean {
    const title = page.title?.toLowerCase() || '';
    const excerpt = page.excerpt?.toLowerCase() || '';
    const description = page.description?.toLowerCase() || '';
    
    // Check if title contains the search name or vice versa
    const nameParts = searchName.toLowerCase().split(' ');
    const hasNamePart = nameParts.some(part => 
      part.length > 2 && (title.includes(part) || excerpt.includes(part) || description.includes(part))
    );
    
    return hasNamePart;
  }

  /**
   * Search for a person's Wikipedia page using REST API with fallback variations
   */
  async searchPage(personName: string): Promise<string | null> {
    // Convert underscores to spaces and clean the name
    const cleanName = personName.replace(/_/g, ' ').trim();
    const variations = this.generateNameVariations(cleanName);
    
    console.log(`🔍 Searching Wikipedia for "${cleanName}"...`);
    console.log(`   Trying variations: ${variations.join(', ')}`);
    
    // Try each variation
    for (const variation of variations) {
      try {
        const response = await axios.get(`${this.restApiUrl}/search/page`, {
          params: {
            q: variation,
            limit: 10, // Get more results to find best match
          },
          headers: {
            'User-Agent': 'WorldFigures/1.0 (https://worldfigures.com)',
            'Api-User-Agent': 'WorldFigures/1.0 (https://worldfigures.com)',
          },
          timeout: 10000,
        });

        const pages = response.data.pages;
        if (pages && pages.length > 0) {
          console.log(`✅ Wikipedia search for "${variation}": Found ${pages.length} results`);
          
          // Find the best match
          for (const page of pages) {
            console.log(`   - "${page.title}" (${page.description || 'no description'})`);
            
            // Check if this is likely the right person
            if (this.verifyPersonMatch(page, cleanName)) {
              console.log(`   ✓ Selected: "${page.title}"`);
              return page.title;
            }
          }
          
          // If no verified match, use first result from exact name search
          if (variation === cleanName && pages.length > 0) {
            console.log(`   ⚠ Using top result: "${pages[0].title}"`);
            return pages[0].title;
          }
        }
      } catch (error: any) {
        console.error(`❌ Error searching for "${variation}":`, error.message);
        continue; // Try next variation
      }
    }

    console.warn(`⚠️ Wikipedia: No results found for any variation of "${cleanName}"`);
    return null;
  }

}

export const wikipediaFetcher = new WikipediaFetcher();
