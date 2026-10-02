'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GlassCard from '@/components/ui/GlassCard';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// ─── KPI METRIC DATA ──────────────────────────────────────────────
const kpiMetrics = [
  {
    title: 'Revenue MTD',
    value: '₹42.5L',
    change: '+12.3%',
    changeType: 'positive' as const,
    icon: '📊',
    sparklineData: [28, 32, 35, 38, 40, 42, 42.5],
  },
  {
    title: 'Net Profit',
    value: '₹8.2L',
    change: '+5.7%',
    changeType: 'positive' as const,
    icon: '💰',
    sparklineData: [5.1, 5.8, 6.2, 7.0, 7.5, 8.0, 8.2],
  },
  {
    title: 'Cash Balance',
    value: '₹1.24Cr',
    change: '0.0%',
    changeType: 'neutral' as const,
    icon: '💵',
    sparklineData: [1.1, 1.15, 1.18, 1.2, 1.22, 1.24, 1.24],
  },
  {
    title: 'GST Due',
    value: '₹3.2L',
    change: 'Due Jul 20',
    changeType: 'warning' as const,
    icon: '📋',
    sparklineData: [2.8, 2.9, 3.0, 3.1, 3.1, 3.2, 3.2],
  },
  {
    title: 'TDS Due',
    value: '₹1.8L',
    change: 'Due Jul 7',
    changeType: 'danger' as const,
    icon: '🏦',
    sparklineData: [1.5, 1.6, 1.7, 1.7, 1.8, 1.8, 1.8],
  },
  {
    title: 'Runway',
    value: '14.3 mo',
    change: '+0.8 mo',
    changeType: 'positive' as const,
    icon: '📈',
    sparklineData: [12, 12.5, 13, 13.2, 13.8, 14, 14.3],
  },
];

// ─── REVENUE VS EXPENSES (12 months) ──────────────────────────────
const revenueExpenseData = [
  { month: 'Jan', revenue: 28, expenses: 22 },
  { month: 'Feb', revenue: 30, expenses: 23 },
  { month: 'Mar', revenue: 32, expenses: 25 },
  { month: 'Apr', revenue: 34, expenses: 26 },
  { month: 'May', revenue: 35, expenses: 27 },
  { month: 'Jun', revenue: 38, expenses: 29 },
  { month: 'Jul', revenue: 40, expenses: 31 },
  { month: 'Aug', revenue: 42, expenses: 32 },
  { month: 'Sep', revenue: 43, expenses: 33 },
  { month: 'Oct', revenue: 44, expenses: 35 },
  { month: 'Nov', revenue: 46, expenses: 36 },
  { month: 'Dec', revenue: 48, expenses: 38 },
];

// ─── EXPENSE BREAKDOWN ────────────────────────────────────────────
const expenseBreakdown = [
  { name: 'Salaries', value: 45, color: '#6366f1' },
  { name: 'Infrastructure', value: 20, color: '#10b981' },
  { name: 'Marketing', value: 15, color: '#f59e0b' },
  { name: 'Vendor Payments', value: 12, color: '#06b6d4' },
  { name: 'Misc', value: 8, color: '#f43f5e' },
];

const expenseTotal = '₹38.0L';

// ─── AI AGENT ACTIVITY FEED ───────────────────────────────────────
const agentActivities = [
  {
    icon: '🤖',
    message: 'Bookkeeper Agent categorized 47 transactions',
    time: '2 min ago',
    borderColor: 'border-indigo-500',
    dotColor: 'bg-indigo-500',
  },
  {
    icon: '📊',
    message: 'CFO Agent updated runway forecast',
    time: '15 min ago',
    borderColor: 'border-emerald-500',
    dotColor: 'bg-emerald-500',
  },
  {
    icon: '🧾',
    message: 'Tax Agent calculated July GST: ₹3.2L',
    time: '1 hour ago',
    borderColor: 'border-amber-500',
    dotColor: 'bg-amber-500',
  },
  {
    icon: '✅',
    message: 'Compliance Agent: GSTR-3B filed successfully',
    time: '3 hours ago',
    borderColor: 'border-emerald-500',
    dotColor: 'bg-emerald-500',
  },
  {
    icon: '💰',
    message: 'Payroll Agent processed June salaries',
    time: '5 hours ago',
    borderColor: 'border-indigo-500',
    dotColor: 'bg-indigo-500',
  },
  {
    icon: '🔍',
    message: 'Audit Agent flagged 2 duplicate entries',
    time: '6 hours ago',
    borderColor: 'border-rose-500',
    dotColor: 'bg-rose-500',
  },
  {
    icon: '📈',
    message: 'Fundraising Agent updated investor deck',
    time: '1 day ago',
    borderColor: 'border-cyan-500',
    dotColor: 'bg-cyan-500',
  },
  {
    icon: '⚠️',
    message: 'Tax Agent: TDS deadline in 7 days',
    time: '1 day ago',
    borderColor: 'border-amber-500',
    dotColor: 'bg-amber-500',
  },
];

