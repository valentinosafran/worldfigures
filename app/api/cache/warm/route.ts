import { NextRequest, NextResponse } from 'next/server';
import { people } from '../../../../data/people';
import { scoreCalculator } from '../../../../lib/score-calculator';
import { getCachedPersonData, cachePersonData } from '../../../../lib/redis';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Cache warming endpoint - calculates and caches data for all people
 * This ensures the first user doesn't have to wait for calculations
 * 
 * Usage:
 * - GET /api/cache/warm - Warm cache for all people
 * - GET /api/cache/warm?force=true - Force recalculate all (skip cache check)
 */
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    const forceRefresh = request.nextUrl.searchParams.get('force') === 'true';

    console.log(`🔥 Starting cache warming for ${people.length} people...`);
    console.log(`   Force refresh: ${forceRefresh}`);

    const results: {
      slug: string;
      status: 'cached' | 'calculated' | 'error';
      timeMs?: number;
      error?: string;
    }[] = [];

    // Process in batches to avoid overwhelming APIs
    const batchSize = 2; // Process 2 at a time to be gentle on APIs
    
    for (let i = 0; i < people.length; i += batchSize) {
      const batch = people.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (person) => {
          const personStart = Date.now();
          
          try {
            // Check if already cached
            if (!forceRefresh) {
              const cached = await getCachedPersonData(person.slug);
              if (cached) {
                results.push({
                  slug: person.slug,
                  status: 'cached',
                  timeMs: Date.now() - personStart,
                });
                console.log(`   ✅ ${person.slug}: Already cached`);
                return;
              }
            }

            // Calculate fresh data
            console.log(`   🔄 ${person.slug}: Calculating...`);
            const personName = person.slug
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            const result = await scoreCalculator.calculateScores(personName, person.slug);
            
            // Cache the result
            await cachePersonData(person.slug, result);

            results.push({
              slug: person.slug,
              status: 'calculated',
              timeMs: Date.now() - personStart,
            });
            console.log(`   ✅ ${person.slug}: Calculated and cached (${Date.now() - personStart}ms)`);
          } catch (error) {
            console.error(`   ❌ ${person.slug}: Error -`, error);
            results.push({
              slug: person.slug,
              status: 'error',
              timeMs: Date.now() - personStart,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        })
      );

      // Small delay between batches
      if (i + batchSize < people.length) {
        console.log(`   ⏳ Batch complete, waiting 2s before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const totalTime = Date.now() - startTime;
    const summary = {
      cached: results.filter(r => r.status === 'cached').length,
      calculated: results.filter(r => r.status === 'calculated').length,
      errors: results.filter(r => r.status === 'error').length,
    };

    console.log(`🎉 Cache warming complete!`);
    console.log(`   Total time: ${totalTime}ms`);
    console.log(`   Already cached: ${summary.cached}`);
    console.log(`   Newly calculated: ${summary.calculated}`);
    console.log(`   Errors: ${summary.errors}`);

    return NextResponse.json({
      success: true,
      message: 'Cache warming complete',
      totalTimeMs: totalTime,
      summary,
      details: results,
    });
  } catch (error) {
    console.error('❌ Cache warming error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Cache warming failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
