import { NextResponse } from 'next/server';

export async function GET() {
  // Check which environment variables are configured (without exposing values)
  const envStatus = {
    NEWSAPI_KEY: !!process.env.NEWSAPI_KEY,
    REDDIT_CLIENT_ID: !!process.env.REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET: !!process.env.REDDIT_CLIENT_SECRET,
    REFRESH_TOKEN: !!process.env.REFRESH_TOKEN,
  };

  // Show partial values for debugging (first 4 chars only)
  const partialValues = {
    NEWSAPI_KEY: process.env.NEWSAPI_KEY ? `${process.env.NEWSAPI_KEY.substring(0, 4)}...` : 'NOT SET',
    REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID ? `${process.env.REDDIT_CLIENT_ID.substring(0, 4)}...` : 'NOT SET',
    REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET ? `${process.env.REDDIT_CLIENT_SECRET.substring(0, 4)}...` : 'NOT SET',
  };

  return NextResponse.json({
    message: 'Environment Variables Status',
    configured: envStatus,
    partial: partialValues,
    allConfigured: Object.values(envStatus).every(v => v),
    note: 'Only partial values shown for security. Reddit credentials are optional.',
  });
}
