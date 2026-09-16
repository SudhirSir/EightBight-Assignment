export interface StockHolding {
  id: number;
  sector: string;
  name: string;
  purchasePrice: number;
  quantity: number;
  symbol: string;
  yahooTicker: string;
  googleTicker: string;
  cmp: number;
  previousCmp?: number;
  peRatio: number | null;
  latestEarnings: number | null;
  lastUpdated?: string;
  isUpdating?: boolean;
  priceChange?: number;
  priceChangePct?: number;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
  portfolioWeight: number;
  stockCount: number;
}

export interface PortfolioMetrics {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  overallReturnPct: number;
  topGainer: StockHolding | null;
  topLoser: StockHolding | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  source: 'live' | 'cache' | 'fallback';
  lastRefreshed: string;
  message?: string;
}
