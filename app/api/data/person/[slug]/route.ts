import { NextRequest, NextResponse } from 'next/server';
import { scoreCalculator } from '../../../../../lib/score-calculator';
import { getCachedPersonData, cachePersonData } from '../../../../../lib/redis';

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

    // Calculate scores
    const result = await scoreCalculator.calculateScores(personName, slug);

    // Cache the result
    await cachePersonData(slug, result);

    return NextResponse.json({
      success: true,
      data: result,
      cached: false,
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
