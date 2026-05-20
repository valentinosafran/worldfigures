import { NextRequest, NextResponse } from 'next/server';
import { scoreCalculator } from '../../../../lib/score-calculator';
import { people } from '../../../../data/people';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, all } = body;

    // Verify authorization (you should add proper auth)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.REFRESH_TOKEN || 'dev-token-123';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (all) {
      // Refresh all people
      const results = [];
      
      for (const person of people) {
        console.log(`Refreshing ${person.name}...`);
        try {
          const result = await scoreCalculator.calculateScores(person.name, person.slug);
          results.push({
            slug: person.slug,
            success: true,
            data: result,
          });
        } catch (error) {
          results.push({
            slug: person.slug,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Refreshed ${results.filter(r => r.success).length} out of ${people.length} profiles`,
        results,
      });
    } else if (slug) {
      // Refresh single person
      const person = people.find(p => p.slug === slug);
      
      if (!person) {
        return NextResponse.json(
          { success: false, error: 'Person not found' },
          { status: 404 }
        );
      }

      const result = await scoreCalculator.calculateScores(person.name, person.slug);

      return NextResponse.json({
        success: true,
        data: result,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Must specify "slug" or "all": true' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error refreshing data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Use POST to refresh data',
    usage: {
      singlePerson: 'POST /api/data/refresh with body: { "slug": "person-slug" }',
      allPeople: 'POST /api/data/refresh with body: { "all": true }',
    },
    note: 'Requires Authorization: Bearer TOKEN header',
  });
}
