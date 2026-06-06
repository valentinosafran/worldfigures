import axios from 'axios';
import * as cheerio from 'cheerio';
import Sentiment from 'sentiment';
import { NewsArticle } from '../../types';
import { newsAPIFetcher } from './news-api';
import { API_CONFIG } from '../config';

const sentiment = new Sentiment();

const USER_AGENT = 'WorldFiguresCrawler/1.0 (+https://worldfigures.com)';

interface RobotsRuleSet {
  allowAll: boolean;
  disallow: string[];
}

interface FeedTarget {
  name: string;
  url: string;
  credibility: number;
  category: 'polling' | 'fact-check' | 'major-media' | 'regional-media' | 'other';
}

export class NewsCrawlerFetcher {
  private robotsCache = new Map<string, RobotsRuleSet>();
  private lastHostRequestMs = new Map<string, number>();

  /**
   * Fetch person news from crawlable RSS sources first, then NewsAPI fallback.
   */
  async fetchNews(personName: string, daysBack: number = 30): Promise<NewsArticle[]> {
    console.log(`🕷️ Crawling news for "${personName}"...`);

    const feeds = this.buildFeedUrls(personName);
    const crawled: NewsArticle[] = [];

    for (const feed of feeds) {
      try {
        const canFetch = await this.isAllowedByRobots(feed.url);
        if (!canFetch) {
          console.warn(`⚠️ Skipping ${feed.name} due to robots policy`);
          continue;
        }

        const response = await this.getWithRetry(feed.url, API_CONFIG.crawler.requestTimeoutMs);
        const parsed = this.parseRss(response.data, feed, daysBack);
        crawled.push(...parsed);
      } catch (error: any) {
        console.warn(`⚠️ Crawl failed for ${feed.name}: ${error.message}`);
      }
    }

    const deduped = this.dedupeArticles(crawled).slice(0, API_CONFIG.crawler.maxArticlesPerPerson);

    if (deduped.length > 0) {
      console.log(`✅ Crawl success: ${deduped.length} articles for "${personName}"`);
      return deduped;
    }

    console.warn(`⚠️ No crawl results for "${personName}", falling back to NewsAPI`);
    const fallbackArticles = await newsAPIFetcher.fetchNews(personName, daysBack);
    return fallbackArticles.map((article) => {
      const sourceDomain = this.getSourceFromUrl(article.url);
      return {
        ...article,
        sourceDomain: sourceDomain || undefined,
        sourceCategory: this.getSourceCategory(article.source, article.url, 'other'),
        credibility: article.credibility || this.getCredibilityScore(article.source, article.url, 0.8),
      };
    });
  }

