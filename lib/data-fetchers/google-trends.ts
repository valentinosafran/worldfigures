import googleTrends from 'google-trends-api';
import { TrendData } from '../../types';

export class GoogleTrendsFetcher {
  /**
   * Get interest over time for a person
   */
  async getInterestOverTime(
    keyword: string,
    startTime: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ): Promise<TrendData[]> {
    try {
      const result = await googleTrends.interestOverTime({
        keyword,
        startTime,
        granularTimeResolution: true,
      });

      const data = JSON.parse(result);
      
      if (data.default && data.default.timelineData) {
        return data.default.timelineData.map((item: any) => ({
          keyword,
          interest: item.value[0],
          timeRange: item.formattedTime,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching Google Trends:', error);
      return [];
    }
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
