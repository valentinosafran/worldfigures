declare module 'sentiment' {
  interface AnalysisResult {
    score: number;
    comparative: number;
    calculation: Array<{ [word: string]: number }>;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
  }

  interface SentimentOptions {
    extras?: { [key: string]: number };
  }

  class Sentiment {
    constructor();
    analyze(phrase: string, options?: SentimentOptions): AnalysisResult;
  }

  export = Sentiment;
}
