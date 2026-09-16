'use client';

import React, { useMemo, useState } from 'react';
import { StockHolding } from '@/types/portfolio';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { ArrowUpDown, Info } from 'lucide-react';

interface PortfolioTableProps {
  holdings: StockHolding[];
  totalPortfolioInvestment: number;
  onSelectStock: (stock: StockHolding) => void;
}

const columnHelper = createColumnHelper<StockHolding>();

export const PortfolioTable: React.FC<PortfolioTableProps> = ({
  holdings,
  totalPortfolioInvestment,
  onSelectStock,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            Particulars (Stock Name)
            <ArrowUpDown className="h-3 w-3 opacity-60" />
          </button>
        ),
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-zinc-100">{row.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {row.sector}
              </span>
            </div>
          );
        },
      }),

      columnHelper.accessor('purchasePrice', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-white transition-colors justify-end w-full"
          >
            Purchase Price
            <ArrowUpDown className="h-3 w-3 opacity-60" />
          </button>
        ),
        cell: (info) => (
          <div className="text-right font-mono text-zinc-200">
            {formatCurrency(info.getValue())}
          </div>
        ),
      }),

      columnHelper.accessor('quantity', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-white transition-colors justify-end w-full"
          >
            Quantity (Qty)
            <ArrowUpDown className="h-3 w-3 opacity-60" />
          </button>
        ),
        cell: (info) => <div className="text-right font-mono text-zinc-300">{info.getValue()}</div>,
      }),

      columnHelper.accessor((row) => row.purchasePrice * row.quantity, {
        id: 'investment',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-white transition-colors justify-end w-full"
          >
            Investment
            <ArrowUpDown className="h-3 w-3 opacity-60" />
          </button>
        ),
        cell: (info) => (
          <div className="text-right font-mono text-zinc-100 font-semibold">
            {formatCurrency(info.getValue())}
          </div>
        ),
      }),

      columnHelper.accessor(
        (row) => (totalPortfolioInvestment ? ((row.purchasePrice * row.quantity) / totalPortfolioInvestment) * 100 : 0),
        {
          id: 'portfolioWeight',
          header: ({ column }) => (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="flex items-center gap-1 hover:text-white transition-colors justify-end w-full"
            >
              Portfolio (%)
              <ArrowUpDown className="h-3 w-3 opacity-60" />
            </button>
          ),
          cell: (info) => {
            const pct = info.getValue();
            return (
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-xs text-zinc-200">{pct.toFixed(2)}%</span>
                <div className="w-14 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${Math.min(pct * 10, 100)}%` }}
                  />
                </div>
              </div>
            );
          },
        }
      ),

      columnHelper.accessor('symbol', {
        header: 'NSE/BSE',
        cell: (info) => (
          <div className="text-center font-mono text-[11px] text-zinc-300">
            {info.getValue() || '—'}
          </div>
        ),
      }),

      columnHelper.accessor('cmp', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-white transition-colors justify-end w-full"
          >
            CMP (Yahoo)
            <ArrowUpDown className="h-3 w-3 opacity-60" />
          </button>
        ),
        cell: (info) => {
          const row = info.row.original;
          const priceChange = row.priceChange || 0;
          const isUp = priceChange >= 0;

          return (
            <div className="text-right font-mono">
              <div className="font-semibold text-white">{formatCurrency(row.cmp)}</div>
              {priceChange !== 0 && (
                <div
                  className={`text-[10px] ${
                    isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isUp ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)} ({row.priceChangePct?.toFixed(2)}%)
                </div>
              )}
            </div>
          );
        },
      }),

      columnHelper.accessor((row) => row.cmp * row.quantity, {
        id: 'presentValue',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-white transition-colors justify-end w-full"
          >
            Present Value
            <ArrowUpDown className="h-3 w-3 opacity-60" />
          </button>
        ),
        cell: (info) => (
          <div className="text-right font-mono font-semibold text-white">
            {formatCurrency(info.getValue())}
          </div>
        ),
      }),

      columnHelper.accessor((row) => row.cmp * row.quantity - row.purchasePrice * row.quantity, {
        id: 'gainLoss',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-white transition-colors justify-end w-full"
          >
            Gain / Loss
            <ArrowUpDown className="h-3 w-3 opacity-60" />
          </button>
        ),
        cell: (info) => {
          const gainLoss = info.getValue();
          const investment = info.row.original.purchasePrice * info.row.original.quantity;
          const pct = investment ? (gainLoss / investment) * 100 : 0;
          const isGain = gainLoss >= 0;

          return (
            <div className="text-right font-mono">
              <div
                className={`font-semibold text-xs ${
                  isGain ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isGain ? '+' : ''}
                {formatCurrency(gainLoss)}
              </div>
              <div
                className={`text-[10px] ${
                  isGain ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                ({isGain ? '+' : ''}
                {pct.toFixed(2)}%)
              </div>
            </div>
          );
        },
      }),

      columnHelper.accessor('peRatio', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-white transition-colors justify-end w-full"
          >
            P/E Ratio (Google)
            <ArrowUpDown className="h-3 w-3 opacity-60" />
          </button>
        ),
        cell: (info) => {
          const val = info.getValue();
          return (
            <div className="text-right font-mono text-zinc-300 text-xs">
              {val !== null && val !== undefined ? val.toFixed(2) : '—'}
            </div>
          );
        },
      }),

      columnHelper.accessor('latestEarnings', {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-white transition-colors justify-end w-full"
          >
            Latest Earnings (Google)
            <ArrowUpDown className="h-3 w-3 opacity-60" />
          </button>
        ),
        cell: (info) => {
          const val = info.getValue();
          return (
            <div className="text-right font-mono text-zinc-300 text-xs">
              {val !== null && val !== undefined ? `₹${val.toFixed(2)}` : '—'}
            </div>
          );
        },
      }),

      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectStock(info.row.original);
            }}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="View Stock Details"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        ),
      }),
    ],
    [totalPortfolioInvestment, onSelectStock]
  );

  const table = useReactTable({
    data: holdings,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-[#12151c] border border-zinc-700/80 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-[#181b22] border-b border-zinc-700 text-zinc-300 uppercase tracking-wider font-mono text-[10px]">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3.5 py-3 whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const stock = row.original;
                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectStock(stock)}
                    className="hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3.5 py-2.5 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-zinc-400 font-mono">
                  No matching holdings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
