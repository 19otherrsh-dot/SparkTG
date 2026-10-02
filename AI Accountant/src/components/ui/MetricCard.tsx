'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import GlassCard from './GlassCard';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
  sparklineData?: number[];
  className?: string;
}

function parseNumericValue(val: string): { prefix: string; number: number; suffix: string } {
  const match = val.match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!match) return { prefix: '', number: 0, suffix: val };
  return {
    prefix: match[1],
    number: parseFloat(match[2].replace(/,/g, '')),
    suffix: match[3],
  };
}

function formatNumber(num: number, decimals: number): string {
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function Sparkline({ data, color = '#6366f1' }: { data: number[]; color?: string }) {
  if (!data || data.length < 2) return null;

  const width = 120;
  const height = 36;
  const padding = 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={`sparkGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#sparkGrad-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      {data.length > 0 && (() => {
        const lastX = padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2);
        const lastY = height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2);
        return (
          <circle cx={lastX} cy={lastY} r="3" fill={color} className="animate-pulse-dot" />
        );
      })()}
    </svg>
  );
}

export default function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  subtitle,
  sparklineData,
  className = '',
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(() => parseNumericValue(value), [value]);
  const decimals = useMemo(() => {
    const decimalPart = value.match(/\.(\d+)/);
    return decimalPart ? decimalPart[1].length : 0;
  }, [value]);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) {
      setDisplayValue(value);
      return;
    }

    if (parsed.number === 0) {
      setDisplayValue(value);
      return;
    }

    const duration = 800;
    const steps = 30;
    const stepDuration = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentNum = parsed.number * eased;
      setDisplayValue(
        `${parsed.prefix}${formatNumber(currentNum, decimals)}${parsed.suffix}`
      );

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [hasAnimated, value, parsed, decimals]);

  const changeColors: Record<string, { text: string; bg: string; icon: string }> = {
    up: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      icon: '↑',
    },
    down: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      icon: '↓',
    },
    neutral: {
      text: 'text-slate-400',
      bg: 'bg-slate-500/10',
      icon: '→',
    },
  };

  const changeStyle = changeColors[changeType];

  const sparklineColor =
    changeType === 'up' ? '#10b981' : changeType === 'down' ? '#f43f5e' : '#6366f1';

  return (
    <div ref={cardRef} className={`animate-slide-in-up ${className}`}>
      <GlassCard hover className="relative overflow-hidden gradient-border-top">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-center gap-2 mb-1">
              {icon && (
                <span className="text-lg flex-shrink-0">{icon}</span>
              )}
              <p className="text-sm font-medium text-white/50 uppercase tracking-wider truncate">
                {title}
              </p>
            </div>

            {/* Value */}
            <p className="text-3xl font-bold font-mono-numbers text-white mt-2 animate-counter">
              {displayValue}
            </p>

            {/* Change + Subtitle row */}
            <div className="flex items-center gap-3 mt-3">
              {change && (
                <span
                  className={`
                    inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                    ${changeStyle.bg} ${changeStyle.text}
                  `}
                >
                  <span className="text-[10px]">{changeStyle.icon}</span>
                  {change}
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-white/30">{subtitle}</span>
              )}
            </div>
          </div>

          {/* Sparkline */}
          {sparklineData && sparklineData.length >= 2 && (
            <div className="flex-shrink-0 ml-4 self-end pb-2">
              <Sparkline data={sparklineData} color={sparklineColor} />
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
