'use client';

import React from 'react';
import StatusBadge from './StatusBadge';

interface AgentHeaderProps {
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'processing' | 'idle';
  lastRun?: string;
  taskCount?: number;
  className?: string;
}

const statusToBadge: Record<string, 'active' | 'processing' | 'pending'> = {
  active: 'active',
  processing: 'processing',
  idle: 'pending',
};

const statusGradients: Record<string, string> = {
  active: 'from-emerald-500/20 to-emerald-500/5',
  processing: 'from-indigo-500/20 to-indigo-500/5',
  idle: 'from-slate-500/20 to-slate-500/5',
};

const iconGradients: Record<string, string> = {
  active: 'from-emerald-500/30 via-emerald-400/20 to-transparent',
  processing: 'from-indigo-500/30 via-indigo-400/20 to-transparent',
  idle: 'from-slate-500/30 via-slate-400/20 to-transparent',
};

export default function AgentHeader({
  name,
  description,
  icon,
  status,
  lastRun,
  taskCount,
  className = '',
}: AgentHeaderProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/5 backdrop-blur-xl border border-white/10
        ${className}
      `}
    >
      {/* Background gradient based on status */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-r ${statusGradients[status]}
          pointer-events-none
        `}
      />

      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60" />

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div
              className={`
                w-16 h-16 md:w-20 md:h-20 rounded-2xl
                bg-gradient-to-br ${iconGradients[status]}
                border border-white/10
                flex items-center justify-center
                text-3xl md:text-4xl
                ${status === 'processing' ? 'animate-glow-pulse' : ''}
              `}
            >
              {icon}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {name}
              </h1>
              <StatusBadge
                status={statusToBadge[status]}
                label={status === 'idle' ? 'Idle' : undefined}
              />
            </div>

            <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-2xl">
              {description}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4">
              {lastRun && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs text-white/40">
                    Last run:{' '}
                    <span className="text-white/60 font-medium">{lastRun}</span>
                  </span>
                </div>
              )}

              {typeof taskCount === 'number' && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  <span className="text-xs text-white/40">
                    Tasks completed today:{' '}
                    <span className="text-white/60 font-medium font-mono-numbers">
                      {taskCount}
                    </span>
                  </span>
                </div>
              )}

              {/* AI Confidence indicator */}
              {status === 'active' && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <div
                        key={bar}
                        className={`
                          w-1 rounded-full bg-emerald-400
                          ${bar <= 4 ? 'opacity-100' : 'opacity-30'}
                        `}
                        style={{ height: `${8 + bar * 2}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/40">
                    Confidence:{' '}
                    <span className="text-emerald-400 font-medium font-mono-numbers">
                      High
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
