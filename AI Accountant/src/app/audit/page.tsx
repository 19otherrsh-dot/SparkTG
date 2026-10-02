'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GlassCard from '@/components/ui/GlassCard';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import AgentHeader from '@/components/ui/AgentHeader';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const documentCategories = [
  { name: 'Bank Statements', collected: 12, total: 12, percent: 100, status: '✅' },
  { name: 'Tax Returns', collected: 4, total: 4, percent: 100, status: '✅' },
  { name: 'GST Filings', collected: 11, total: 12, percent: 92, status: '🟡' },
  { name: 'Invoices (Sales)', collected: 456, total: 456, percent: 100, status: '✅' },
  { name: 'Invoices (Purchase)', collected: 312, total: 340, percent: 92, status: '🟡' },
  { name: 'Expense Receipts', collected: 89, total: 124, percent: 72, status: '🟡' },
  { name: 'Payroll Records', collected: 6, total: 6, percent: 100, status: '✅' },
  { name: 'Board Resolutions', collected: 3, total: 5, percent: 60, status: '⚠️' },
];

const discrepancies = [
  {
    id: 1,
    severity: 'warning',
    title: 'Duplicate Entry Detected',
    description: 'AWS invoice ₹24,500 appears on both Jun 5 and Jun 6 — likely a duplicate booking.',
    suggestedAction: 'Review both entries and delete the duplicate. Verify with the bank statement.',
    date: 'Jun 6, 2026',
    amount: '₹24,500',
  },
  {
    id: 2,
    severity: 'error',
    title: 'Missing Receipt',
    description: 'Travel expense of ₹15,800 on Jun 12 has no attached receipt or supporting document.',
    suggestedAction: 'Request receipt from the employee (Karan Malhotra) or write off with approval.',
    date: 'Jun 12, 2026',
    amount: '₹15,800',
  },
  {
    id: 3,
    severity: 'info',
    title: 'Depreciation Variance',
    description: 'Q1 depreciation on office equipment differs by ₹32,000 from the expected SLM schedule.',
    suggestedAction: 'Recalculate depreciation using the updated asset register. Check for mid-quarter additions.',
    date: 'Q1 FY26',
    amount: '₹32,000',
  },
];

const auditTimeline = [
  {
    time: '1 hour ago',
    event: 'Document scan completed — 142 of 163 documents collected',
    icon: '📄',
    type: 'info',
  },
  {
    time: '3 hours ago',
    event: 'Discrepancy alert: Duplicate AWS invoice flagged',
    icon: '⚠️',
    type: 'warning',
  },
  {
    time: 'Yesterday',
    event: 'Bank reconciliation for May 2026 completed — all matched',
    icon: '✅',
    type: 'success',
  },
  {
    time: '2 days ago',
    event: 'GST return GSTR-3B for May auto-verified against books',
    icon: '📊',
    type: 'info',
  },
  {
    time: '3 days ago',
    event: 'Missing receipt notification sent to Karan Malhotra',
    icon: '📧',
    type: 'info',
  },
  {
    time: '1 week ago',
    event: 'Quarterly depreciation schedule reviewed — variance flagged',
    icon: '🔍',
    type: 'warning',
  },
];

const readinessData = [
  { name: 'Ready', value: 87 },
  { name: 'Pending', value: 13 },
];

