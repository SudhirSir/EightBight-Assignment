'use client';

import React from 'react';
import { StockHolding } from '@/types/portfolio';
import { X, ExternalLink, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';

interface StockModalProps {
  stock: StockHolding | null;
  onClose: () => void;
  totalPortfolioInvestment: number;
}

export const StockModal: React.FC<StockModalProps> = ({
  stock,
  onClose,
  totalPortfolioInvestment,
}) => {
  if (!stock) return null;

  const investment = stock.purchasePrice * stock.quantity;
  const presentValue = stock.cmp * stock.quantity;
  const gainLoss = presentValue - investment;
  const returnPct = investment ? (gainLoss / investment) * 100 : 0;
  const portfolioWeight = totalPortfolioInvestment ? (investment / totalPortfolioInvestment) * 100 : 0;
  const isPositive = gainLoss >= 0;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#181b22] border border-zinc-700 rounded-xl max-w-lg w-full p-6 shadow-2xl relative text-zinc-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-700/80 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
                {stock.sector}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-zinc-900 text-cyan-400 font-semibold border border-zinc-800">
                {stock.symbol || 'BSE/NSE'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1.5">{stock.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Real-time Price Banner */}
        <div className="bg-[#0e1117] border border-zinc-700/80 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-mono uppercase font-medium">Current Market Price (CMP)</span>
            <div className="text-2xl font-bold font-mono text-white mt-0.5">
              {formatCurrency(stock.cmp)}
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">Source: Yahoo Finance API</span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-md border font-mono flex items-center gap-1.5 text-sm ${
              isPositive
                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                : 'bg-rose-950/60 border-rose-700 text-rose-300'
            }`}
          >
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="font-bold">
              {isPositive ? '+' : ''}
              {returnPct.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
          <div className="bg-[#0e1117] p-3 rounded-lg border border-zinc-800">
            <span className="text-zinc-400 text-[11px] block">Buy Price</span>
            <div className="font-bold text-white text-sm mt-0.5">
              {formatCurrency(stock.purchasePrice)}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3 rounded-lg border border-zinc-800">
            <span className="text-zinc-400 text-[11px] block">Quantity</span>
            <div className="font-bold text-white text-sm mt-0.5">{stock.quantity} shares</div>
          </div>

          <div className="bg-[#0e1117] p-3 rounded-lg border border-zinc-800">
            <span className="text-zinc-400 text-[11px] block">Total Investment</span>
            <div className="font-bold text-white text-sm mt-0.5">
              {formatCurrency(investment)}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3 rounded-lg border border-zinc-800">
            <span className="text-zinc-400 text-[11px] block">Present Value</span>
            <div className="font-bold text-white text-sm mt-0.5">
              {formatCurrency(presentValue)}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3 rounded-lg border border-zinc-800">
            <span className="text-zinc-400 text-[11px] block">P/E Ratio (Google)</span>
            <div className="font-bold text-white text-sm mt-0.5">
              {stock.peRatio !== null ? stock.peRatio.toFixed(2) : '—'}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3 rounded-lg border border-zinc-800">
            <span className="text-zinc-400 text-[11px] block">Latest EPS (Google)</span>
            <div className="font-bold text-white text-sm mt-0.5">
              {stock.latestEarnings !== null ? `₹${stock.latestEarnings.toFixed(2)}` : '—'}
            </div>
          </div>
        </div>

        {/* Portfolio Weight */}
        <div className="mb-4 bg-[#0e1117] p-3 rounded-lg border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-300 mb-1 font-mono">
            <span>Portfolio Weight Allocation</span>
            <span className="font-bold text-white">{portfolioWeight.toFixed(2)}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${portfolioWeight}%` }} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-700/80 text-xs text-zinc-300 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Cached & rate-limit protected</span>
          </div>
          {stock.yahooTicker && (
            <a
              href={`https://finance.yahoo.com/quote/${stock.yahooTicker}`}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline font-semibold"
            >
              Yahoo Finance Quote <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
