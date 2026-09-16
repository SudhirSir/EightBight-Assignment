'use client';

import React from 'react';
import { Search, Filter, Layers, Table, BarChart2 } from 'lucide-react';

interface ControlsBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedSector: string;
  onSectorChange: (sector: string) => void;
  sectorsList: string[];
  viewMode: 'table' | 'sectors' | 'analytics';
  onViewModeChange: (mode: 'table' | 'sectors' | 'analytics') => void;
  totalFilteredCount: number;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedSector,
  onSectorChange,
  sectorsList,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
}) => {
  return (
    <div className="bg-[#12151c] border border-zinc-700/80 rounded-xl p-3 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search stock or symbol..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0c0e12] border border-zinc-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
          />
        </div>

        {/* Sector Filter */}
        <div className="relative min-w-[150px]">
          <select
            value={selectedSector}
            onChange={(e) => onSectorChange(e.target.value)}
            className="w-full bg-[#0c0e12] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer font-mono"
          >
            <option value="ALL">All Sectors ({sectorsList.length})</option>
            {sectorsList.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-[10px]">
            ▼
          </div>
        </div>

        {/* Count Badge */}
        <div className="text-xs font-mono text-zinc-300 bg-zinc-800/80 border border-zinc-700 px-2.5 py-1 rounded-md">
          Showing <span className="text-white font-bold">{totalFilteredCount}</span> holdings
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center p-1 bg-[#0c0e12] border border-zinc-700 rounded-lg w-full md:w-auto justify-center">
        <button
          onClick={() => onViewModeChange('table')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            viewMode === 'table'
              ? 'bg-zinc-800 text-white border border-zinc-600 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          <Table className="h-3.5 w-3.5" />
          <span>Table</span>
        </button>

        <button
          onClick={() => onViewModeChange('sectors')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            viewMode === 'sectors'
              ? 'bg-zinc-800 text-white border border-zinc-600 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Sectors</span>
        </button>

        <button
          onClick={() => onViewModeChange('analytics')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            viewMode === 'analytics'
              ? 'bg-zinc-800 text-white border border-zinc-600 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          <BarChart2 className="h-3.5 w-3.5" />
          <span>Analytics</span>
        </button>
      </div>
    </div>
  );
};
