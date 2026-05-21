import { NextRequest, NextResponse } from 'next/server';
import { people } from '../../../../data/people';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Cron endpoint to automatically refresh all profiles
 * Vercel Cron will call this endpoint once daily at 6 AM UTC (±59 min)
 * Hobby plan limitation: minimum interval is once per day
 * This keeps cached data fresh without manual requests
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (security check)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn('⚠️  Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting automated profile refresh...');
    const startTime = Date.now();

    // Get base URL for internal API calls
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Refresh all profiles with force refresh parameter
    const refreshPromises = people.map(async (person) => {
      try {
        const response = await fetch(
          `${baseUrl}/api/data/person/${person.slug}?refresh=true`,
          {
            cache: 'no-store',
            headers: {
              'User-Agent': 'WorldFigures-Cron/1.0',
            },
          }
        );

        if (!response.ok) {
          console.error(`❌ Failed to refresh ${person.slug}: ${response.status}`);
          return { slug: person.slug, success: false, error: response.status };
        }

        const data = await response.json();
        console.log(`✅ Refreshed ${person.slug} (Signal: ${data.data?.signalScore || 'N/A'})`);
        return { slug: person.slug, success: true, signal: data.data?.signalScore };
      } catch (error) {
        console.error(`❌ Error refreshing ${person.slug}:`, error);
        return { slug: person.slug, success: false, error: String(error) };
      }
    });

    // Execute all refreshes in parallel
    const results = await Promise.allSettled(refreshPromises);

    // Count successes and failures
    const stats = {
      total: people.length,
      successful: 0,
      failed: 0,
      duration: Date.now() - startTime,
    };

    const failedProfiles: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        stats.successful++;
      } else {
        stats.failed++;
        failedProfiles.push(people[index].slug);
      }
    });

    console.log(`✅ Refresh complete: ${stats.successful}/${stats.total} succeeded in ${stats.duration}ms`);
    
    if (failedProfiles.length > 0) {
      console.log(`❌ Failed profiles: ${failedProfiles.join(', ')}`);
    }

    return NextResponse.json({
      success: true,
      stats,
      failedProfiles: failedProfiles.length > 0 ? failedProfiles : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
