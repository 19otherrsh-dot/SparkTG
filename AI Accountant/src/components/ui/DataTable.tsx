'use client';

import React from 'react';
import GlassCard from './GlassCard';

interface Column {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: Record<string, unknown>, index: number) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  onRowClick?: (row: Record<string, unknown>, index: number) => void;
  emptyMessage?: string;
  className?: string;
  maxHeight?: string;
  stickyHeader?: boolean;
}

function getCellAlignment(align?: 'left' | 'center' | 'right'): string {
  switch (align) {
    case 'right':
      return 'text-right';
    case 'center':
      return 'text-center';
    default:
      return 'text-left';
  }
}

export default function DataTable({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data available',
  className = '',
  maxHeight,
  stickyHeader = true,
}: DataTableProps) {
  return (
    <GlassCard padding="none" className={className}>
      <div
        className={`overflow-x-auto ${maxHeight ? 'overflow-y-auto' : ''}`}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <table className="w-full min-w-full">
          {/* Header */}
          <thead>
            <tr
              className={`
                border-b border-white/10
                ${stickyHeader ? 'sticky top-0 z-10 bg-white/5 backdrop-blur-xl' : ''}
              `}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40
                    ${getCellAlignment(col.align)}
                    first:pl-6 last:pr-6
                  `}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    {/* Empty state icon */}
                    <svg
                      className="w-12 h-12 text-white/10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-sm text-white/30 font-medium">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`
                    group transition-colors duration-150
                    hover:bg-white/[0.04]
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${rowIndex % 2 === 0 ? '' : 'bg-white/[0.01]'}
                  `}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {columns.map((col) => {
                    const cellValue = row[col.key];
                    const rendered = col.render
                      ? col.render(cellValue, row, rowIndex)
                      : (cellValue as React.ReactNode);

                    return (
                      <td
                        key={col.key}
                        className={`
                          px-6 py-4 text-sm text-white/80
                          first:pl-6 last:pr-6
                          ${getCellAlignment(col.align)}
                          ${col.align === 'right' ? 'font-mono-numbers' : ''}
                          transition-colors duration-150
                          group-hover:text-white/90
                        `}
                      >
                        {rendered}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Row count footer */}
      {data.length > 0 && (
        <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-white/30">
            Showing <span className="font-mono-numbers text-white/50">{data.length}</span>{' '}
            {data.length === 1 ? 'record' : 'records'}
          </p>
        </div>
      )}
    </GlassCard>
  );
}
