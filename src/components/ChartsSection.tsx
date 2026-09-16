'use client';

import React from 'react';
import { SectorSummary, StockHolding } from '@/types/portfolio';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface ChartsSectionProps {
  sectorSummaries: SectorSummary[];
  holdings: StockHolding[];
}

const SECTOR_COLORS = [
  '#38bdf8', // bright sky blue
  '#818cf8', // bright indigo
  '#c084fc', // bright purple
  '#f472b6', // bright pink
  '#fbbf24', // bright amber
  '#34d399', // bright emerald
  '#94a3b8', // bright slate
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const val = data.value;
    const formattedVal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

    return (
      <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl text-xs font-mono">
        <div className="text-zinc-300 font-semibold mb-1">{data.name || data.payload?.name}</div>
        <div className="text-white font-bold text-sm">
          {data.dataKey === 'GainLoss' || data.name === 'Net Gain/Loss' ? 'Gain / Loss: ' : 'Investment: '}
          <span className={val >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
            {formattedVal}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const ChartsSection: React.FC<ChartsSectionProps> = ({ sectorSummaries }) => {
  const pieData = sectorSummaries.map((sec) => ({
    name: sec.sector,
    value: Math.round(sec.totalInvestment),
    weightPct: sec.portfolioWeight,
  }));

  const barData = sectorSummaries.map((sec) => ({
    name: sec.sector,
    GainLoss: Math.round(sec.totalGainLoss),
  }));

  const formatYAxis = (value: number) => {
    if (Math.abs(value) >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    if (Math.abs(value) >= 1000) {
      return `₹${(value / 1000).toFixed(0)}k`;
    }
    return `₹${value}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Donut Chart */}
      <div className="bg-[#12151c] border border-zinc-700/80 rounded-xl p-5 shadow-lg">
        <div className="mb-4">
          <h3 className="text-base font-bold text-white">Capital Allocation by Sector</h3>
          <p className="text-xs text-zinc-300 font-mono mt-0.5">
            Proportional investment distribution across industries
          </p>
        </div>

        <div className="h-[270px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={92}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                    stroke="#12151c"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-3 pt-3 border-t border-zinc-800">
          {pieData.map((entry, idx) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs text-zinc-200 font-mono">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length] }}
              />
              <span>
                {entry.name}: <strong className="text-white font-bold">{entry.weightPct.toFixed(1)}%</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-[#12151c] border border-zinc-700/80 rounded-xl p-5 shadow-lg">
        <div className="mb-4">
          <h3 className="text-base font-bold text-white">Sector P&L Breakdown</h3>
          <p className="text-xs text-zinc-300 font-mono mt-0.5">
            Net profit and loss performance comparison
          </p>
        </div>

        <div className="h-[270px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="name"
                stroke="#cbd5e1"
                fontSize={12}
                tickLine={false}
                fontFamily="monospace"
              />
              <YAxis
                stroke="#cbd5e1"
                fontSize={11}
                tickLine={false}
                fontFamily="monospace"
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="GainLoss" name="Net Gain/Loss" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={entry.GainLoss >= 0 ? '#10b981' : '#f43f5e'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-zinc-800 text-xs font-mono font-medium">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Profit Sector</span>
          </div>
          <div className="flex items-center gap-2 text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Loss Sector</span>
          </div>
        </div>
      </div>
    </div>
  );
};
