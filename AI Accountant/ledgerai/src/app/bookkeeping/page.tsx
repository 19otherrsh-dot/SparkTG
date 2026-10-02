'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GlassCard from '@/components/ui/GlassCard';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import AgentHeader from '@/components/ui/AgentHeader';

const sparklineProcessed = [980, 1020, 1050, 1100, 1080, 1150, 1190, 1210, 1230, 1247];
const sparklineCategorized = [95.1, 95.8, 96.2, 96.9, 97.1, 97.5, 97.8, 97.9, 98.0, 98.2];
const sparklineReconciliation = [98.1, 98.4, 98.6, 98.9, 99.0, 99.1, 99.0, 99.2, 99.3, 99.4];
const sparklinePending = [28, 25, 22, 19, 18, 15, 14, 13, 12, 12];

const transactionData = [
  { date: '2026-06-19', description: 'Razorpay Settlement — Online Sales', category: 'Revenue', debit: '', credit: '₹4,85,230', balance: '₹28,45,670', status: 'Auto-categorized', categoryColor: 'emerald' },
  { date: '2026-06-19', description: 'AWS India — Cloud Infrastructure', category: 'Infrastructure', debit: '₹1,24,500', credit: '', balance: '₹27,21,170', status: 'Auto-categorized', categoryColor: 'blue' },
  { date: '2026-06-18', description: 'Google Ads — Performance Campaign', category: 'Marketing', debit: '₹78,400', credit: '', balance: '₹26,42,770', status: 'Auto-categorized', categoryColor: 'purple' },
  { date: '2026-06-18', description: 'Salary Disbursement — June 2026', category: 'Salary', debit: '₹12,50,000', credit: '', balance: '₹13,92,770', status: 'Auto-categorized', categoryColor: 'indigo' },
  { date: '2026-06-17', description: 'Zomato Corporate — Team Meals', category: 'Travel', debit: '₹12,840', credit: '', balance: '₹13,79,930', status: 'Auto-categorized', categoryColor: 'amber' },
  { date: '2026-06-17', description: 'Client Invoice — TechCorp Solutions', category: 'Revenue', debit: '', credit: '₹8,50,000', balance: '₹22,29,930', status: 'Auto-categorized', categoryColor: 'emerald' },
  { date: '2026-06-16', description: 'Regus — Office Rent Q2', category: 'Rent', debit: '₹3,75,000', credit: '', balance: '₹18,54,930', status: 'Auto-categorized', categoryColor: 'rose' },
  { date: '2026-06-16', description: 'Tata Power — Electricity Bill', category: 'Utilities', debit: '₹18,450', credit: '', balance: '₹18,36,480', status: 'Auto-categorized', categoryColor: 'cyan' },
  { date: '2026-06-15', description: 'Swiggy Corporate — Client Lunch', category: 'Travel', debit: '₹4,280', credit: '', balance: '₹18,32,200', status: 'Manual Review', categoryColor: 'amber' },
  { date: '2026-06-15', description: 'Deloitte India — Audit Services', category: 'Professional Services', debit: '₹2,50,000', credit: '', balance: '₹15,82,200', status: 'Auto-categorized', categoryColor: 'teal' },
  { date: '2026-06-14', description: 'Stripe India — Payment Gateway', category: 'Revenue', debit: '', credit: '₹3,22,100', balance: '₹19,04,300', status: 'Auto-categorized', categoryColor: 'emerald' },
  { date: '2026-06-14', description: 'AWS India — Reserved Instances', category: 'Infrastructure', debit: '₹24,500', credit: '', balance: '₹18,79,800', status: 'Flagged', categoryColor: 'blue' },
  { date: '2026-06-13', description: 'LinkedIn Ads — Recruitment Campaign', category: 'Marketing', debit: '₹45,000', credit: '', balance: '₹18,34,800', status: 'Auto-categorized', categoryColor: 'purple' },
  { date: '2026-06-13', description: 'Contractor Payment — Priya Sharma', category: 'Professional Services', debit: '₹1,20,000', credit: '', balance: '₹17,14,800', status: 'Manual Review', categoryColor: 'teal' },
  { date: '2026-06-12', description: 'Jio Business — Internet & Telecom', category: 'Utilities', debit: '₹8,999', credit: '', balance: '₹17,05,801', status: 'Auto-categorized', categoryColor: 'cyan' },
];

const transactionColumns = [
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description' },
  { key: 'category', label: 'Category' },
  { key: 'debit', label: 'Debit (₹)', align: 'right' as const },
  { key: 'credit', label: 'Credit (₹)', align: 'right' as const },
  { key: 'balance', label: 'Balance', align: 'right' as const },
  { key: 'status', label: 'Status' },
];

const activityTimeline = [
  { time: '2 min ago', action: 'Auto-categorized 47 new transactions', icon: '🤖', color: 'emerald' },
  { time: '1 hour ago', action: 'Reconciled HDFC bank statement (Jun 1–19)', icon: '✅', color: 'emerald' },
  { time: '3 hours ago', action: 'Flagged duplicate entry: ₹24,500 (AWS)', icon: '🚩', color: 'rose' },
  { time: 'Yesterday', action: 'Created journal entries for Q1 depreciation', icon: '📝', color: 'indigo' },
  { time: '2 days ago', action: 'Generated trial balance — all accounts balanced', icon: '📊', color: 'blue' },
];

const categoryColorMap: Record<string, string> = {
  emerald: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  indigo: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
  amber: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  rose: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  teal: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
};

