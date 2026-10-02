'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GlassCard from '@/components/ui/GlassCard';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import AgentHeader from '@/components/ui/AgentHeader';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// Cash runway projections — 18 months
const runwayData = [
  { month: 'Jul 26', optimistic: 124, base: 124, conservative: 124 },
  { month: 'Aug 26', optimistic: 127, base: 121, conservative: 118 },
  { month: 'Sep 26', optimistic: 131, base: 118, conservative: 112 },
  { month: 'Oct 26', optimistic: 136, base: 116, conservative: 106 },
  { month: 'Nov 26', optimistic: 140, base: 113, conservative: 100 },
  { month: 'Dec 26', optimistic: 145, base: 111, conservative: 94 },
  { month: 'Jan 27', optimistic: 149, base: 108, conservative: 88 },
  { month: 'Feb 27', optimistic: 153, base: 106, conservative: 82 },
  { month: 'Mar 27', optimistic: 157, base: 104, conservative: 76 },
  { month: 'Apr 27', optimistic: 160, base: 102, conservative: 68 },
  { month: 'May 27', optimistic: 163, base: 100, conservative: 60 },
  { month: 'Jun 27', optimistic: 166, base: 97, conservative: 52 },
  { month: 'Jul 27', optimistic: 169, base: 95, conservative: 44 },
  { month: 'Aug 27', optimistic: 172, base: 93, conservative: 36 },
  { month: 'Sep 27', optimistic: 174, base: 91, conservative: 28 },
  { month: 'Oct 27', optimistic: 176, base: 89, conservative: 22 },
  { month: 'Nov 27', optimistic: 178, base: 87, conservative: 20 },
  { month: 'Dec 27', optimistic: 180, base: 85, conservative: 20 },
];

// Budget vs Actual
const budgetData = [
  { category: 'Salaries', budget: 18.5, actual: 18.52, color: '#10b981' },
  { category: 'Infrastructure', budget: 3.5, actual: 3.8, color: '#f43f5e' },
  { category: 'Marketing', budget: 4.0, actual: 4.88, color: '#f43f5e' },
  { category: 'Operations', budget: 2.5, actual: 2.2, color: '#10b981' },
  { category: 'R&D', budget: 5.0, actual: 4.6, color: '#10b981' },
  { category: 'Misc', budget: 1.5, actual: 1.35, color: '#10b981' },
];

const insights = [
  {
    icon: '💡',
    text: "Revenue is growing 12.3% MoM. At this rate, you'll hit ₹5Cr ARR by March 2027.",
    border: 'border-l-indigo-500',
    bg: 'bg-indigo-500/5',
  },
  {
    icon: '⚠️',
    text: 'Marketing spend increased 22% but CAC only improved 8%. Consider optimizing ad channels.',
    border: 'border-l-amber-500',
    bg: 'bg-amber-500/5',
  },
  {
    icon: '✅',
    text: 'Operating expenses are 3.2% below budget. Great cost discipline this month.',
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-500/5',
  },
  {
    icon: '📊',
    text: 'Your burn multiple is 1.8x — efficient for a Series A stage startup.',
    border: 'border-l-purple-500',
    bg: 'bg-purple-500/5',
  },
];

const profitabilityData = [
  {
    client: 'TechCorp Solutions',
    revenue: '₹12,40,000',
    cost: '₹3,10,000',
    profit: '₹9,30,000',
    margin: '75.0%',
  },
  {
    client: 'GlobalRetail India',
    revenue: '₹8,60,000',
    cost: '₹2,58,000',
    profit: '₹6,02,000',
    margin: '70.0%',
  },
  {
    client: 'FinServe Pro',
    revenue: '₹6,80,000',
    cost: '₹1,36,000',
    profit: '₹5,44,000',
    margin: '80.0%',
  },
  {
    client: 'HealthFirst AI',
    revenue: '₹5,20,000',
    cost: '₹2,34,000',
    profit: '₹2,86,000',
    margin: '55.0%',
  },
  {
    client: 'EduStack (Pilot)',
    revenue: '₹2,40,000',
    cost: '₹1,92,000',
    profit: '₹48,000',
    margin: '20.0%',
  },
  {
    client: 'LogiTrack Systems',
    revenue: '₹7,10,000',
    cost: '₹2,49,000',
    profit: '₹4,61,000',
    margin: '64.9%',
  },
];

