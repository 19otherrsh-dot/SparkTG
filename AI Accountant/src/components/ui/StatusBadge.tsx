'use client';

import React from 'react';

type StatusType = 'active' | 'pending' | 'overdue' | 'completed' | 'processing';
type BadgeSize = 'sm' | 'md';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: BadgeSize;
}

const statusConfig: Record<
  StatusType,
  { bg: string; text: string; dot: string; pulse: boolean; defaultLabel: string }
> = {
  active: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    pulse: true,
    defaultLabel: 'Active',
  },
  pending: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    pulse: false,
    defaultLabel: 'Pending',
  },
  overdue: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    dot: 'bg-rose-400',
    pulse: false,
    defaultLabel: 'Overdue',
  },
  completed: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    dot: 'bg-blue-400',
    pulse: false,
    defaultLabel: 'Completed',
  },
  processing: {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-400',
    dot: 'bg-indigo-400',
    pulse: true,
    defaultLabel: 'Processing',
  },
};

const sizeConfig: Record<BadgeSize, { container: string; dot: string; text: string }> = {
  sm: {
    container: 'px-2 py-0.5 gap-1.5',
    dot: 'w-1.5 h-1.5',
    text: 'text-xs',
  },
  md: {
    container: 'px-3 py-1 gap-2',
    dot: 'w-2 h-2',
    text: 'text-sm',
  },
};

export default function StatusBadge({
  status,
  label,
  size = 'md',
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizing = sizeConfig[size];
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${config.bg} ${config.text}
        ${sizing.container} ${sizing.text}
      `}
    >
      <span className="relative flex items-center justify-center">
        <span
          className={`${sizing.dot} rounded-full ${config.dot}`}
        />
        {config.pulse && (
          <span
            className={`
              absolute ${sizing.dot} rounded-full ${config.dot}
              animate-ping opacity-75
            `}
          />
        )}
      </span>
      {displayLabel}
    </span>
  );
}
