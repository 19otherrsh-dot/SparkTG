'use client';

import React from 'react';

export function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}) {
  return (
    <div
      className={`
        relative rounded-2xl border border-white/10
        bg-white/5 backdrop-blur-xl
        ${hover ? 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5' : ''}
        ${glow ? 'shadow-lg shadow-indigo-500/10 border-indigo-500/20' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
