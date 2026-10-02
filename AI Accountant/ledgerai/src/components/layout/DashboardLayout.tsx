'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({
  children,
  title = 'Dashboard',
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center text-white">Loading LedgerAI...</div>;
  }

  // Get user initials
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'US';

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Sidebar — hidden on mobile, shown md+ */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-72 animate-slide-in-left">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area — left margin for sidebar on md+ */}
      <div className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-white/[0.06] bg-[#0a0e1a]/80 backdrop-blur-xl">
          {/* Left: Mobile menu button + Page title */}
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page title */}
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
                {title}
              </h1>
            </div>
          </div>

          {/* Right: Search + Notifications + Avatar */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className={`relative hidden sm:block transition-all duration-300 ${searchFocused ? 'w-72' : 'w-56'}`}>
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search transactions, agents..."
                className={`
                  w-full pl-9 pr-4 py-2 text-sm rounded-xl
                  bg-white/[0.04] border text-white/80
                  placeholder:text-white/25
                  focus:outline-none focus:bg-white/[0.07]
                  transition-all duration-200
                  ${searchFocused
                    ? 'border-indigo-500/50 shadow-[0_0_0_3px_rgba(99,102,241,0.1)]'
                    : 'border-white/[0.08] hover:border-white/[0.12]'
                  }
                `}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {/* Keyboard shortcut hint */}
              {!searchFocused && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-white/20 bg-white/[0.04] border border-white/[0.06] rounded">
                    ⌘
                  </kbd>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-white/20 bg-white/[0.04] border border-white/[0.06] rounded">
                    K
                  </kbd>
                </div>
              )}
            </div>

            {/* Mobile search button */}
            <button
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-white/[0.08]" />

            {/* Notification bell */}
            <button
              className="relative flex items-center justify-center w-10 h-10 rounded-xl text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification count badge */}
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full border-2 border-[#0a0e1a] shadow-lg shadow-rose-500/30">
                3
              </span>
            </button>

            {/* User avatar */}
            <button
              className="relative flex-shrink-0"
              aria-label="User menu"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white ring-2 ring-white/[0.06] hover:ring-white/[0.15] transition-all">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0e1a]" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 page-transition">
          {children}
        </main>
      </div>
    </div>
  );
}
