'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ─────────────────────────────────────────────
   Navigation Data
   ───────────────────────────────────────────── */
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  status?: 'active' | 'processing' | 'idle';
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      {
        label: 'Dashboard',
        href: '/',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        ),
      },
      {
        label: 'AI Chat',
        href: '/chat',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'AI Agents',
    items: [
      {
        label: 'Bookkeeper',
        href: '/agents/bookkeeper',
        status: 'active',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      },
      {
        label: 'Tax',
        href: '/agents/tax',
        status: 'active',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        label: 'Compliance',
        href: '/agents/compliance',
        status: 'active',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
      {
        label: 'Payroll',
        href: '/agents/payroll',
        status: 'processing',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
      {
        label: 'Audit',
        href: '/agents/audit',
        status: 'active',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
      },
      {
        label: 'CFO',
        href: '/agents/cfo',
        status: 'idle',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        label: 'Fundraising',
        href: '/agents/fundraising',
        status: 'idle',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        label: 'Integrations',
        href: '/integrations',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        ),
      },
      {
        label: 'Settings',
        href: '/settings',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
    ],
  },
];

/* ─────────────────────────────────────────────
   Status Dot Component
   ───────────────────────────────────────────── */
function StatusDot({ status }: { status?: 'active' | 'processing' | 'idle' }) {
  if (!status) return null;

  const colorMap: Record<string, string> = {
    active: 'bg-emerald-400',
    processing: 'bg-amber-400',
    idle: 'bg-slate-500',
  };

  return (
    <span className="relative flex h-2 w-2">
      <span className={`h-2 w-2 rounded-full ${colorMap[status]}`} />
      {(status === 'active' || status === 'processing') && (
        <span
          className={`absolute inset-0 rounded-full ${colorMap[status]} animate-ping opacity-75`}
        />
      )}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Sidebar Component
   ───────────────────────────────────────────── */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col fixed left-0 top-0 h-screen z-40
          bg-white/[0.03] backdrop-blur-2xl
          border-r border-white/[0.08]
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-white/[0.06] flex-shrink-0 ${collapsed ? 'px-4 justify-center' : 'px-6'}`}>
          <Link href="/" className="flex items-center gap-3 min-w-0">
            {/* Logo icon */}
            <div className="relative flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-lg font-bold tracking-tight gradient-text leading-tight">
                  LedgerAI
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
                  Finance OS
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className={sIdx > 0 ? 'mt-4' : ''}>
              {/* Section title */}
              {section.title && !collapsed && (
                <div className="px-6 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                    {section.title}
                  </p>
                </div>
              )}
              {section.title && collapsed && (
                <div className="px-4 py-2 flex justify-center">
                  <div className="w-6 h-px bg-white/10 rounded-full" />
                </div>
              )}

              {/* Items */}
              <div className="space-y-0.5 px-3">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`
                        group relative flex items-center gap-3 rounded-xl
                        transition-all duration-200
                        ${collapsed ? 'justify-center px-3 py-3' : 'px-3 py-2.5'}
                        ${
                          isActive
                            ? 'bg-indigo-500/10 text-white'
                            : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                        }
                      `}
                    >
                      {/* Active indicator — gradient left border */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-indigo-400 to-indigo-600" />
                      )}

                      {/* Icon */}
                      <span
                        className={`
                          flex-shrink-0 transition-colors duration-200
                          ${isActive ? 'text-indigo-400' : 'text-white/40 group-hover:text-white/70'}
                        `}
                      >
                        {item.icon}
                      </span>

                      {/* Label + Status */}
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-sm font-medium truncate">
                            {item.label}
                          </span>
                          {item.status && <StatusDot status={item.status} />}
                        </>
                      )}

                      {/* Tooltip for collapsed mode */}
                      {collapsed && (
                        <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-xs text-white font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-xl">
                          {item.label}
                          {item.status && (
                            <span className="ml-2 inline-block">
                              <StatusDot status={item.status} />
                            </span>
                          )}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section: User + Collapse */}
        <div className="flex-shrink-0 border-t border-white/[0.06]">
          {/* User info */}
          <div className={`flex items-center gap-3 ${collapsed ? 'px-4 py-3 justify-center' : 'px-5 py-4'}`}>
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                RS
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0e1a]" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white/90 truncate">
                  Rahul Sharma
                </p>
                <p className="text-[11px] text-white/30 truncate">
                  SparkTG Pvt. Ltd.
                </p>
              </div>
            )}
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              w-full flex items-center gap-2 border-t border-white/[0.04]
              text-white/30 hover:text-white/60 hover:bg-white/[0.03]
              transition-all duration-200
              ${collapsed ? 'justify-center px-3 py-3' : 'px-5 py-3'}
            `}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!collapsed && (
              <span className="text-xs font-medium">Collapse</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