// ─── COMPLIANCE CALENDAR ──────────────────────────────────────────
const complianceDeadlines = [
  {
    date: 'Jul 7',
    title: 'TDS Payment',
    daysLeft: 17,
    urgency: 'warning' as const,
    status: 'pending' as const,
  },
  {
    date: 'Jul 11',
    title: 'GSTR-1 Filing',
    daysLeft: 21,
    urgency: 'warning' as const,
    status: 'pending' as const,
  },
  {
    date: 'Jul 20',
    title: 'GSTR-3B + GST Payment',
    daysLeft: 30,
    urgency: 'normal' as const,
    status: 'upcoming' as const,
  },
  {
    date: 'Jul 30',
    title: 'TCS Return',
    daysLeft: 40,
    urgency: 'normal' as const,
    status: 'upcoming' as const,
  },
  {
    date: 'Aug 7',
    title: 'TDS Payment',
    daysLeft: 48,
    urgency: 'normal' as const,
    status: 'upcoming' as const,
  },
  {
    date: 'Aug 30',
    title: 'ROC Annual Filing',
    daysLeft: 71,
    urgency: 'normal' as const,
    status: 'upcoming' as const,
  },
];

// ─── RECENT TRANSACTIONS ─────────────────────────────────────────
const recentTransactions = [
  {
    date: 'Jun 19',
    description: 'Razorpay Settlement',
    category: 'Revenue',
    amount: '₹4,82,000',
    type: 'Credit' as const,
    status: 'completed' as const,
  },
  {
    date: 'Jun 18',
    description: 'AWS Services',
    category: 'Infrastructure',
    amount: '₹1,24,500',
    type: 'Debit' as const,
    status: 'completed' as const,
  },
  {
    date: 'Jun 18',
    description: 'Google Ads',
    category: 'Marketing',
    amount: '₹85,000',
    type: 'Debit' as const,
    status: 'completed' as const,
  },
  {
    date: 'Jun 17',
    description: 'Contractor — Design Agency',
    category: 'Services',
    amount: '₹2,50,000',
    type: 'Debit' as const,
    status: 'pending' as const,
  },
  {
    date: 'Jun 17',
    description: 'Stripe Payout — US Client',
    category: 'Revenue',
    amount: '₹7,35,200',
    type: 'Credit' as const,
    status: 'completed' as const,
  },
  {
    date: 'Jun 16',
    description: 'WeWork Office Rent',
    category: 'Infrastructure',
    amount: '₹3,80,000',
    type: 'Debit' as const,
    status: 'completed' as const,
  },
  {
    date: 'Jun 16',
    description: 'Zoho Subscriptions',
    category: 'Software',
    amount: '₹42,000',
    type: 'Debit' as const,
    status: 'completed' as const,
  },
  {
    date: 'Jun 15',
    description: 'Client Invoice — Acme Corp',
    category: 'Revenue',
    amount: '₹12,50,000',
    type: 'Credit' as const,
    status: 'completed' as const,
  },
  {
    date: 'Jun 15',
    description: 'Employee Reimbursements',
    category: 'Operations',
    amount: '₹67,800',
    type: 'Debit' as const,
    status: 'pending' as const,
  },
  {
    date: 'Jun 14',
    description: 'HDFC Bank Interest',
    category: 'Other Income',
    amount: '₹18,450',
    type: 'Credit' as const,
    status: 'completed' as const,
  },
];

