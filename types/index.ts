export type PersonProfile = {
  slug: string;
  name: string;
  role: string;
  label: string;
  image: string;
  region: string;
  summary: string;
  lastUpdated: string;
  sourceConfidence: number;
  trend7d: number;
  trend30d: number;
  keyTopics: string[];
  strengths: string[];
  risks: string[];
  trendNotes: string[];
  scores: {
    approval: number;
    trust: number;
    impact: number;
    controversy: number;
  };
};

export type ScoreBreakdown = {
  approval: {
    score: number;
    components: {
      favorability: number;
      newsSentiment: number;
      pollingTrends: number;
      socialSentiment: number;
    };
  };
  trust: {
    score: number;
    components: {
      institutional: number;
      factCheck: number;
      expertEval: number;
      consistency: number;
    };
  };
  impact: {
    score: number;
    components: {
      mediaCoverage: number;
      policyInfluence: number;
      socialReach: number;
      searchVolume: number;
      eventImpact: number;
    };
  };
  controversy: {
    score: number;
    components: {
      negativeCoverage: number;
      scandalFrequency: number;
      polarization: number;
      criticismIntensity: number;
      disputeVolume: number;
    };
  };
};

export type DataSource = {
  type: 'news' | 'social' | 'polling' | 'trends' | 'wikipedia';
  name: string;
  data: any;
  timestamp: string;
  confidence: number;
};

export type NewsArticle = {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: number;
};

export type TrendData = {
  keyword: string;
  interest: number;
  timeRange: string;
};

export type RedditPost = {
  title: string;
  score: number;
  subreddit: string;
  url: string;
  created: number;
  numComments: number;
  sentiment?: number;
};

export type WikipediaData = {
  pageViews: number;
  extract: string;
  categories: string[];
  lastEdited: string;
};

export type AggregatedData = {
  personSlug: string;
  personName: string;
  sources: DataSource[];
  breakdown: ScoreBreakdown;
  confidence: number;
  lastUpdated: string;
};