export default function AuditPage() {
  const [resolving, setResolving] = useState<number | null>(null);

  const handleResolve = (id: number) => {
    setResolving(id);
    setTimeout(() => setResolving(null), 1500);
  };

  const circumference = 2 * Math.PI * 70;
  const dashOffset = circumference - (87 / 100) * circumference;

  return (
    <DashboardLayout title="Audit Agent">
      <div className="space-y-6">
        {/* Agent Header */}
        <AgentHeader
          icon="🔍"
          name="Audit Agent"
          status="processing"
          description="Prepares audit documentation, detects discrepancies, and maintains audit trails"
          lastRun="20 Jun 2026, 10:15 AM"
          taskCount={3}
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Audit Readiness"
            value="87%"
            change="+5%"
            changeType="increase"
            icon="📋"
            sparklineData={[68, 72, 75, 79, 83, 87]}
          />
          <MetricCard
            title="Documents Collected"
            value="142/163"
            change="87%"
            changeType="neutral"
            icon="📄"
            sparklineData={[95, 108, 118, 126, 135, 142]}
          />
          <MetricCard
            title="Discrepancies Found"
            value="3"
            change="Flagged"
            changeType="decrease"
            icon="⚠️"
            sparklineData={[1, 2, 1, 3, 2, 3]}
          />
          <MetricCard
            title="Last Audit"
            value="Mar 2026"
            change="Completed"
            changeType="neutral"
            icon="✅"
            sparklineData={[0, 0, 1, 0, 0, 0]}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Audit Readiness Gauge */}
          <GlassCard>
            <div className="p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-white mb-6 self-start">Audit Readiness Score</h3>
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  {/* Background circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="12"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="url(#auditGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="auditGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold font-mono text-white">87%</span>
                  <span className="text-xs text-slate-400 mt-1">Ready</span>
                </div>
              </div>
              <p className="text-sm text-slate-300 mt-4 text-center">
                Your books are <span className="text-emerald-400 font-semibold">87% audit-ready</span>
              </p>
              <p className="text-xs text-slate-500 mt-1 text-center">
                21 documents remaining to reach 100%
              </p>
              <div className="mt-4 w-full grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/10 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold font-mono text-emerald-400">142</p>
                  <p className="text-xs text-slate-400">Collected</p>
                </div>
                <div className="bg-amber-500/10 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold font-mono text-amber-400">21</p>
                  <p className="text-xs text-slate-400">Pending</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Document Collection Status */}
          <GlassCard className="lg:col-span-2">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Document Collection Status</h3>
              <p className="text-sm text-slate-400 mb-5">Progress by category for FY 2025-26 audit</p>
              <div className="space-y-4">
                {documentCategories.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{cat.status}</span>
                        <span className="text-sm text-slate-300">{cat.name}</span>
                      </div>
                      <span className="text-sm font-mono text-slate-400">
                        {cat.collected}/{cat.total}{' '}
                        <span className={`${cat.percent === 100 ? 'text-emerald-400' : cat.percent >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                          ({cat.percent}%)
                        </span>
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          cat.percent === 100
                            ? 'bg-emerald-500'
                            : cat.percent >= 70
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Overall Progress</span>
                  <span className="text-sm font-mono font-semibold text-white">142 / 163 documents</span>
                </div>
                <div className="mt-2 w-full bg-white/5 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000"
                    style={{ width: '87%' }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Discrepancy Alerts */}
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-white">Discrepancy Alerts</h3>
                <p className="text-sm text-slate-400 mt-1">Issues detected that require attention before audit</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-rose-500/10 text-rose-400 rounded-full text-xs font-medium">
                  {discrepancies.length} Active
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {discrepancies.map((d) => (
                <div
                  key={d.id}
                  className={`rounded-xl border p-5 transition-all duration-300 ${
                    resolving === d.id
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusBadge
                          status={d.severity as 'warning' | 'error' | 'info'}
                          label={d.severity === 'error' ? 'High' : d.severity === 'warning' ? 'Medium' : 'Low'}
                        />
                        <h4 className="text-white font-semibold">{d.title}</h4>
                        <span className="text-xs text-slate-500">{d.date}</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{d.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-indigo-400 font-medium">💡 Suggested:</span>
                        <span className="text-xs text-slate-400">{d.suggestedAction}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-mono font-semibold text-white">{d.amount}</span>
                      <button
                        onClick={() => handleResolve(d.id)}
                        disabled={resolving === d.id}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          resolving === d.id
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30'
                        }`}
                      >
                        {resolving === d.id ? '✅ Resolving...' : '🔧 Resolve'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Audit Trail Timeline */}
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-5">Audit Trail Timeline</h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-white/10" />
              <div className="space-y-6">
                {auditTimeline.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div
                      className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        item.type === 'success'
                          ? 'bg-emerald-500/20 ring-2 ring-emerald-500/30'
                          : item.type === 'warning'
                          ? 'bg-amber-500/20 ring-2 ring-amber-500/30'
                          : 'bg-indigo-500/20 ring-2 ring-indigo-500/30'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm text-slate-200">{item.event}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
