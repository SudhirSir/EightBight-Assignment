'use client';

import React from 'react';
import { PortfolioMetrics } from '@/types/portfolio';
import { TrendingUp, TrendingDown, Wallet, DollarSign, Award } from 'lucide-react';

interface SummaryCardsProps {
  metrics: PortfolioMetrics;
  totalHoldingsCount: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics, totalHoldingsCount }) => {
  const isPositive = metrics.totalGainLoss >= 0;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Present Value */}
      <div className="bg-[#12151c] border border-zinc-700/80 rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between text-zinc-300 mb-1">
          <span className="text-xs uppercase tracking-wider font-semibold text-zinc-300">Current Value</span>
          <Wallet className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-white tracking-tight">
          {formatCurrency(metrics.totalPresentValue)}
        </div>
        <div className="text-xs text-zinc-400 mt-1 font-mono">
          {totalHoldingsCount} Stock Holdings
        </div>
      </div>

      {/* Total Investment */}
      <div className="bg-[#12151c] border border-zinc-700/80 rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between text-zinc-300 mb-1">
          <span className="text-xs uppercase tracking-wider font-semibold text-zinc-300">Invested Capital</span>
          <DollarSign className="h-4 w-4 text-blue-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-white tracking-tight">
          {formatCurrency(metrics.totalInvestment)}
        </div>
        <div className="text-xs text-zinc-400 mt-1 font-mono">
          Initial Cost Basis
        </div>
      </div>

      {/* Total Gain / Loss */}
      <div className="bg-[#12151c] border border-zinc-700/80 rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between text-zinc-300 mb-1">
          <span className="text-xs uppercase tracking-wider font-semibold text-zinc-300">Total Returns</span>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-400" />
          )}
        </div>
        <div
          className={`text-2xl font-bold font-mono tracking-tight ${
            isPositive ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {isPositive ? '+' : ''}
          {formatCurrency(metrics.totalGainLoss)}
        </div>
        <div className="flex items-center gap-1.5 mt-1 font-mono text-xs">
          <span
            className={`font-bold ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {metrics.overallReturnPct.toFixed(2)}%
          </span>
          <span className="text-zinc-400">Overall P&L</span>
        </div>
      </div>

      {/* Top Performer */}
      <div className="bg-[#12151c] border border-zinc-700/80 rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between text-zinc-300 mb-1">
          <span className="text-xs uppercase tracking-wider font-semibold text-zinc-300">Top Performer</span>
          <Award className="h-4 w-4 text-amber-400" />
        </div>
        {metrics.topGainer ? (
          <div>
            <div className="text-base font-bold text-white truncate">
              {metrics.topGainer.name}
            </div>
            <div className="flex items-center justify-between mt-1 text-xs font-mono">
              <span className="text-zinc-300">₹{metrics.topGainer.cmp}</span>
              <span className="text-emerald-400 font-bold">
                +
                {(
                  ((metrics.topGainer.cmp * metrics.topGainer.quantity -
                    metrics.topGainer.purchasePrice * metrics.topGainer.quantity) /
                    (metrics.topGainer.purchasePrice * metrics.topGainer.quantity)) *
                  100
                ).toFixed(2)}
                %
              </span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-zinc-500 font-mono">—</div>
        )}
      </div>
    </div>
  );
};
