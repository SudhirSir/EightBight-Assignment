import { NextResponse } from 'next/server';
import initialPortfolio from '@/data/portfolioData.json';
import { fetchBatchYahooCMP } from '@/lib/finance/yahoo';
import { fetchGoogleFinanceData } from '@/lib/finance/google';
import { StockHolding, SectorSummary, PortfolioMetrics } from '@/types/portfolio';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const yahooRequests = initialPortfolio.map((item) => ({
      symbol: item.yahooTicker || item.symbol,
      defaultCmp: item.cmp,
    }));

    const yahooQuotes = await fetchBatchYahooCMP(yahooRequests);

    const totalInvestment = initialPortfolio.reduce(
      (sum, item) => sum + item.purchasePrice * item.quantity,
      0
    );

    let totalPresentValue = 0;
    let totalGainLoss = 0;
    let topGainer: StockHolding | null = null;
    let topLoser: StockHolding | null = null;
    let maxGainPct = -Infinity;
    let minGainPct = Infinity;

    const updatedHoldings: StockHolding[] = await Promise.all(
      initialPortfolio.map(async (item) => {
        const quoteKey = item.yahooTicker || item.symbol;
        const yahooResult = yahooQuotes[quoteKey];
        const cmp = yahooResult?.cmp ?? item.cmp;

        const investment = item.purchasePrice * item.quantity;
        const presentValue = cmp * item.quantity;
        const gainLoss = presentValue - investment;
        const gainLossPct = investment ? (gainLoss / investment) * 100 : 0;

        const googleResult = await fetchGoogleFinanceData(
          item.googleTicker,
          item.peRatio,
          item.latestEarnings
        );

        const holding: StockHolding = {
          ...item,
          cmp,
          peRatio: googleResult.peRatio,
          latestEarnings: googleResult.latestEarnings,
          previousCmp: item.cmp,
          priceChange: yahooResult?.change || 0,
          priceChangePct: yahooResult?.changePct || 0,
          lastUpdated: new Date().toISOString(),
        };

        totalPresentValue += presentValue;
        totalGainLoss += gainLoss;

        if (gainLossPct > maxGainPct) {
          maxGainPct = gainLossPct;
          topGainer = holding;
        }
        if (gainLossPct < minGainPct) {
          minGainPct = gainLossPct;
          topLoser = holding;
        }

        return holding;
      })
    );

    const sectorMap: Record<string, SectorSummary> = {};

    updatedHoldings.forEach((stock) => {
      const sectorName = stock.sector || 'Others';
      const investment = stock.purchasePrice * stock.quantity;
      const presentValue = stock.cmp * stock.quantity;
      const gainLoss = presentValue - investment;

      if (!sectorMap[sectorName]) {
        sectorMap[sectorName] = {
          sector: sectorName,
          totalInvestment: 0,
          totalPresentValue: 0,
          totalGainLoss: 0,
          gainLossPercentage: 0,
          portfolioWeight: 0,
          stockCount: 0,
        };
      }

      sectorMap[sectorName].totalInvestment += investment;
      sectorMap[sectorName].totalPresentValue += presentValue;
      sectorMap[sectorName].totalGainLoss += gainLoss;
      sectorMap[sectorName].stockCount += 1;
    });

    const sectorSummaries: SectorSummary[] = Object.values(sectorMap).map((sec) => ({
      ...sec,
      gainLossPercentage: sec.totalInvestment
        ? ((sec.totalPresentValue - sec.totalInvestment) / sec.totalInvestment) * 100
        : 0,
      portfolioWeight: totalInvestment ? (sec.totalInvestment / totalInvestment) * 100 : 0,
    }));

    const metrics: PortfolioMetrics = {
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      overallReturnPct: totalInvestment ? (totalGainLoss / totalInvestment) * 100 : 0,
      topGainer,
      topLoser,
    };

    return NextResponse.json({
      success: true,
      data: {
        holdings: updatedHoldings,
        sectorSummaries,
        metrics,
      },
      source: 'live',
      lastRefreshed: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API /api/portfolio] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to process portfolio data',
      },
      { status: 500 }
    );
  }
}
