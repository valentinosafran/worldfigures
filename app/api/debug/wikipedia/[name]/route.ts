import { NextRequest, NextResponse } from 'next/server';
import { wikipediaFetcher } from '../../../../../lib/data-fetchers/wikipedia';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;
    const decodedName = decodeURIComponent(name);

    console.log(`\n🧪 Testing Wikipedia lookup for: "${decodedName}"`);

    // Try direct lookup
    console.log('1️⃣ Attempting direct lookup...');
    const directResult = await wikipediaFetcher.getPageData(decodedName);

    // Try search
    console.log('2️⃣ Attempting search...');
    const searchResult = await wikipediaFetcher.searchPage(decodedName);

    // If search found something, get its data
    let searchData = null;
    if (searchResult) {
      console.log(`3️⃣ Getting data for search result: "${searchResult}"`);
      searchData = await wikipediaFetcher.getPageData(searchResult);
    }

    return NextResponse.json({
      query: decodedName,
      results: {
        directLookup: directResult ? {
          found: true,
          pageViews: directResult.pageViews,
          extractLength: directResult.extract.length,
          categories: directResult.categories.length,
          lastEdited: directResult.lastEdited,
        } : { found: false },
        search: searchResult ? {
          found: true,
          title: searchResult,
          data: searchData ? {
            pageViews: searchData.pageViews,
            extractLength: searchData.extract.length,
            categories: searchData.categories.length,
          } : null,
        } : { found: false },
      },
      recommendation: directResult ? 'Use direct lookup' : searchResult ? `Use search result: "${searchResult}"` : 'No Wikipedia page found',
    });
  } catch (error) {
    console.error('Error testing Wikipedia:', error);
    return NextResponse.json(
      {
        error: 'Failed to test Wikipedia lookup',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
