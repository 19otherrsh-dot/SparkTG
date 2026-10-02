'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'indigo' | 'emerald' | 'amber' | 'rose' | string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  as?: React.ElementType;
  onClick?: () => void;
}

const paddingMap: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
  xl: 'p-8',
};

const glowMap: Record<string, string> = {
  indigo: 'shadow-[0_0_20px_rgba(99,102,241,0.3),0_0_60px_rgba(99,102,241,0.1)]',
  emerald: 'shadow-[0_0_20px_rgba(16,185,129,0.3),0_0_60px_rgba(16,185,129,0.1)]',
  amber: 'shadow-[0_0_20px_rgba(245,158,11,0.3),0_0_60px_rgba(245,158,11,0.1)]',
  rose: 'shadow-[0_0_20px_rgba(244,63,94,0.3),0_0_60px_rgba(244,63,94,0.1)]',
};

export default function GlassCard({
  children,
  className = '',
  hover = false,
  glow,
  padding = 'md',
  as: Component = 'div',
  onClick,
}: GlassCardProps) {
  const baseStyles =
    'bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10';

  const hoverStyles = hover
    ? 'hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-250 cursor-pointer'
    : 'transition-all duration-250';

  const glowStyle = glow ? glowMap[glow] || '' : '';

  const pad = paddingMap[padding] || paddingMap.md;

  return (
    <Component
      className={`${baseStyles} ${hoverStyles} ${glowStyle} ${pad} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
