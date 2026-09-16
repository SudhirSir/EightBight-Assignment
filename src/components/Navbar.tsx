'use client';

import React from 'react';
import { RefreshCw, Activity } from 'lucide-react';

interface NavbarProps {
  lastRefreshed: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: () => void;
  countdown: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  lastRefreshed,
  isRefreshing,
  onRefresh,
  autoRefreshEnabled,
  onToggleAutoRefresh,
  countdown,
}) => {
  const formattedTime = lastRefreshed
    ? new Date(lastRefreshed).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '—';

  return (
    <header className="border-b border-zinc-800/80 bg-[#12151c] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-emerald-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-100 tracking-tight">
                OctaByte Portfolio Terminal
              </h1>
              <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Yahoo Finance & Google Finance Real-Time Feeds
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 text-xs">
          {/* Timer status */}
          <div className="hidden sm:flex items-center gap-2 text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-md font-mono">
            <span
              className={`h-2 w-2 rounded-full ${
                autoRefreshEnabled ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'
              }`}
            />
            <span>Refresh in:</span>
            <span className="text-zinc-200 font-bold min-w-[24px]">
              {autoRefreshEnabled ? `${countdown}s` : 'OFF'}
            </span>
          </div>

          {/* Auto Refresh Toggle */}
          <button
            onClick={onToggleAutoRefresh}
            className={`px-3 py-1.5 rounded-md font-medium border transition-colors ${
              autoRefreshEnabled
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {autoRefreshEnabled ? 'Auto 15s' : 'Auto Paused'}
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-medium px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Updating...' : 'Sync Now'}</span>
          </button>

          {/* Last updated */}
          <div className="hidden lg:block text-[11px] text-zinc-500 font-mono border-l border-zinc-800 pl-3">
            Last update: <span className="text-zinc-300">{formattedTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