  /**
   * Batch crawl news for multiple people with small delays to reduce host pressure.
   */
  async batchFetchNews(personNames: string[]): Promise<Map<string, NewsArticle[]>> {
    const results = new Map<string, NewsArticle[]>();

    for (let i = 0; i < personNames.length; i++) {
      const personName = personNames[i];
      const articles = await this.fetchNews(personName, 30);
      results.set(personName, articles);

      if (i < personNames.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, API_CONFIG.crawler.batchPersonDelayMs));
      }
    }

    return results;
  }

  getSourceTelemetry(articles: NewsArticle[]): {
    articleCount: number;
    byCategory: Record<string, number>;
    byCredibility: {
      high: number;
      medium: number;
      low: number;
      average: number;
    };
    topDomains: Array<{ domain: string; count: number }>;
  } {
    const byCategory: Record<string, number> = {
      polling: 0,
      'fact-check': 0,
      'major-media': 0,
      'regional-media': 0,
      other: 0,
    };

    let high = 0;
    let medium = 0;
    let low = 0;
    let credibilityTotal = 0;
    const domainCounts = new Map<string, number>();

    for (const article of articles) {
      const category = article.sourceCategory || 'other';
      byCategory[category] = (byCategory[category] || 0) + 1;

      const credibility = article.credibility || 1;
      credibilityTotal += credibility;
      if (credibility >= 0.95) high++;
      else if (credibility >= 0.85) medium++;
      else low++;

      const domain = article.sourceDomain || 'unknown';
      domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
    }

    const topDomains = Array.from(domainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));

    return {
      articleCount: articles.length,
      byCategory,
      byCredibility: {
        high,
        medium,
        low,
        average: articles.length > 0 ? Number((credibilityTotal / articles.length).toFixed(3)) : 0,
      },
      topDomains,
    };
  }

  async getFeedHealth(sampleQuery: string = 'world leaders'): Promise<Array<{
    feed: string;
    category: string;
    allowedByRobots: boolean;
    passedDomainPolicy: boolean;
    ok: boolean;
    itemCount: number;
    error?: string;
  }>> {
    const feeds = this.buildFeedUrls(sampleQuery);
    const healthResults: Array<{
      feed: string;
      category: string;
      allowedByRobots: boolean;
      passedDomainPolicy: boolean;
      ok: boolean;
      itemCount: number;
      error?: string;
    }> = [];

    for (const feed of feeds) {
      try {
        const allowedByRobots = await this.isAllowedByRobots(feed.url);
        if (!allowedByRobots) {
          healthResults.push({
            feed: feed.name,
            category: feed.category,
            allowedByRobots,
            passedDomainPolicy: false,
            ok: false,
            itemCount: 0,
            error: 'Blocked by robots policy',
          });
          continue;
        }

        const response = await this.getWithRetry(feed.url, API_CONFIG.crawler.requestTimeoutMs);
        const parsed = this.parseRss(response.data, feed, 30);
        healthResults.push({
          feed: feed.name,
          category: feed.category,
          allowedByRobots,
          passedDomainPolicy: true,
          ok: parsed.length > 0,
          itemCount: parsed.length,
        });
      } catch (error: any) {
        healthResults.push({
          feed: feed.name,
          category: feed.category,
          allowedByRobots: true,
          passedDomainPolicy: true,
          ok: false,
          itemCount: 0,
          error: error?.message || 'Unknown error',
        });
      }
    }

    return healthResults;
  }

  private buildFeedUrls(personName: string): FeedTarget[] {
    const quoted = encodeURIComponent(`"${personName}"`);
    const plain = encodeURIComponent(personName);
    const pollingSites = encodeURIComponent('site:gallup.com OR site:pewresearch.org OR site:yougov.com OR site:ipsos.com OR site:morningconsult.com');
    const factCheckSites = encodeURIComponent('site:politifact.com OR site:factcheck.org OR site:snopes.com OR site:fullfact.org');

    return [
      {
        name: 'Google News RSS',
        url: `https://news.google.com/rss/search?q=${quoted}%20OR%20${plain}%20when%3A30d&hl=en-US&gl=US&ceid=US:en`,
        credibility: 0.85,
        category: 'major-media',
      },
      {
        name: 'Bing News RSS',
        url: `https://www.bing.com/news/search?q=${plain}&format=rss`,
        credibility: 0.8,
        category: 'regional-media',
      },
      {
        name: 'Polling Sources RSS',
        url: `https://news.google.com/rss/search?q=${plain}%20(${pollingSites})%20when%3A30d&hl=en-US&gl=US&ceid=US:en`,
        credibility: 0.95,
        category: 'polling',
      },
      {
        name: 'Fact Check Sources RSS',
        url: `https://news.google.com/rss/search?q=${plain}%20(${factCheckSites})%20when%3A30d&hl=en-US&gl=US&ceid=US:en`,
        credibility: 1,
        category: 'fact-check',
      },
    ];
  }

  private parseRss(xmlContent: string, feed: FeedTarget, daysBack: number): NewsArticle[] {
    const $ = cheerio.load(xmlContent, { xmlMode: true });
    const minDate = Date.now() - daysBack * 24 * 60 * 60 * 1000;

    const articles: NewsArticle[] = [];

    $('item').each((_, item) => {
      const title = $(item).find('title').first().text().trim();
      const description = $(item).find('description').first().text().trim();
      const link = $(item).find('link').first().text().trim();
      const pubDateRaw = $(item).find('pubDate').first().text().trim();
      const sourceNode = $(item).find('source').first();
      const source = sourceNode.text().trim() || this.getSourceFromUrl(link) || feed.name;
      const sourceDomain = this.getSourceFromUrl(link);

      if (!title || !link) return;

      if (!this.isDomainAllowed(sourceDomain)) return;

      const publishedAt = this.normalizeDate(pubDateRaw);
      if (publishedAt) {
        const publishedMs = new Date(publishedAt).getTime();
        if (Number.isFinite(publishedMs) && publishedMs < minDate) {
          return;
        }
      }

      const sentimentScore = this.analyzeSentiment(`${title} ${description}`);

      articles.push({
        title,
        description: this.stripHtml(description),
        url: link,
        source,
        sourceDomain: sourceDomain || undefined,
        sourceCategory: this.getSourceCategory(source, link, feed.category),
        publishedAt: publishedAt || new Date().toISOString(),
        sentiment: sentimentScore,
        credibility: this.getCredibilityScore(source, link, feed.credibility),
      });
    });

    return articles;
  }

  private stripHtml(text: string): string {
    return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  private dedupeArticles(articles: NewsArticle[]): NewsArticle[] {
    const byKey = new Map<string, NewsArticle>();

    for (const article of articles) {
      const key = `${article.title.toLowerCase().replace(/\s+/g, ' ').trim()}|${article.url}`;
      if (!byKey.has(key)) {
        byKey.set(key, article);
      }
    }

    return Array.from(byKey.values()).sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }

  private analyzeSentiment(text: string): number {
    if (!text) return 0;

    const lower = text.toLowerCase();
    const strongNegative = ['scandal', 'corruption', 'fraud', 'crisis', 'outrage', 'backlash'];
    const strongPositive = ['praised', 'celebrated', 'success', 'breakthrough', 'achievement'];

    let keywordScore = 0;
    for (const kw of strongPositive) {
      if (lower.includes(kw)) keywordScore += 0.25;
    }
    for (const kw of strongNegative) {
      if (lower.includes(kw)) keywordScore -= 0.25;
    }

    const base = sentiment.analyze(text).comparative * 2;
    return Math.max(-1, Math.min(1, keywordScore * 0.7 + base * 0.3));
  }

  private getSourceFromUrl(url: string): string | null {
    try {
      const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
      return host;
    } catch {
      return null;
    }
  }

  private getCredibilityScore(source: string, url: string, defaultCredibility: number): number {
    const sourceKey = source.toLowerCase();
    const host = this.getSourceFromUrl(url)?.toLowerCase() || '';

    const highTrust = ['reuters.com', 'apnews.com', 'bbc.com', 'bbc.co.uk', 'gallup.com', 'pewresearch.org', 'yougov.com', 'ipsos.com', 'morningconsult.com', 'politifact.com', 'factcheck.org', 'snopes.com', 'fullfact.org'];
    const mediumTrust = ['nytimes.com', 'wsj.com', 'theguardian.com', 'economist.com', 'npr.org', 'ft.com'];

    if (highTrust.some((domain) => host.includes(domain) || sourceKey.includes(domain))) {
      return 1;
    }

    if (mediumTrust.some((domain) => host.includes(domain) || sourceKey.includes(domain))) {
      return 0.9;
    }

    return defaultCredibility;
  }

  private getSourceCategory(
    source: string,
    url: string,
    defaultCategory: 'polling' | 'fact-check' | 'major-media' | 'regional-media' | 'other'
  ): 'polling' | 'fact-check' | 'major-media' | 'regional-media' | 'other' {
    const sourceKey = source.toLowerCase();
    const host = this.getSourceFromUrl(url)?.toLowerCase() || '';

    const polling = ['gallup.com', 'pewresearch.org', 'yougov.com', 'ipsos.com', 'morningconsult.com'];
    const factCheck = ['politifact.com', 'factcheck.org', 'snopes.com', 'fullfact.org'];
    const majorMedia = ['reuters.com', 'apnews.com', 'bbc.com', 'bbc.co.uk', 'nytimes.com', 'theguardian.com', 'ft.com', 'economist.com'];

    if (polling.some((domain) => host.includes(domain) || sourceKey.includes(domain))) {
      return 'polling';
    }

    if (factCheck.some((domain) => host.includes(domain) || sourceKey.includes(domain))) {
      return 'fact-check';
    }

    if (majorMedia.some((domain) => host.includes(domain) || sourceKey.includes(domain))) {
      return 'major-media';
    }

    return defaultCategory;
  }

  private isDomainAllowed(domain: string | null): boolean {
    if (!domain) return true;

    const normalized = domain.toLowerCase();
    const allowlist = API_CONFIG.crawler.domainAllowlist;
    const blocklist = API_CONFIG.crawler.domainBlocklist;

    if (blocklist.some((blocked) => normalized.includes(blocked))) {
      return false;
    }

    if (allowlist.length === 0) {
      return true;
    }

    return allowlist.some((allowed) => normalized.includes(allowed));
  }

  private normalizeDate(pubDateRaw: string): string | null {
    if (!pubDateRaw) return null;
    const timestamp = new Date(pubDateRaw).getTime();
    if (!Number.isFinite(timestamp)) return null;
    return new Date(timestamp).toISOString();
  }

  private async isAllowedByRobots(targetUrl: string): Promise<boolean> {
    try {
      const url = new URL(targetUrl);
      const hostKey = `${url.protocol}//${url.host}`;

      let rules = this.robotsCache.get(hostKey);
      if (!rules) {
        rules = await this.fetchRobots(hostKey);
        this.robotsCache.set(hostKey, rules);
      }

      if (rules.allowAll) return true;

      const path = url.pathname || '/';
      for (const disallow of rules.disallow) {
        if (disallow === '/') return false;
        if (disallow && path.startsWith(disallow)) return false;
      }

      return true;
    } catch {
      return true;
    }
  }

  private async fetchRobots(hostKey: string): Promise<RobotsRuleSet> {
    try {
      await this.throttleHost(hostKey);
      const robotsUrl = `${hostKey}/robots.txt`;
      const response = await this.getWithRetry(robotsUrl, API_CONFIG.crawler.robotsTimeoutMs);

      return this.parseRobots(response.data);
    } catch {
      return { allowAll: true, disallow: [] };
    }
  }

  private async getWithRetry(url: string, timeout: number): Promise<{ data: string }> {
    const maxRetries = API_CONFIG.crawler.maxRetries;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await this.throttleHost(url);
        const response = await axios.get(url, {
          headers: {
            'User-Agent': USER_AGENT,
            Accept: 'application/rss+xml, application/xml, text/xml, text/plain',
          },
          timeout,
        });

        return { data: response.data };
      } catch (error: any) {
        const isLast = attempt === maxRetries;
        if (isLast) throw error;

        const delayMs = API_CONFIG.crawler.retryBaseDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw new Error('Unreachable retry branch');
  }

  private async throttleHost(target: string): Promise<void> {
    const url = new URL(target);
    const hostKey = `${url.protocol}//${url.host}`;
    const now = Date.now();
    const last = this.lastHostRequestMs.get(hostKey) || 0;
    const elapsed = now - last;
    const minInterval = API_CONFIG.crawler.perHostMinIntervalMs;

    if (elapsed < minInterval) {
      await new Promise((resolve) => setTimeout(resolve, minInterval - elapsed));
    }

    this.lastHostRequestMs.set(hostKey, Date.now());
  }

  private parseRobots(content: string): RobotsRuleSet {
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    const disallow: string[] = [];
    let inGlobalGroup = false;

    for (const line of lines) {
      const lower = line.toLowerCase();

      if (lower.startsWith('user-agent:')) {
        const ua = line.split(':').slice(1).join(':').trim().toLowerCase();
        inGlobalGroup = ua === '*';
        continue;
      }

      if (!inGlobalGroup) continue;

      if (lower.startsWith('disallow:')) {
        const value = line.split(':').slice(1).join(':').trim();
        if (value) {
          disallow.push(value);
        }
      }
    }

    return { allowAll: false, disallow };
  }
}

export const newsCrawlerFetcher = new NewsCrawlerFetcher();