const profitabilityColumns = [
  { key: 'client', label: 'Client / Project' },
  { key: 'revenue', label: 'Revenue', align: 'right' as const },
  { key: 'cost', label: 'Cost', align: 'right' as const },
  { key: 'profit', label: 'Profit', align: 'right' as const },
  { key: 'margin', label: 'Margin %', align: 'right' as const },
];

const CustomRunwayTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
      <p className="text-sm font-semibold text-white mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-400">{entry.name}:</span>
          <span className="font-mono font-semibold text-white">₹{entry.value}L</span>
        </div>
      ))}
    </div>
  );
};

export default function CFOPage() {
  const [activeScenario, setActiveScenario] = useState<'all' | 'optimistic' | 'base' | 'conservative'>('all');

  return (
    <DashboardLayout title="CFO Agent">
      <div className="space-y-6">
        {/* Agent Header */}
        <AgentHeader
          icon="🧠"
          name="CFO Agent"
          status="active"
          description="Provides strategic financial insights, forecasting, budgeting, and profitability analysis"
          lastRun="20 Jun 2026, 08:00 AM"
          taskCount={8}
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Monthly Burn Rate"
            value="₹8.67L"
            change="-3.2%"
            changeType="down"
            icon="🔥"
            sparklineData={[9.8, 9.5, 9.2, 9.0, 8.9, 8.67]}
          />
          <MetricCard
            title="Gross Margin"
            value="72.4%"
            change="+1.8%"
            changeType="up"
            icon="📈"
            sparklineData={[66.2, 67.8, 69.1, 70.3, 71.0, 72.4]}
          />
          <MetricCard
            title="Revenue Growth"
            value="12.3%"
            change="MoM"
            changeType="up"
            icon="🚀"
            sparklineData={[8.1, 9.4, 10.2, 11.0, 11.8, 12.3]}
          />
          <MetricCard
            title="Cash Runway"
            value="14.3 mo"
            change="+0.8mo"
            changeType="up"
            icon="🏦"
            sparklineData={[11.2, 12.0, 12.8, 13.2, 13.5, 14.3]}
          />
        </div>

        {/* Cash Runway Projector */}
        <GlassCard>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Cash Runway Projector</h3>
                <p className="text-sm text-slate-400 mt-1">18-month forecast across three scenarios (in Lakhs)</p>
              </div>
              <div className="flex gap-2 mt-3 sm:mt-0">
                {[
                  { key: 'all' as const, label: 'All', color: 'text-white' },
                  { key: 'optimistic' as const, label: 'Optimistic', color: 'text-emerald-400' },
                  { key: 'base' as const, label: 'Base Case', color: 'text-indigo-400' },
                  { key: 'conservative' as const, label: 'Conservative', color: 'text-amber-400' },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveScenario(s.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeScenario === s.key
                        ? 'bg-white/10 border border-white/20 ' + s.color
                        : 'bg-white/5 text-slate-500 border border-transparent hover:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={runwayData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} interval={2} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v}L`} />
                  <Tooltip content={<CustomRunwayTooltip />} />
                  {(activeScenario === 'all' || activeScenario === 'optimistic') && (
                    <Area
                      type="monotone"
                      dataKey="optimistic"
                      name="Optimistic"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#optGrad)"
                    />
                  )}
                  {(activeScenario === 'all' || activeScenario === 'base') && (
                    <Area
                      type="monotone"
                      dataKey="base"
                      name="Base Case"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fill="url(#baseGrad)"
                    />
                  )}
                  {(activeScenario === 'all' || activeScenario === 'conservative') && (
                    <Area
                      type="monotone"
                      dataKey="conservative"
                      name="Conservative"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fill="url(#consGrad)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Runway exhaustion indicator */}
            <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <span className="text-amber-400 text-lg">⚠️</span>
              <p className="text-sm text-amber-300">
                <span className="font-semibold">Conservative scenario:</span> Cash runs critically low (~₹20L) by Nov 2027. 
                Fundraising or revenue acceleration recommended before Q3 2027.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Budget vs Actual */}
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-1">Budget vs Actual — June 2026</h3>
            <p className="text-sm text-slate-400 mb-5">Comparison of budgeted vs actual spend by category (in Lakhs)</p>
            <div className="space-y-5">
              {budgetData.map((item) => {
                const variance = ((item.actual - item.budget) / item.budget) * 100;
                const isOver = item.actual > item.budget;
                return (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300 w-28">{item.category}</span>
                      <div className="flex-1 mx-4">
                        <div className="relative h-7">
                          {/* Budget bar (background) */}
                          <div
                            className="absolute inset-y-0 left-0 bg-white/5 rounded-md"
                            style={{ width: `${(item.budget / 20) * 100}%` }}
                          />
                          {/* Actual bar (foreground) */}
                          <div
                            className={`absolute inset-y-0 left-0 rounded-md transition-all duration-700 ${
                              isOver ? 'bg-rose-500/30' : 'bg-emerald-500/30'
                            }`}
                            style={{ width: `${(item.actual / 20) * 100}%` }}
                          />
                          {/* Budget label */}
                          <div
                            className="absolute inset-y-0 flex items-center"
                            style={{ left: `${(item.budget / 20) * 100}%` }}
                          >
                            <div className="w-0.5 h-full bg-slate-500/50" />
                          </div>
                          {/* Values inside bar */}
                          <div className="absolute inset-0 flex items-center px-3">
                            <span className="text-xs font-mono text-white/70">
                              ₹{item.actual}L / ₹{item.budget}L
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-mono font-semibold w-16 text-right ${
                          isOver ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {isOver ? '+' : ''}
                        {variance.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-white/10" />
                  <span className="text-xs text-slate-400">Budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500/30" />
                  <span className="text-xs text-slate-400">Under Budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-rose-500/30" />
                  <span className="text-xs text-slate-400">Over Budget</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-slate-400">Total: </span>
                <span className="font-mono font-semibold text-white">₹35.35L</span>
                <span className="text-xs text-slate-500"> / ₹35.0L budget</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* AI Financial Insights */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">🤖 AI Financial Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, i) => (
              <GlassCard key={i} hover>
                <div className={`p-5 border-l-4 ${insight.border} ${insight.bg} rounded-r-xl`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{insight.icon}</span>
                    <p className="text-sm text-slate-200 leading-relaxed">{insight.text}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Profitability by Client */}
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Profitability by Client / Project</h3>
                <p className="text-sm text-slate-400 mt-1">Revenue, cost, and margin analysis for active clients</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
                Avg Margin: 60.8%
              </span>
            </div>
            <DataTable columns={profitabilityColumns} data={profitabilityData} />
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Total Revenue</p>
                <p className="text-lg font-mono font-bold text-white">₹42.50L</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Total Cost</p>
                <p className="text-lg font-mono font-bold text-slate-400">₹13.79L</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Total Profit</p>
                <p className="text-lg font-mono font-bold text-emerald-400">₹28.71L</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Activity Feed */}
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">CFO Agent Activity</h3>
            <div className="space-y-4">
              {[
                { time: '1 hour ago', event: 'Monthly financial dashboard refreshed with June data', icon: '📊', color: 'text-indigo-400' },
                { time: '3 hours ago', event: 'Cash runway projections updated — 3 scenarios recalculated', icon: '📈', color: 'text-emerald-400' },
                { time: '6 hours ago', event: 'Budget variance alert: Marketing 22% over budget', icon: '⚠️', color: 'text-amber-400' },
                { time: 'Yesterday', event: 'Client profitability report generated for board review', icon: '📋', color: 'text-indigo-400' },
                { time: '2 days ago', event: 'Burn multiple calculated at 1.8x — healthy range confirmed', icon: '✅', color: 'text-emerald-400' },
                { time: '3 days ago', event: 'Revenue forecast updated: ₹5Cr ARR projected for Mar 2027', icon: '🎯', color: 'text-purple-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">{item.event}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
