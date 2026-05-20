// Environment variables configuration
// Create a .env.local file with these keys:
// NEWSAPI_KEY=your_key_here (get free at https://newsapi.org)
// REDDIT_CLIENT_ID=your_id
// REDDIT_CLIENT_SECRET=your_secret

export const API_CONFIG = {
  newsApi: {
    baseUrl: 'https://newsapi.org/v2',
    key: process.env.NEWSAPI_KEY || '',
    maxResults: 100,
  },
  reddit: {
    baseUrl: 'https://www.reddit.com',
    clientId: process.env.REDDIT_CLIENT_ID || '',
    clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
    userAgent: 'WorldFigures/1.0',
  },
  wikipedia: {
    baseUrl: 'https://en.wikipedia.org/w/api.php',
  },
  gdelt: {
    baseUrl: 'https://api.gdeltproject.org/api/v2',
  },
};

export const CACHE_DURATION = {
  news: 24 * 60 * 60 * 1000, // 24 hours
  social: 7 * 24 * 60 * 60 * 1000, // 7 days
  trends: 24 * 60 * 60 * 1000, // 24 hours
  wikipedia: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const SCORING_WEIGHTS = {
  approval: {
    favorability: 0.4,
    newsSentiment: 0.3,
    pollingTrends: 0.2,
    socialSentiment: 0.1,
  },
  trust: {
    institutional: 0.35,
    factCheck: 0.25,
    expertEval: 0.25,
    consistency: 0.15,
  },
  impact: {
    mediaCoverage: 0.35,
    policyInfluence: 0.25,
    socialReach: 0.2,
    searchVolume: 0.15,
    eventImpact: 0.05,
  },
  controversy: {
    negativeCoverage: 0.3,
    scandalFrequency: 0.25,
    polarization: 0.25,
    criticismIntensity: 0.15,
    disputeVolume: 0.05,
  },
};
