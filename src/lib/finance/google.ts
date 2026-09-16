/**
 * Google Finance Scraper & Data Integration
 * Primary purpose: Fetch P/E Ratio and Latest Earnings (EPS) for stock tickers with timeout.
 */

export interface GoogleFinanceData {
  symbol: string;
  peRatio: number | null;
  latestEarnings: number | null;
  source: 'api' | 'scraped' | 'fallback';
  timestamp: string;
}

const googleCache: Map<string, { data: GoogleFinanceData; expiry: number }> = new Map();
const CACHE_TTL_MS = 60000; // 1 minute cache for fundamentals

export async function fetchGoogleFinanceData(
  googleTicker: string,
  defaultPe: number | null,
  defaultEarnings: number | null
): Promise<GoogleFinanceData> {
  const cacheKey = googleTicker.toUpperCase();
  const now = Date.now();

  const cached = googleCache.get(cacheKey);
  if (cached && cached.expiry > now) {
    return cached.data;
  }

  if (googleTicker) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s max timeout

      const url = `https://www.google.com/finance/quote/${encodeURIComponent(googleTicker)}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
        next: { revalidate: 60 }
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();
        
        let peRatio = defaultPe;
        let latestEarnings = defaultEarnings;

        const peMatch = html.match(/P\/E ratio<\/div>\s*<div[^>]*>([\d.,]+)<\/div>/i) ||
                        html.match(/data-attrid="P\/E ratio"[^>]*>([\d.,]+)/i);
        if (peMatch && peMatch[1]) {
          const parsed = parseFloat(peMatch[1].replace(/,/g, ''));
          if (!isNaN(parsed)) peRatio = parsed;
        }

        const epsMatch = html.match(/Earnings per share[^>]*>([\d.,]+)/i) ||
                         html.match(/EPS<\/div>\s*<div[^>]*>([\d.,]+)<\/div>/i);
        if (epsMatch && epsMatch[1]) {
          const parsed = parseFloat(epsMatch[1].replace(/,/g, ''));
          if (!isNaN(parsed)) latestEarnings = parsed;
        }

        const result: GoogleFinanceData = {
          symbol: googleTicker,
          peRatio,
          latestEarnings,
          source: 'scraped',
          timestamp: new Date().toISOString(),
        };

        googleCache.set(cacheKey, { data: result, expiry: now + CACHE_TTL_MS });
        return result;
      }
    } catch (err) {
      // Timeout or block -> Fallback gracefully
    }
  }

  const fallbackResult: GoogleFinanceData = {
    symbol: googleTicker,
    peRatio: defaultPe,
    latestEarnings: defaultEarnings,
    source: 'fallback',
    timestamp: new Date().toISOString(),
  };

  googleCache.set(cacheKey, { data: fallbackResult, expiry: now + CACHE_TTL_MS });
  return fallbackResult;
}
