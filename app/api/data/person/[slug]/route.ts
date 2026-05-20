import { NextRequest, NextResponse } from 'next/server';
import { scoreCalculator } from '../../../../../lib/score-calculator';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // You might want to map slugs to full names
    // For now, we'll convert slug to name
    const personName = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Calculate scores
    const result = await scoreCalculator.calculateScores(personName, slug);

    return NextResponse.json({
      success: true,
      data: result,
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
