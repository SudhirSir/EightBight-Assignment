'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { StockHolding, SectorSummary, PortfolioMetrics } from '@/types/portfolio';
import { Navbar } from '@/components/Navbar';
import { SummaryCards } from '@/components/SummaryCards';
import { ControlsBar } from '@/components/ControlsBar';
import { PortfolioTable } from '@/components/PortfolioTable';
import { SectorGroupView } from '@/components/SectorGroupView';
import { ChartsSection } from '@/components/ChartsSection';
import { StockModal } from '@/components/StockModal';
import { AlertCircle, RefreshCw, Layers } from 'lucide-react';

const REFRESH_INTERVAL_SECONDS = 15;

export default function Home() {
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  const [sectorSummaries, setSectorSummaries] = useState<SectorSummary[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalInvestment: 0,
    totalPresentValue: 0,
    totalGainLoss: 0,
    overallReturnPct: 0,
    topGainer: null,
    topLoser: null,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  // Filtering & View state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'sectors' | 'analytics'>('table');
  const [selectedStock, setSelectedStock] = useState<StockHolding | null>(null);

  // Auto Refresh Countdown state
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(REFRESH_INTERVAL_SECONDS);

  // Main data fetcher
  const fetchPortfolioData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    setError(null);

    try {
      const res = await fetch('/api/portfolio');
      const json = await res.json();

      if (json.success && json.data) {
        setHoldings(json.data.holdings || []);
        setSectorSummaries(json.data.sectorSummaries || []);
        setMetrics(json.data.metrics || {});
        setLastRefreshed(json.lastRefreshed || new Date().toISOString());
      } else {
        throw new Error(json.message || 'Failed to fetch portfolio data');
      }
    } catch (err: any) {
      console.error('Error fetching portfolio:', err);
      setError(err?.message || 'Network error fetching live market data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setCountdown(REFRESH_INTERVAL_SECONDS);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  // 15-second interval timer for auto-refresh
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchPortfolioData();
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefreshEnabled, fetchPortfolioData]);

  // Filter holdings based on search term & sector selection
  const filteredHoldings = holdings.filter((stock) => {
    const matchesSearch =
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector = selectedSector === 'ALL' || stock.sector === selectedSector;

    return matchesSearch && matchesSector;
  });

  const sectorsList = Array.from(new Set(holdings.map((h) => h.sector))).filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        lastRefreshed={lastRefreshed}
        isRefreshing={isRefreshing}
        onRefresh={() => fetchPortfolioData(true)}
        autoRefreshEnabled={autoRefreshEnabled}
        onToggleAutoRefresh={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
        countdown={countdown}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {/* Error Notification Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Market Data Warning</h4>
                <p className="text-xs text-rose-300">{error}. Displaying fallback baseline data.</p>
              </div>
            </div>
            <button
              onClick={() => fetchPortfolioData(true)}
              className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-slate-900 rounded-xl border border-slate-800" />
              ))}
            </div>
            <div className="h-16 bg-slate-900 rounded-xl border border-slate-800" />
            <div className="h-96 bg-slate-900 rounded-xl border border-slate-800" />
          </div>
        ) : (
          <>
            {/* Top KPI Metrics Cards */}
            <SummaryCards metrics={metrics} totalHoldingsCount={holdings.length} />

            {/* Filter & View Switcher Bar */}
            <ControlsBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedSector={selectedSector}
              onSectorChange={setSelectedSector}
              sectorsList={sectorsList}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalFilteredCount={filteredHoldings.length}
            />

            {/* View Render Logic */}
            {viewMode === 'analytics' ? (
              <ChartsSection sectorSummaries={sectorSummaries} holdings={holdings} />
            ) : viewMode === 'sectors' ? (
              <SectorGroupView
                sectorSummaries={sectorSummaries.filter(
                  (s) => selectedSector === 'ALL' || s.sector === selectedSector
                )}
                holdings={filteredHoldings}
                totalPortfolioInvestment={metrics.totalInvestment}
                onSelectStock={setSelectedStock}
              />
            ) : (
              <PortfolioTable
                holdings={filteredHoldings}
                totalPortfolioInvestment={metrics.totalInvestment}
                onSelectStock={setSelectedStock}
              />
            )}
          </>
        )}
      </main>



      {/* Stock Detail Modal */}
      <StockModal
        stock={selectedStock}
        onClose={() => setSelectedStock(null)}
        totalPortfolioInvestment={metrics.totalInvestment}
      />
    </div>
  );
}
