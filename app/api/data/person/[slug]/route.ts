import { NextRequest, NextResponse } from 'next/server';
import { scoreCalculator } from '../../../../../lib/score-calculator';
import { getCachedPersonData, cachePersonData, getHistoricalData, storeHistoricalSnapshot } from '../../../../../lib/redis';
import { calculateSignalScore, calculateMovement } from '../../../../../lib/signal-calculator';

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Check for force refresh parameter
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';

    // Try to get from cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = await getCachedPersonData(slug);
      if (cachedData) {
        return NextResponse.json({
          success: true,
          data: cachedData,
          cached: true,
        });
      }
    }

    console.log(`🔄 Calculating fresh data for ${slug}...`);

    // You might want to map slugs to full names
    // For now, we'll convert slug to name
    const personName = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Calculate scores with fallback to cache on failure
    let result;
    let enrichedResult;
    let usedFallback = false;

    try {
      result = await scoreCalculator.calculateScores(personName, slug);

      // Get historical data for trend calculation
      const historical7d = await getHistoricalData(slug, 7);
      
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

      // Add calculated fields to result
      enrichedResult = {
        ...result,
        signalScore,
        movement7d,
      };

      // Store historical snapshot for future trend calculations
      await storeHistoricalSnapshot(slug, result);

      // Cache the enriched result
      await cachePersonData(slug, enrichedResult);
    } catch (calculationError) {
      console.error(`❌ Calculation failed for ${slug}, attempting fallback to cache...`, calculationError);
      
      // Try to get cached data as fallback
      const cachedData = await getCachedPersonData(slug);
      if (cachedData) {
        console.log(`✅ Using cached data as fallback for ${slug}`);
        enrichedResult = cachedData;
        usedFallback = true;
      } else {
        // No cache available, re-throw the error
        console.error(`❌ No cached data available for ${slug}`);
        throw calculationError;
      }
    }

    return NextResponse.json({
      success: true,
      data: enrichedResult,
      cached: usedFallback,
      stale: usedFallback, // Indicate this is fallback data
    });
  } catch (error) {
    console.error('Error calculating scores:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate scores',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
