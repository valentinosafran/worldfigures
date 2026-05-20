declare module 'google-trends-api' {
  interface InterestOverTimeOptions {
    keyword: string | string[];
    startTime?: Date;
    endTime?: Date;
    geo?: string;
    hl?: string;
    timezone?: number;
    category?: number;
    granularTimeResolution?: boolean;
  }

  interface RelatedQueriesOptions {
    keyword: string | string[];
    startTime?: Date;
    endTime?: Date;
    geo?: string;
    hl?: string;
    timezone?: number;
    category?: number;
  }

  export function interestOverTime(options: InterestOverTimeOptions): Promise<string>;
  export function relatedQueries(options: RelatedQueriesOptions): Promise<string>;
  export function interestByRegion(options: any): Promise<string>;
  export function realTimeTrends(options: any): Promise<string>;
  export function dailyTrends(options: any): Promise<string>;
}
