import { NextRequest, NextResponse } from 'next/server';
import { newsCrawlerFetcher } from '../../../../lib/data-fetchers/news-crawler';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.REFRESH_TOKEN || 'dev-token-123';

    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sampleQuery = request.nextUrl.searchParams.get('q') || 'world leaders';
    const startedAt = Date.now();

    const feeds = await newsCrawlerFetcher.getFeedHealth(sampleQuery);
    const okCount = feeds.filter((f) => f.ok).length;

    return NextResponse.json({
      success: true,
      query: sampleQuery,
      summary: {
        totalFeeds: feeds.length,
        healthyFeeds: okCount,
        unhealthyFeeds: feeds.length - okCount,
        durationMs: Date.now() - startedAt,
      },
      feeds,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check crawler health',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
