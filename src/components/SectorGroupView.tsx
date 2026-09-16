'use client';

import React, { useState } from 'react';
import { SectorSummary, StockHolding } from '@/types/portfolio';
import { ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { PortfolioTable } from './PortfolioTable';

interface SectorGroupViewProps {
  sectorSummaries: SectorSummary[];
  holdings: StockHolding[];
  totalPortfolioInvestment: number;
  onSelectStock: (stock: StockHolding) => void;
}

export const SectorGroupView: React.FC<SectorGroupViewProps> = ({
  sectorSummaries,
  holdings,
  totalPortfolioInvestment,
  onSelectStock,
}) => {
  const [openSectors, setOpenSectors] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    sectorSummaries.forEach((s) => {
      state[s.sector] = true;
    });
    return state;
  });

  const toggleSector = (sectorName: string) => {
    setOpenSectors((prev) => ({
      ...prev,
      [sectorName]: !prev[sectorName],
    }));
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <div className="space-y-4">
      {sectorSummaries.map((summary) => {
        const sectorHoldings = holdings.filter((h) => h.sector === summary.sector);
        const isOpen = openSectors[summary.sector] ?? true;
        const isPositive = summary.totalGainLoss >= 0;

        return (
          <div
            key={summary.sector}
            className="bg-[#12151c] border border-zinc-800 rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div
              onClick={() => toggleSector(summary.sector)}
              className="p-3 bg-[#181b22] hover:bg-zinc-800/60 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800"
            >
              <div className="flex items-center gap-2.5">
                <button className="text-zinc-400 hover:text-zinc-100">
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-100">
                    {summary.sector} Sector
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {summary.stockCount} Stocks
                  </span>
                </div>
              </div>

              {/* Totals Strip */}
              <div className="grid grid-cols-3 gap-6 text-right font-mono text-xs">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Invested</div>
                  <div className="font-semibold text-zinc-300">
                    {formatCurrency(summary.totalInvestment)}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Present Value</div>
                  <div className="font-semibold text-zinc-200">
                    {formatCurrency(summary.totalPresentValue)}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">P&L</div>
                  <div
                    className={`font-semibold ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {formatCurrency(summary.totalGainLoss)} ({isPositive ? '+' : ''}
                    {summary.gainLossPercentage.toFixed(2)}%)
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            {isOpen && (
              <div className="p-0">
                <PortfolioTable
                  holdings={sectorHoldings}
                  totalPortfolioInvestment={totalPortfolioInvestment}
                  onSelectStock={onSelectStock}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
