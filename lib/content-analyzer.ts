import { NewsArticle, ScoreBreakdown, TrendData } from '../types';

export interface ProfileInsights {
  keyTopics: string[];
  movementNotes: string[];
  strengthSignals: string[];
  riskSignals: string[];
  articles: NewsArticle[];
}

/**
 * Analyzes news articles and data to extract dynamic insights
 */
export class ContentAnalyzer {
  /**
   * Extract comprehensive insights from articles and scores
   */
  analyzeProfile(
    articles: NewsArticle[],
    breakdown: ScoreBreakdown,
    trendData: TrendData[]
  ): ProfileInsights {
    return {
      keyTopics: this.extractKeyTopics(articles),
      movementNotes: this.generateMovementNotes(breakdown, articles),
      strengthSignals: this.extractStrengthSignals(articles, breakdown),
      riskSignals: this.extractRiskSignals(articles, breakdown),
      articles: this.getLatestArticles(articles, 10),
    };
  }

  /**
   * Extract key topics from article titles and descriptions
   */
  private extractKeyTopics(articles: NewsArticle[]): string[] {
    const topicKeywords: Record<string, string[]> = {
      'Economic policy': ['economy', 'economic', 'gdp', 'inflation', 'budget', 'fiscal', 'tax', 'financial', 'trade', 'market'],
      'Foreign relations': ['foreign', 'diplomatic', 'international', 'summit', 'treaty', 'alliance', 'nato', 'un', 'bilateral'],
      'Domestic policy': ['domestic', 'law', 'legislation', 'bill', 'reform', 'policy', 'government', 'congress', 'parliament'],
      'Climate action': ['climate', 'environment', 'green', 'renewable', 'emission', 'carbon', 'sustainability', 'energy transition'],
      'Security issues': ['security', 'defense', 'military', 'terrorism', 'threat', 'intelligence', 'conflict', 'war', 'peace'],
      'Healthcare': ['health', 'healthcare', 'medical', 'hospital', 'pandemic', 'vaccine', 'covid', 'disease', 'public health'],
      'Technology': ['tech', 'technology', 'ai', 'digital', 'innovation', 'cyber', 'internet', 'data', 'software'],
      'Immigration': ['immigration', 'migrant', 'refugee', 'border', 'asylum', 'visa'],
      'Education': ['education', 'school', 'university', 'student', 'learning', 'academic'],
      'Social issues': ['social', 'equality', 'rights', 'justice', 'discrimination', 'diversity', 'inclusion'],
      'Infrastructure': ['infrastructure', 'construction', 'transport', 'roads', 'bridges', 'development'],
      'Elections': ['election', 'campaign', 'vote', 'ballot', 'polling', 'electoral', 'primary'],
    };

    const topicScores = new Map<string, number>();
    const allText = articles
      .map(a => `${a.title} ${a.description}`.toLowerCase())
      .join(' ');

    // Score each topic based on keyword frequency
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
        const matches = allText.match(regex);
        score += matches ? matches.length : 0;
      }
      if (score > 0) {
        topicScores.set(topic, score);
      }
    }

    // Return top 3 topics
    return Array.from(topicScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);
  }

  /**
   * Generate movement notes based on recent trends and sentiment
   */
  private generateMovementNotes(breakdown: ScoreBreakdown, articles: NewsArticle[]): string[] {
    const notes: string[] = [];
    const avgSentiment = articles.length > 0
      ? articles.reduce((sum, a) => sum + (a.sentiment || 0), 0) / articles.length
      : 0;

    // Approval analysis
    if (breakdown.approval.score >= 55) {
      notes.push('Approval remains relatively resilient');
    } else if (breakdown.approval.score < 45) {
      notes.push('Approval facing significant headwinds');
    }

    // Trust analysis
    if (breakdown.trust.score < 50) {
      notes.push('Trust metrics showing vulnerability');
    } else if (breakdown.trust.score >= 65) {
      notes.push('Trust levels showing strength');
    }

    // Controversy analysis
    if (breakdown.controversy.score >= 50) {
      notes.push('Controversy rises around headline policy cycles');
    } else if (breakdown.controversy.score >= 25) {
      notes.push('Moderate controversy in recent coverage');
    }

    // Sentiment analysis
    if (avgSentiment > 0.15) {
      notes.push('Recent media tone predominantly positive');
    } else if (avgSentiment < -0.15) {
      notes.push('Recent coverage carries critical undertones');
    }

    // Impact analysis
    if (breakdown.impact.score >= 80) {
      notes.push('Maintaining strong media presence');
    }

    return notes.slice(0, 2); // Return top 2 notes
  }

  /**
   * Extract strength signals from positive indicators
   */
  private extractStrengthSignals(articles: NewsArticle[], breakdown: ScoreBreakdown): string[] {
    const signals: string[] = [];
    const positiveArticles = articles.filter(a => (a.sentiment || 0) > 0.1);

    // High impact
    if (breakdown.impact.score >= 85) {
      signals.push('High national influence');
    } else if (breakdown.impact.score >= 70) {
      signals.push('Strong impact score across policy narratives');
    }

    // Policy strength
    if (breakdown.impact.components.policyInfluence >= 80) {
      signals.push('Significant policy influence');
    }

    // Media presence
    if (breakdown.impact.components.mediaCoverage >= 90) {
      signals.push('Dominant media coverage');
    } else if (breakdown.impact.components.mediaCoverage >= 70) {
      signals.push('Strong media presence');
    }

    // Trust strength
    if (breakdown.trust.score >= 65) {
      signals.push('Above-average trust ratings');
    }

    // Approval strength
    if (breakdown.approval.score >= 60) {
      signals.push('Favorable approval ratings');
    }

    // Positive sentiment
    if (positiveArticles.length > articles.length * 0.4) {
      signals.push('Positive media sentiment balance');
    }

    // Low controversy
    if (breakdown.controversy.score < 20) {
      signals.push('Low controversy profile');
    }

    return signals.slice(0, 2); // Return top 2 signals
  }

  /**
   * Extract risk signals from negative indicators
   */
  private extractRiskSignals(articles: NewsArticle[], breakdown: ScoreBreakdown): string[] {
    const signals: string[] = [];
    const negativeArticles = articles.filter(a => (a.sentiment || 0) < -0.1);

    // High controversy
    if (breakdown.controversy.score >= 60) {
      signals.push('Elevated controversy levels');
    } else if (breakdown.controversy.score >= 40) {
      signals.push('Moderate controversy in public discourse');
    }

    // Low approval
    if (breakdown.approval.score < 40) {
      signals.push('Below-average approval ratings');
    } else if (breakdown.approval.score < 50) {
      signals.push('Approval under pressure');
    }

    // Low trust
    if (breakdown.trust.score < 45) {
      signals.push('Trust deficit concerns');
    } else if (breakdown.trust.score < 55) {
      signals.push('Trust levels below benchmark');
    }

    // High negative coverage
    if (breakdown.controversy.components.negativeCoverage >= 50) {
      signals.push('High negative media coverage');
    }

    // Scandal frequency
    if (breakdown.controversy.components.scandalFrequency >= 40) {
      signals.push('Recurring scandal narratives');
    }

    // Negative sentiment
    if (negativeArticles.length > articles.length * 0.4) {
      signals.push('Predominantly negative media tone');
    }

    // Criticism intensity
    if (breakdown.controversy.components.criticismIntensity >= 60) {
      signals.push('Intense public criticism');
    }

    // Polarization
    if (breakdown.controversy.components.polarization >= 50) {
      signals.push('Polarized reception in social discourse');
    }

    return signals.slice(0, 2); // Return top 2 signals
  }

  /**
   * Get the latest articles sorted by date
   */
  private getLatestArticles(articles: NewsArticle[], limit: number): NewsArticle[] {
    return articles
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return dateB - dateA; // Sort newest first
      })
      .slice(0, limit);
  }
}

export const contentAnalyzer = new ContentAnalyzer();
