/**
 * Yahoo Finance Scraper & API Integration
 * Primary purpose: Fetch Current Market Price (CMP) for stock symbols with ultra-fast timeout and caching.
 */

export interface YahooQuoteResult {
  symbol: string;
  cmp: number;
  previousClose?: number;
  change?: number;
  changePct?: number;
  currency?: string;
  source: 'api' | 'simulated' | 'cache';
  timestamp: string;
}

interface CacheEntry {
  data: YahooQuoteResult;
  expiry: number;
}

const quoteCache: Map<string, CacheEntry> = new Map();
const CACHE_TTL_MS = 15000; // 15 seconds cache TTL

export async function fetchYahooCMP(symbol: string, defaultCmp: number): Promise<YahooQuoteResult> {
  const cacheKey = symbol.toUpperCase();
  const now = Date.now();

  const cached = quoteCache.get(cacheKey);
  if (cached && cached.expiry > now) {
    return { ...cached.data, source: 'cache' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s max timeout per fetch

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      signal: controller.signal,
      next: { revalidate: 15 }
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (meta && typeof meta.regularMarketPrice === 'number' && meta.regularMarketPrice > 0) {
        const rawCmp = meta.regularMarketPrice;

        const isSanityValid = defaultCmp > 0
          ? rawCmp <= defaultCmp * 4 && rawCmp >= defaultCmp * 0.1
          : true;

        if (isSanityValid) {
          const cmp = rawCmp;
          const prevClose = meta.chartPreviousClose || meta.previousClose || cmp;
          const change = cmp - prevClose;
          const changePct = prevClose ? (change / prevClose) * 100 : 0;

          const result: YahooQuoteResult = {
            symbol,
            cmp,
            previousClose: prevClose,
            change,
            changePct,
            currency: meta.currency || 'INR',
            source: 'api',
            timestamp: new Date().toISOString(),
          };

          quoteCache.set(cacheKey, { data: result, expiry: now + CACHE_TTL_MS });
          return result;
        }
      }
    }
  } catch (error) {
    // Timeout or network block -> Fallback to simulation smoothly
  }

  // Fast Fallback Simulation (-0.4% to +0.4% tick)
  const variation = (Math.random() - 0.5) * 0.008;
  const simulatedCmp = Number((defaultCmp * (1 + variation)).toFixed(2));
  const change = Number((simulatedCmp - defaultCmp).toFixed(2));
  const changePct = Number(((change / defaultCmp) * 100).toFixed(2));

  const result: YahooQuoteResult = {
    symbol,
    cmp: simulatedCmp,
    previousClose: defaultCmp,
    change,
    changePct,
    currency: 'INR',
    source: 'simulated',
    timestamp: new Date().toISOString(),
  };

  quoteCache.set(cacheKey, { data: result, expiry: now + CACHE_TTL_MS });
  return result;
}

export async function fetchBatchYahooCMP(
  stockRequests: { symbol: string; defaultCmp: number }[]
): Promise<Record<string, YahooQuoteResult>> {
  const results: Record<string, YahooQuoteResult> = {};
  
  await Promise.all(
    stockRequests.map(async (req) => {
      const quote = await fetchYahooCMP(req.symbol, req.defaultCmp);
      results[req.symbol] = quote;
    })
  );

  return results;
}
