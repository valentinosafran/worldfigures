import googleTrends from 'google-trends-api';
import { TrendData } from '../../types';

export class GoogleTrendsFetcher {
  /**
   * Generate keyword variations for better search results
   */
  private generateKeywordVariations(keyword: string): string[] {
    const variations: string[] = [keyword];
    
    // Try with quotes for exact match
    variations.push(`"${keyword}"`);
    
    // Try without special characters
    const cleaned = keyword.replace(/[^\w\s]/g, '');
    if (cleaned !== keyword) {
      variations.push(cleaned);
    }
    
    return [...new Set(variations)];
  }

  /**
   * Get interest over time for a person with fallback variations
   */
  async getInterestOverTime(
    keyword: string,
    startTime: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ): Promise<TrendData[]> {
    console.log(`📊 Fetching Google Trends for "${keyword}"...`);
    
    const variations = this.generateKeywordVariations(keyword);
    const geoOptions = ['', 'US', 'GB']; // Try worldwide first, then US, then UK
    
    // Try each variation with different geo settings
    for (const variation of variations) {
      for (const geo of geoOptions) {
        try {
          const geoLabel = geo ? ` (${geo})` : ' (worldwide)';
          console.log(`   Trying: "${variation}"${geoLabel}`);
          
          const options: any = {
            keyword: variation,
            startTime,
            granularTimeResolution: true,
          };
          
          if (geo) {
            options.geo = geo;
          }
          
          const result = await googleTrends.interestOverTime(options);
          const data = JSON.parse(result);
          
          if (data.default && data.default.timelineData && data.default.timelineData.length > 0) {
            const trendData = data.default.timelineData.map((item: any) => ({
              keyword: variation,
              interest: item.value[0],
              timeRange: item.formattedTime,
            }));
            
            const avgInterest = trendData.reduce((sum: number, item: TrendData) => sum + item.interest, 0) / trendData.length;
            
            // Only use results with meaningful data (avg interest > 0)
            if (avgInterest > 0) {
              console.log(`✅ Google Trends: Found ${trendData.length} data points for "${variation}"${geoLabel} (avg: ${avgInterest.toFixed(1)})`);
              return trendData;
            } else {
              console.log(`   ⚠ Data found but avg interest is 0`);
            }
          } else {
            console.log(`   ⚠ No data for "${variation}"${geoLabel}`);
          }
        } catch (error: any) {
          console.error(`   ❌ Error for "${variation}":`, error.message);
          continue; // Try next variation/geo
        }
      }
    }

    console.warn(`⚠️ Google Trends: No data found for any variation of "${keyword}"`);
    return [];
  }

  /**
   * Get related queries for a person
   */
  async getRelatedQueries(keyword: string): Promise<string[]> {
    try {
      const result = await googleTrends.relatedQueries({ keyword });
      const data = JSON.parse(result);

      const queries: string[] = [];

      if (data.default && data.default.rankedList) {
        data.default.rankedList.forEach((list: any) => {
          if (list.rankedKeyword) {
            queries.push(...list.rankedKeyword.map((item: any) => item.query));
          }
        });
      }

      return queries;
    } catch (error) {
      console.error('Error fetching related queries:', error);
      return [];
    }
  }

  /**
   * Calculate search volume score (0-100)
   */
  getSearchVolumeScore(trendData: TrendData[]): number {
    if (trendData.length === 0) return 0;

    const avgInterest = trendData.reduce((sum, item) => sum + item.interest, 0) / trendData.length;
    return Math.round(avgInterest); // Google Trends already uses 0-100 scale
  }

  /**
   * Calculate trend direction (positive/negative change)
   */
  getTrendDirection(trendData: TrendData[]): number {
    if (trendData.length < 2) return 0;

    const recentData = trendData.slice(-7); // Last 7 data points
    const earlierData = trendData.slice(-14, -7); // Previous 7 data points

    if (earlierData.length === 0) return 0;

    const recentAvg = recentData.reduce((sum, item) => sum + item.interest, 0) / recentData.length;
    const earlierAvg = earlierData.reduce((sum, item) => sum + item.interest, 0) / earlierData.length;

    return recentAvg - earlierAvg;
  }

  /**
   * Get impact score based on search interest
   */
  getImpactScore(trendData: TrendData[]): number {
    const searchVolume = this.getSearchVolumeScore(trendData);
    const trend = this.getTrendDirection(trendData);
    
    // Combine current volume with trend
    return Math.min(100, Math.max(0, Math.round(searchVolume + (trend * 0.5))));
  }
}

export const googleTrendsFetcher = new GoogleTrendsFetcher();
