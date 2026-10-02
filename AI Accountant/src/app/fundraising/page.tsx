'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GlassCard from '@/components/ui/GlassCard';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import AgentHeader from '@/components/ui/AgentHeader';
import {
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

const investorMetrics = [
  { label: 'ARR', value: '₹4.2Cr', trend: '+186% YoY', trendType: 'up', icon: '📈' },
  { label: 'MRR', value: '₹35L', trend: '+12.3% MoM', trendType: 'up', icon: '💰' },
  { label: 'MoM Growth', value: '12.3%', trend: 'Accelerating', trendType: 'up', icon: '🚀' },
  { label: 'Burn Rate', value: '₹8.67L', trend: '-3.2% MoM', trendType: 'down', icon: '🔥' },
  { label: 'Runway', value: '14.3 mo', trend: '+0.8 months', trendType: 'up', icon: '🏦' },
  { label: 'CAC:LTV Ratio', value: '1:4.2', trend: 'Healthy', trendType: 'up', icon: '🎯' },
];

const dataRoomSections = [
  { name: 'Financial Statements', collected: 4, total: 4, percent: 100, status: '✅', items: ['P&L Statement', 'Balance Sheet', 'Cash Flow Statement', 'MIS Reports'] },
  { name: 'Tax Returns & Compliance', collected: 3, total: 4, percent: 75, status: '🟡', items: ['ITR FY24', 'ITR FY25', 'GST Returns', 'ROC Filing (pending)'] },
  { name: 'Cap Table', collected: 1, total: 1, percent: 100, status: '✅', items: ['Fully diluted cap table'] },
  { name: 'Revenue Contracts', collected: 8, total: 10, percent: 80, status: '🟡', items: ['8 active contracts uploaded, 2 renewals pending'] },
  { name: 'Team & HR Documents', collected: 5, total: 5, percent: 100, status: '✅', items: ['Org chart', 'ESOP pool', 'Key hires', 'Employment agreements', 'Advisor agreements'] },
  { name: 'IP & Legal', collected: 2, total: 3, percent: 67, status: '🟡', items: ['Trademark registration', 'Technology assignment deed', 'Patent application (pending)'] },
  { name: 'Product Metrics', collected: 3, total: 3, percent: 100, status: '✅', items: ['DAU/MAU dashboard', 'Retention cohorts', 'NPS survey results'] },
];

const overallProgress = Math.round(
  (dataRoomSections.reduce((sum, s) => sum + s.collected, 0) /
    dataRoomSections.reduce((sum, s) => sum + s.total, 0)) *
    100
);

const mrrTrend = [
  { month: 'Jan', mrr: 22.5 },
  { month: 'Feb', mrr: 24.8 },
  { month: 'Mar', mrr: 27.2 },
  { month: 'Apr', mrr: 29.8 },
  { month: 'May', mrr: 31.5 },
  { month: 'Jun', mrr: 35.0 },
];

const financialModel = [
  { year: 'FY26', revenue: '₹4.2Cr', expenses: '₹3.8Cr', ebitda: '₹40L', growth: '—' },
  { year: 'FY27', revenue: '₹12Cr', expenses: '₹8Cr', ebitda: '₹4Cr', growth: '186%' },
  { year: 'FY28', revenue: '₹30Cr', expenses: '₹18Cr', ebitda: '₹12Cr', growth: '150%' },
];

const financialModelColumns = [
  { key: 'year', label: 'Year' },
  { key: 'revenue', label: 'Revenue', align: 'right' as const },
  { key: 'expenses', label: 'Expenses', align: 'right' as const },
  { key: 'ebitda', label: 'EBITDA', align: 'right' as const },
  { key: 'growth', label: 'Growth', align: 'right' as const },
];

export default function FundraisingPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <DashboardLayout title="Fundraising Agent">
      <div className="space-y-6">
        {/* Agent Header */}
        <AgentHeader
          icon="🚀"
          name="Fundraising Agent"
          status="idle"
          description="Generates investor updates, financial models, and maintains due diligence data room"
          lastRun="15 Jun 2026, 06:00 PM"
          taskCount={2}
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Current Round"
            value="Series A"
            change="In Progress"
            changeType="neutral"
            icon="🎯"
            sparklineData={[0, 0, 0, 0, 1, 1]}
          />
          <MetricCard
            title="Target Raise"
            value="₹15Cr"
            change="$1.8M"
            changeType="neutral"
            icon="💰"
            sparklineData={[0, 0, 0, 0, 0, 15]}
          />
          <MetricCard
            title="Data Room Ready"
            value="78%"
            change="+12%"
            changeType="increase"
            icon="📁"
            sparklineData={[45, 52, 58, 65, 72, 78]}
          />
          <MetricCard
            title="Last Investor Update"
            value="Jun 15"
            change="5 days ago"
            changeType="neutral"
            icon="📧"
            sparklineData={[1, 1, 1, 1, 1, 1]}
          />
        </div>

        {/* Key Investor Metrics */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">📊 Key Investor Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {investorMetrics.map((metric) => (
              <GlassCard key={metric.label} hover>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-400">{metric.label}</span>
                    <span className="text-xl">{metric.icon}</span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-white mb-2">{metric.value}</p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm ${
                        metric.trendType === 'up' ? 'text-emerald-400' : 'text-emerald-400'
                      }`}
                    >
                      {metric.trendType === 'up' ? '↑' : '↓'}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        metric.trendType === 'up' ? 'text-emerald-400' : 'text-emerald-400'
                      }`}
                    >
                      {metric.trend}
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* MRR Growth Chart */}
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-1">MRR Growth Trajectory</h3>
            <p className="text-sm text-slate-400 mb-4">Monthly Recurring Revenue over last 6 months (in Lakhs)</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mrrTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${v}L`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#f1f5f9',
                      fontSize: '13px',
                    }}
                    formatter={(value: number) => [`₹${value}L`, 'MRR']}
                  />
                  <Bar dataKey="mrr" fill="url(#mrrGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>

        {/* Data Room Checklist */}
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-white">Data Room Checklist</h3>
                <p className="text-sm text-slate-400 mt-1">Due diligence document preparation status</p>
              </div>
              <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium font-mono">
                {overallProgress}% Complete
              </span>
            </div>

            {/* Overall progress bar */}
            <div className="mb-6">
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-slate-500">
                  {dataRoomSections.reduce((s, sec) => s + sec.collected, 0)} / {dataRoomSections.reduce((s, sec) => s + sec.total, 0)} documents
                </span>
                <span className="text-xs text-slate-500">{overallProgress}%</span>
              </div>
            </div>

            <div className="space-y-3">
              {dataRoomSections.map((section) => (
                <div key={section.name} className="rounded-xl border border-white/10 overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => setExpandedSection(expandedSection === section.name ? null : section.name)}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{section.status}</span>
                      <span className="text-sm text-slate-200 font-medium">{section.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-slate-400">
                        {section.collected}/{section.total}
                      </span>
                      <div className="w-24 bg-white/5 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            section.percent === 100
                              ? 'bg-emerald-500'
                              : section.percent >= 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${section.percent}%` }}
                        />
                      </div>
                      <svg
                        className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                          expandedSection === section.name ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {expandedSection === section.name && (
                    <div className="px-4 pb-4 pt-1 border-t border-white/5">
                      <ul className="space-y-1.5">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                            <span className={i < section.collected ? 'text-emerald-400' : 'text-slate-600'}>
                              {i < section.collected ? '✓' : '○'}
                            </span>
                            <span className={i < section.collected ? 'text-slate-300' : 'text-slate-500 italic'}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Investor Update Preview + Financial Model */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Investor Update Preview */}
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white">📧 Investor Update Preview</h3>
                <StatusBadge status="info" label="Draft" />
              </div>

              <div className="bg-white/[0.03] rounded-xl border border-white/10 p-5">
                <div className="border-b border-white/10 pb-3 mb-4">
                  <h4 className="text-base font-semibold text-white">Monthly Investor Update — June 2026</h4>
                  <p className="text-xs text-slate-500 mt-1">LedgerAI • Series A</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                      Key Highlights
                    </h5>
                    <ul className="space-y-2">
                      {[
                        { icon: '📈', text: 'Revenue grew 12.3% to ₹42.5L MRR' },
                        { icon: '🤝', text: 'Signed 3 new enterprise clients' },
                        { icon: '🏦', text: 'Runway extended to 14.3 months' },
                        { icon: '👥', text: 'Team size: 24 (hired 2 engineers)' },
                        { icon: '🚀', text: 'Key milestone: Launched AI tax module' },
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-sm flex-shrink-0">{item.icon}</span>
                          <span className="text-sm text-slate-300">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-white/5">
                    <h5 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                      Asks
                    </h5>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-sm flex-shrink-0">🎯</span>
                        <span className="text-sm text-slate-300">Warm intros to CFOs at mid-market SaaS companies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sm flex-shrink-0">💡</span>
                        <span className="text-sm text-slate-300">Feedback on pricing model for enterprise tier</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className={`mt-4 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  generating
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 cursor-wait'
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-500/20'
                }`}
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating Full Report...
                  </span>
                ) : (
                  '📄 Generate Full Report'
                )}
              </button>
            </div>
          </GlassCard>

          {/* Financial Model Summary */}
          <GlassCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-1">📊 Financial Model Summary</h3>
              <p className="text-sm text-slate-400 mb-5">3-year projection for investor deck</p>

              <DataTable columns={financialModelColumns} data={financialModel} />

              <div className="mt-6 space-y-4">
                {/* Revenue projection chart */}
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { year: 'FY26', revenue: 4.2, expenses: 3.8 },
                        { year: 'FY27', revenue: 12, expenses: 8 },
                        { year: 'FY28', revenue: 30, expenses: 18 },
                      ]}
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v}Cr`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#f1f5f9',
                          fontSize: '13px',
                        }}
                        formatter={(value: number) => [`₹${value}Cr`, '']}
                      />
                      <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name="Expenses" fill="#475569" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-indigo-500/5 rounded-lg p-3 text-center border border-indigo-500/10">
                    <p className="text-xs text-slate-400 mb-1">FY28 Revenue</p>
                    <p className="text-lg font-bold font-mono text-indigo-400">₹30Cr</p>
                  </div>
                  <div className="bg-emerald-500/5 rounded-lg p-3 text-center border border-emerald-500/10">
                    <p className="text-xs text-slate-400 mb-1">FY28 EBITDA</p>
                    <p className="text-lg font-bold font-mono text-emerald-400">₹12Cr</p>
                  </div>
                  <div className="bg-amber-500/5 rounded-lg p-3 text-center border border-amber-500/10">
                    <p className="text-xs text-slate-400 mb-1">FY28 Margin</p>
                    <p className="text-lg font-bold font-mono text-amber-400">40%</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Activity Feed */}
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Fundraising Activity</h3>
            <div className="space-y-4">
              {[
                { time: '5 days ago', event: 'Monthly investor update sent to 8 investors', icon: '📧', color: 'text-indigo-400' },
                { time: '1 week ago', event: 'Data room updated — 3 new documents added', icon: '📁', color: 'text-emerald-400' },
                { time: '1 week ago', event: 'Financial model v2.3 uploaded with revised projections', icon: '📊', color: 'text-amber-400' },
                { time: '2 weeks ago', event: 'Cap table updated after ESOP grant (2 engineers)', icon: '📋', color: 'text-indigo-400' },
                { time: '2 weeks ago', event: 'Investor intro meeting scheduled — Sequoia Scout', icon: '🤝', color: 'text-purple-400' },
                { time: '3 weeks ago', event: 'Series A term sheet template prepared by legal', icon: '⚖️', color: 'text-emerald-400' },
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