// ─── CUSTOM TOOLTIP FOR AREA CHART ────────────────────────────────
function RevenueExpenseTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-800/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="mb-2 text-sm font-semibold text-white">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="capitalize text-slate-400">{entry.dataKey}:</span>
          <span className="font-mono font-semibold text-white">
            ₹{entry.value}L
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN DASHBOARD PAGE ──────────────────────────────────────────
export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  return (
    <DashboardLayout title="Mission Control">
      {/* ── Header Bar ─────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-white via-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time financial overview &bull; Last synced 2 min ago
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl">
          {['Today', 'This Week', 'This Month', 'This Quarter'].map(
            (period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            )
          )}
        </div>
      </div>

      {/* ── KPI Metric Cards ───────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpiMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
            sparklineData={metric.sparklineData}
          />
        ))}
      </div>

      {/* ── Charts Row ─────────────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Revenue vs Expenses Area Chart */}
        <GlassCard className="lg:col-span-3" hover>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Revenue vs Expenses
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                Monthly comparison — FY 2025-26
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="text-slate-400">Revenue</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-slate-400">Expenses</span>
              </span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueExpenseData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#6366f1"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="expenseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#f43f5e"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor="#f43f5e"
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(v: number) => `₹${v}L`}
                />
                <Tooltip
                  content={<RevenueExpenseTooltip />}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: '#6366f1',
                    stroke: '#1e1b4b',
                    strokeWidth: 2,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fill="url(#expenseGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: '#f43f5e',
                    stroke: '#1e1b4b',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Expense Breakdown Pie Chart */}
        <GlassCard className="lg:col-span-2" hover>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">
              Expense Breakdown
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Current month allocation
            </p>
          </div>

          <div className="relative h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Share']}
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400">Total</span>
              <span className="font-mono text-xl font-bold text-white">
                {expenseTotal}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {expenseBreakdown.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-mono text-slate-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── Bottom Section: Activity + Calendar ────────────────── */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Agent Activity Feed */}
        <GlassCard hover>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                AI Agent Activity
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                Recent autonomous actions
              </p>
            </div>
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div className="space-y-1">
            {agentActivities.map((activity, idx) => (
              <div
                key={idx}
                className={`group flex items-start gap-3 rounded-lg border-l-2 ${activity.borderColor} py-3 pl-4 pr-3 transition-all duration-200 hover:bg-white/[0.03]`}
              >
                <span className="mt-0.5 text-lg leading-none">
                  {activity.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-slate-200">
                    {activity.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Compliance Calendar */}
        <GlassCard hover>
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-white">
              Compliance Calendar
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Upcoming deadlines &amp; filings
            </p>
          </div>

          <div className="space-y-3">
            {complianceDeadlines.map((deadline, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all duration-200 hover:bg-white/[0.03] ${
                  deadline.urgency === 'warning'
                    ? 'border-amber-500/20 bg-amber-500/[0.04]'
                    : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                      deadline.urgency === 'warning'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-slate-700/60 text-slate-300'
                    }`}
                  >
                    {deadline.date.split(' ')[1]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {deadline.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {deadline.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-xs ${
                      deadline.urgency === 'warning'
                        ? 'text-amber-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {deadline.daysLeft}d left
                  </span>
                  <StatusBadge
                    status={deadline.status}
                    label={
                      deadline.status === 'pending'
                        ? '⚠️ Pending'
                        : 'Upcoming'
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── Recent Transactions Table ──────────────────────────── */}
      <GlassCard hover>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Recent Transactions
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Latest entries across all accounts
            </p>
          </div>
          <button className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 transition-all duration-200 hover:bg-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/10">
            View All Transactions →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Description
                </th>
                <th className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Category
                </th>
                <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                  Amount
                </th>
                <th className="pb-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Type
                </th>
                <th className="pb-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {recentTransactions.map((txn, idx) => (
                <tr
                  key={idx}
                  className="group transition-colors duration-150 hover:bg-white/[0.02]"
                >
                  <td className="py-3 font-mono text-sm text-slate-400">
                    {txn.date}
                  </td>
                  <td className="py-3 text-sm font-medium text-slate-200">
                    {txn.description}
                  </td>
                  <td className="py-3">
                    <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                      {txn.category}
                    </span>
                  </td>
                  <td
                    className={`py-3 text-right font-mono text-sm font-semibold ${
                      txn.type === 'Credit'
                        ? 'text-emerald-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {txn.type === 'Credit' ? '+' : '-'}
                    {txn.amount}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        txn.type === 'Credit'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <StatusBadge
                      status={txn.status}
                      label={
                        txn.status === 'completed' ? 'Completed' : 'Pending'
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Bottom spacer */}
      <div className="h-8" />
    </DashboardLayout>
  );
}
