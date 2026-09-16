import { NextRequest, NextResponse } from 'next/server';
import { fetchYahooCMP } from '@/lib/finance/yahoo';
import initialPortfolio from '@/data/portfolioData.json';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ success: false, message: 'Symbol parameter required' }, { status: 400 });
  }

  const match = initialPortfolio.find(
    (item) => item.symbol === symbol || item.yahooTicker === symbol
  );
  const defaultCmp = match ? match.cmp : 1000;

  const quote = await fetchYahooCMP(symbol, defaultCmp);

  return NextResponse.json({
    success: true,
    data: quote,
  });
}