const statusStyleMap: Record<string, string> = {
  'Auto-categorized': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  'Manual Review': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  'Flagged': 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
};

export default function BookkeepingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const matched = 1235;
  const unmatched = 8;
  const flagged = 4;
  const total = matched + unmatched + flagged;

  const filteredTransactions = selectedCategory
    ? transactionData.filter(t => t.category === selectedCategory)
    : transactionData;

  const tableData = filteredTransactions.map(t => ({
    date: t.date,
    description: t.description,
    category: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColorMap[t.categoryColor]}`}>
        {t.category}
      </span>
    ),
    debit: t.debit ? <span className="font-mono text-rose-400">{t.debit}</span> : <span className="text-slate-600">—</span>,
    credit: t.credit ? <span className="font-mono text-emerald-400">{t.credit}</span> : <span className="text-slate-600">—</span>,
    balance: <span className="font-mono text-slate-200">{t.balance}</span>,
    status: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyleMap[t.status]}`}>
        {t.status}
      </span>
    ),
  }));

  const categories = [...new Set(transactionData.map(t => t.category))];

  return (
    <DashboardLayout title="Bookkeeper Agent">
      {/* Agent Header */}
      <AgentHeader
        icon="📚"
        name="Bookkeeper Agent"
        status="active"
        description="Automatically categorizes transactions, creates ledgers, and reconciles entries"
        lastRun="2 minutes ago"
        taskCount={47}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <MetricCard
          title="Transactions Processed"
          value="1,247"
          change="+8.3%"
          changeType="up"
          icon="📊"
          sparklineData={sparklineProcessed}
        />
        <MetricCard
          title="Auto-Categorized"
          value="98.2%"
          change="+1.1%"
          changeType="up"
          icon="🤖"
          sparklineData={sparklineCategorized}
        />
        <MetricCard
          title="Reconciliation Rate"
          value="99.4%"
          change="+0.3%"
          changeType="up"
          icon="✅"
          sparklineData={sparklineReconciliation}
        />
        <MetricCard
          title="Pending Review"
          value="12"
          change="items"
          changeType="neutral"
          icon="⏳"
          sparklineData={sparklinePending}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Transaction Ledger — spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-xl">📒</span> Transaction Ledger
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === null
                      ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                        : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <DataTable columns={transactionColumns} data={tableData} />
          </GlassCard>

          {/* Reconciliation Summary */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-5">
              <span className="text-xl">🔄</span> Reconciliation Summary
            </h2>

            {/* Progress bar */}
            <div className="w-full h-4 rounded-full overflow-hidden bg-slate-700/50 mb-6">
              <div className="h-full flex">
                <div
                  className="bg-emerald-500 transition-all duration-1000"
                  style={{ width: `${(matched / total) * 100}%` }}
                />
                <div
                  className="bg-amber-500 transition-all duration-1000"
                  style={{ width: `${(unmatched / total) * 100}%` }}
                />
                <div
                  className="bg-rose-500 transition-all duration-1000"
                  style={{ width: `${(flagged / total) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Matched */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold font-mono text-emerald-400">{matched.toLocaleString()}</div>
                <div className="text-sm text-emerald-300/70 mt-1">Matched</div>
                <div className="text-xs text-emerald-400/60 mt-0.5">{((matched / total) * 100).toFixed(1)}%</div>
              </div>
              {/* Unmatched */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold font-mono text-amber-400">{unmatched}</div>
                <div className="text-sm text-amber-300/70 mt-1">Unmatched</div>
                <div className="text-xs text-amber-400/60 mt-0.5">{((unmatched / total) * 100).toFixed(1)}%</div>
              </div>
              {/* Flagged */}
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold font-mono text-rose-400">{flagged}</div>
                <div className="text-sm text-rose-300/70 mt-1">Flagged</div>
                <div className="text-xs text-rose-400/60 mt-0.5">{((flagged / total) * 100).toFixed(1)}%</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Matched</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Unmatched</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Flagged</span>
            </div>
          </GlassCard>
        </div>

        {/* Activity Sidebar */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-5">
              <span className="text-xl">⚡</span> Recent Activity
            </h2>
            <div className="space-y-0">
              {activityTimeline.map((item, idx) => (
                <div key={idx} className="relative flex gap-4 pb-6 last:pb-0 group">
                  {/* Timeline line */}
                  {idx < activityTimeline.length - 1 && (
                    <div className="absolute left-[18px] top-10 w-px h-[calc(100%-24px)] bg-gradient-to-b from-slate-600 to-transparent" />
                  )}
                  {/* Icon circle */}
                  <div className={`
                    relative z-10 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm
                    ${item.color === 'emerald' ? 'bg-emerald-500/20 ring-1 ring-emerald-500/30' : ''}
                    ${item.color === 'rose' ? 'bg-rose-500/20 ring-1 ring-rose-500/30' : ''}
                    ${item.color === 'indigo' ? 'bg-indigo-500/20 ring-1 ring-indigo-500/30' : ''}
                    ${item.color === 'blue' ? 'bg-blue-500/20 ring-1 ring-blue-500/30' : ''}
                  `}>
                    {item.icon}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 leading-relaxed group-hover:text-white transition-colors">
                      {item.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Today&apos;s Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Entries Created</span>
                  <span className="text-sm font-mono text-white">142</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Auto-Matched</span>
                  <span className="text-sm font-mono text-emerald-400">138</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Needs Review</span>
                  <span className="text-sm font-mono text-amber-400">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Avg Processing</span>
                  <span className="text-sm font-mono text-indigo-400">0.3s</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
