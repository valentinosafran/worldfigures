import { NextRequest, NextResponse } from 'next/server';
import { scoreCalculator } from '../../../../lib/score-calculator';
import { people } from '../../../../data/people';
import { getCachedPersonData, cachePersonData, getAllCachedPeopleData, cacheAllPeopleData, getHistoricalData, storeHistoricalSnapshot } from '../../../../lib/redis';
import { calculateSignalScore, calculateMovement } from '../../../../lib/signal-calculator';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';

    // Try to get all from cache first
    if (!forceRefresh) {
      const cachedData = await getAllCachedPeopleData();
      if (cachedData && cachedData.size > 0) {
        // Verify cached data has required fields (signalScore, movement7d)
        const firstEntry = Array.from(cachedData.values())[0];
        if (firstEntry && 'signalScore' in firstEntry) {
          console.log(`✅ Returning ${cachedData.size} people from cache`);
          return NextResponse.json({
            success: true,
            data: Object.fromEntries(cachedData),
            cached: true,
            count: cachedData.size,
          });
        } else {
          console.log(`⚠️ Cache missing required fields, recalculating...`);
        }
      }
    }

    console.log(`🔄 Calculating fresh data for all people...`);

    const results = new Map<string, any>();
    const errors: string[] = [];

    // Process people in batches to avoid overwhelming APIs
    const batchSize = 3;
    for (let i = 0; i < people.length; i += batchSize) {
      const batch = people.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (person) => {
          try {
            // Check individual cache
            if (!forceRefresh) {
              const cached = await getCachedPersonData(person.slug);
              if (cached && 'signalScore' in cached) {
                results.set(person.slug, cached);
                return;
              }
            }

            const personName = person.slug
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            const result = await scoreCalculator.calculateScores(personName, person.slug);
            
            // Get historical data for trend calculation
            const historical7d = await getHistoricalData(person.slug, 7);
            
            // Calculate 7-day movement
            const movement7d = historical7d 
              ? calculateMovement(result.breakdown, historical7d.scores)
              : null;

            // Calculate signal score
            const signalScore = calculateSignalScore(
              {
                approval: result.breakdown.approval.score,
                trust: result.breakdown.trust.score,
                impact: result.breakdown.impact.score,
                controversy: result.breakdown.controversy.score,
              },
              result.confidence,
              movement7d || undefined
            );

            // Add calculated fields
            const enrichedResult = {
              ...result,
              signalScore,
              movement7d,
            };

            results.set(person.slug, enrichedResult);
            
            // Store historical snapshot
            await storeHistoricalSnapshot(person.slug, result);
            
            // Cache individual result
            await cachePersonData(person.slug, enrichedResult);
          } catch (error) {
            console.error(`Error calculating scores for ${person.slug}:`, error);
            errors.push(person.slug);
          }
        })
      );

      // Small delay between batches to avoid rate limits
      if (i + batchSize < people.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Cache all results
    if (results.size > 0) {
      await cacheAllPeopleData(results);
    }

    return NextResponse.json({
      success: true,
      data: Object.fromEntries(results),
      cached: false,
      count: results.size,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error in bulk fetch:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bulk data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
