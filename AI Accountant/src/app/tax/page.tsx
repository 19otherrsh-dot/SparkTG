'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GlassCard from '@/components/ui/GlassCard';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import AgentHeader from '@/components/ui/AgentHeader';

const sparklineGST = [2.8, 2.9, 3.0, 3.1, 2.9, 3.0, 3.1, 3.2, 3.1, 3.2];
const sparklineTDS = [1.5, 1.5, 1.6, 1.6, 1.7, 1.7, 1.7, 1.8, 1.8, 1.8];
const sparklineITC = [3.5, 3.6, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.45];
const sparklineSaved = [5.2, 5.8, 6.2, 6.5, 7.0, 7.3, 7.8, 8.1, 8.4, 8.7];

const tabs = ['GST Dashboard', 'TDS Tracker', 'Tax Optimization'] as const;
type TabType = typeof tabs[number];

/* ─── GST Data ─── */
const itcMatchingData = [
  { vendor: 'AWS India Pvt Ltd', invoice: 'INV-AWS-2026-0618', amount: '₹1,24,500', gst: '₹22,410', status: 'Matched' },
  { vendor: 'Google India Digital', invoice: 'INV-GOOG-2026-0453', amount: '₹78,400', gst: '₹14,112', status: 'Matched' },
  { vendor: 'Regus Business Centre', invoice: 'INV-REG-2026-Q2', amount: '₹3,75,000', gst: '₹67,500', status: 'Matched' },
  { vendor: 'Acme Consulting LLP', invoice: 'INV-ACM-2026-0091', amount: '₹2,50,000', gst: '₹45,000', status: 'Unmatched' },
  { vendor: 'Jio Business Solutions', invoice: 'INV-JIO-2026-0614', amount: '₹8,999', gst: '₹1,620', status: 'Matched' },
];

const itcColumns = [
  { key: 'vendor', label: 'Vendor' },
  { key: 'invoice', label: 'Invoice No' },
  { key: 'amount', label: 'Amount', align: 'right' as const },
  { key: 'gst', label: 'GST', align: 'right' as const },
  { key: 'status', label: 'ITC Status' },
];

/* ─── TDS Data ─── */
const tdsData = [
  { deductee: 'Priya Sharma', pan: 'AQXPS1234K', section: '194C', amountPaid: '₹1,20,000', tdsRate: '2%', tdsAmount: '₹2,400', status: 'Deposited' },
  { deductee: 'Deloitte India', pan: 'AABCD5678L', section: '194J', amountPaid: '₹2,50,000', tdsRate: '10%', tdsAmount: '₹25,000', status: 'Deposited' },
  { deductee: 'Rajesh Kumar', pan: 'BMPKR9012M', section: '192', amountPaid: '₹8,50,000', tdsRate: '10%', tdsAmount: '₹85,000', status: 'Deposited' },
  { deductee: 'CloudTech Infra Pvt Ltd', pan: 'AABCC3456N', section: '194C', amountPaid: '₹3,20,000', tdsRate: '2%', tdsAmount: '₹6,400', status: 'Deposited' },
  { deductee: 'Anita Desai (Commission)', pan: 'CQDAD7890P', section: '194H', amountPaid: '₹1,80,000', tdsRate: '5%', tdsAmount: '₹9,000', status: 'Pending' },
  { deductee: 'Legal Eagles LLP', pan: 'AALFL2345Q', section: '194J', amountPaid: '₹1,50,000', tdsRate: '10%', tdsAmount: '₹15,000', status: 'Deposited' },
  { deductee: 'Neha Patel', pan: 'AFRPP6789R', section: '192', amountPaid: '₹7,20,000', tdsRate: '5%', tdsAmount: '₹36,000', status: 'Deposited' },
  { deductee: 'PixelCraft Studios', pan: 'AACCP0123S', section: '194C', amountPaid: '₹85,000', tdsRate: '2%', tdsAmount: '₹1,700', status: 'Pending' },
];

const tdsColumns = [
  { key: 'deductee', label: 'Deductee' },
  { key: 'pan', label: 'PAN' },
  { key: 'section', label: 'Section' },
  { key: 'amountPaid', label: 'Amount Paid', align: 'right' as const },
  { key: 'tdsRate', label: 'TDS Rate', align: 'right' as const },
  { key: 'tdsAmount', label: 'TDS Amount', align: 'right' as const },
  { key: 'status', label: 'Status' },
];

/* ─── Tax Optimization Suggestions ─── */
const optimizationSuggestions = [
  {
    id: 1,
    icon: '🎁',
    title: 'Claim Section 80G Deduction',
    description: 'Your CSR donations of ₹90,000 to registered NGOs qualify for 50% deduction under Section 80G. This could save you approximately ₹45,000 in taxes.',
    saving: '₹45,000',
    priority: 'high',
    action: 'Review Eligible Donations',
  },
  {
    id: 2,
    icon: '📅',
    title: 'Advance Tax Installment Due',
    description: 'Second advance tax installment is due on September 15. Based on current projections, the estimated payment is ₹2.4L. Pay on time to avoid interest under Section 234C.',
    saving: '₹2,40,000',
    priority: 'urgent',
    action: 'Calculate Advance Tax',
  },
  {
    id: 3,
    icon: '🏭',
    title: 'Equipment Depreciation — Section 32',
    description: 'New servers and laptops purchased in Q1 (₹8.5L) qualify for 40% depreciation. Claim additional depreciation of 20% for assets put to use for less than 180 days.',
    saving: '₹1,02,000',
    priority: 'medium',
    action: 'Review Asset Register',
  },
  {
    id: 4,
    icon: '💼',
    title: 'Optimize Salary Structure',
    description: 'Restructure CTC with higher HRA, NPS employer contribution (Sec 80CCD), and meal vouchers to provide tax-efficient benefits. Potential per-employee saving of ₹35,000–₹50,000 annually.',
    saving: '₹3,50,000',
    priority: 'medium',
    action: 'Model Salary Restructure',
  },
];

const priorityColors: Record<string, string> = {
  urgent: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  high: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export default function TaxPage() {
  const [activeTab, setActiveTab] = useState<TabType>('GST Dashboard');

  const itcTableData = itcMatchingData.map(row => ({
    ...row,
    amount: <span className="font-mono text-slate-200">{row.amount}</span>,
    gst: <span className="font-mono text-indigo-400">{row.gst}</span>,
    status: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.status === 'Matched'
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
      }`}>
        {row.status === 'Matched' ? '✓ ' : '⚠ '}{row.status}
      </span>
    ),
  }));

  const tdsTableData = tdsData.map(row => ({
    ...row,
    pan: <span className="font-mono text-xs text-slate-400">{row.pan}</span>,
    section: (
      <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-xs font-mono border border-indigo-500/30">
        {row.section}
      </span>
    ),
    amountPaid: <span className="font-mono text-slate-200">{row.amountPaid}</span>,
    tdsRate: <span className="font-mono text-slate-300">{row.tdsRate}</span>,
    tdsAmount: <span className="font-mono text-amber-400">{row.tdsAmount}</span>,
    status: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.status === 'Deposited'
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
      }`}>
        {row.status === 'Deposited' ? '✓ ' : '⏳ '}{row.status}
      </span>
    ),
  }));

  const totalTDS = tdsData.reduce((sum, row) => {
    const num = parseInt(row.tdsAmount.replace(/[₹,]/g, ''));
    return sum + num;
  }, 0);

  return (
    <DashboardLayout title="Tax Agent">
      {/* Agent Header */}
      <AgentHeader
        icon="🧾"
        name="Tax Agent"
        status="active"
        description="Handles GST calculations, TDS deductions, and tax optimization strategies"
        lastRun="5 minutes ago"
        taskCount={23}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <MetricCard
          title="GST Payable"
          value="₹3.2L"
          change="Due Jul 20"
          changeType="neutral"
          icon="🧾"
          sparklineData={sparklineGST}
        />
        <MetricCard
          title="TDS Deducted"
          value="₹1.8L"
          change="Due Jul 7"
          changeType="neutral"
          icon="💸"
          sparklineData={sparklineTDS}
        />
        <MetricCard
          title="ITC Available"
          value="₹4.45L"
          change="+12%"
          changeType="positive"
          icon="📥"
          sparklineData={sparklineITC}
        />
        <MetricCard
          title="Tax Saved (YTD)"
          value="₹8.7L"
          change="+23%"
          changeType="positive"
          icon="🏦"
          sparklineData={sparklineSaved}
        />
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <div className="flex items-center gap-1 p-1 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 w-fit">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-indigo-500/30 text-indigo-300 shadow-lg shadow-indigo-500/10 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* ═══ GST Dashboard ═══ */}
        {activeTab === 'GST Dashboard' && (
          <div className="space-y-6">
            {/* GSTR Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GSTR-1 */}
              <GlassCard hover>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">GSTR-1</h3>
                  <span className="text-xs text-slate-400">Outward Supplies</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div>
                      <span className="text-sm text-slate-300">June 2026</span>
                      <p className="text-xs text-slate-500 mt-0.5">Filed on Jun 10, 2026</p>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">✅ Filed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div>
                      <span className="text-sm text-slate-300">July 2026</span>
                      <p className="text-xs text-slate-500 mt-0.5">Due by Jul 11, 2026</p>
                    </div>
                    <span className="text-amber-400 text-sm font-medium flex items-center gap-1">🟡 Pending</span>
                  </div>
                </div>
              </GlassCard>

              {/* GSTR-3B */}
              <GlassCard hover>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">GSTR-3B</h3>
                  <span className="text-xs text-slate-400">Monthly Return</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div>
                      <span className="text-sm text-slate-300">June 2026</span>
                      <p className="text-xs text-slate-500 mt-0.5">Filed on Jun 18, 2026</p>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">✅ Filed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div>
                      <span className="text-sm text-slate-300">July 2026</span>
                      <p className="text-xs text-slate-500 mt-0.5">Due by Jul 20, 2026</p>
                    </div>
                    <span className="text-amber-400 text-sm font-medium flex items-center gap-1">🟡 Pending</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* ITC Matching Table */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <span className="text-xl">🔗</span> ITC Matching — GSTR-2A Reconciliation
              </h3>
              <DataTable columns={itcColumns} data={itcTableData} />
            </GlassCard>

            {/* GST Summary */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-5">
                <span className="text-xl">📋</span> GST Summary — July 2026 (Estimated)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-5 text-center">
                  <p className="text-sm text-slate-400 mb-1">Output Tax (Collected)</p>
                  <p className="text-2xl font-bold font-mono text-rose-400">₹7,65,000</p>
                  <p className="text-xs text-slate-500 mt-1">On outward supplies</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center">
                  <p className="text-sm text-slate-400 mb-1">Input Tax Credit</p>
                  <p className="text-2xl font-bold font-mono text-emerald-400">₹4,45,000</p>
                  <p className="text-xs text-slate-500 mt-1">On inward supplies</p>
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-5 text-center">
                  <p className="text-sm text-slate-400 mb-1">Net GST Payable</p>
                  <p className="text-2xl font-bold font-mono text-indigo-400">₹3,20,000</p>
                  <p className="text-xs text-slate-500 mt-1">Due by Jul 20, 2026</p>
                </div>
              </div>

              {/* Breakdown bar */}
              <div className="mt-5">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span>Tax Liability Breakdown</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden bg-slate-700/50 flex">
                  <div className="bg-emerald-500 h-full" style={{ width: '58.2%' }} />
                  <div className="bg-indigo-500 h-full" style={{ width: '41.8%' }} />
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> ITC Utilized (58.2%)</span>
                  <span className="text-indigo-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Net Payable (41.8%)</span>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ═══ TDS Tracker ═══ */}
        {activeTab === 'TDS Tracker' && (
          <div className="space-y-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="text-xl">💸</span> TDS Deductions — FY 2026-27
                </h3>
                <div className="flex items-center gap-3">
                  <StatusBadge status="active" label="Auto-tracking" />
                </div>
              </div>
              <DataTable columns={tdsColumns} data={tdsTableData} />
            </GlassCard>

            {/* TDS Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <GlassCard hover>
                <p className="text-sm text-slate-400">Total TDS Deducted</p>
                <p className="text-2xl font-bold font-mono text-white mt-1">₹{totalTDS.toLocaleString('en-IN')}</p>
                <p className="text-xs text-emerald-400 mt-1">8 deductions</p>
              </GlassCard>
              <GlassCard hover>
                <p className="text-sm text-slate-400">Sec 194C (Contractors)</p>
                <p className="text-2xl font-bold font-mono text-blue-400 mt-1">₹10,500</p>
                <p className="text-xs text-slate-500 mt-1">3 deductions @ 2%</p>
              </GlassCard>
              <GlassCard hover>
                <p className="text-sm text-slate-400">Sec 194J (Professional)</p>
                <p className="text-2xl font-bold font-mono text-purple-400 mt-1">₹40,000</p>
                <p className="text-xs text-slate-500 mt-1">2 deductions @ 10%</p>
              </GlassCard>
              <GlassCard hover>
                <p className="text-sm text-slate-400">Sec 192 (Salary)</p>
                <p className="text-2xl font-bold font-mono text-indigo-400 mt-1">₹1,21,000</p>
                <p className="text-xs text-slate-500 mt-1">2 employees</p>
              </GlassCard>
            </div>

            {/* Filing status */}
            <GlassCard>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <span className="text-xl">📄</span> Quarterly TDS Returns
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="text-sm text-slate-300 font-medium">Q1 (Apr–Jun)</p>
                  <p className="text-emerald-400 text-sm mt-2 flex items-center justify-center gap-1">✅ Filed</p>
                  <p className="text-xs text-slate-500 mt-1">Form 26Q, 24Q</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-sm text-slate-300 font-medium">Q2 (Jul–Sep)</p>
                  <p className="text-amber-400 text-sm mt-2 flex items-center justify-center gap-1">🟡 In Progress</p>
                  <p className="text-xs text-slate-500 mt-1">Due Oct 31, 2026</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-500/10 border border-slate-500/20 text-center">
                  <p className="text-sm text-slate-300 font-medium">Q3 (Oct–Dec)</p>
                  <p className="text-slate-400 text-sm mt-2 flex items-center justify-center gap-1">⬜ Upcoming</p>
                  <p className="text-xs text-slate-500 mt-1">Due Jan 31, 2027</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-500/10 border border-slate-500/20 text-center">
                  <p className="text-sm text-slate-300 font-medium">Q4 (Jan–Mar)</p>
                  <p className="text-slate-400 text-sm mt-2 flex items-center justify-center gap-1">⬜ Upcoming</p>
                  <p className="text-xs text-slate-500 mt-1">Due May 31, 2027</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ═══ Tax Optimization ═══ */}
        {activeTab === 'Tax Optimization' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                <span className="text-xs text-indigo-300 font-medium">AI-Powered Suggestions</span>
              </div>
              <span className="text-sm text-slate-500">Based on your financial data analysis</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {optimizationSuggestions.map(suggestion => (
                <GlassCard key={suggestion.id} hover>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl">
                      {suggestion.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-semibold text-white">{suggestion.title}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${priorityColors[suggestion.priority]}`}>
                          {suggestion.priority}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed mt-2">{suggestion.description}</p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        <div>
                          <span className="text-xs text-slate-500">Potential Saving</span>
                          <p className="text-lg font-bold font-mono text-emerald-400">{suggestion.saving}</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all duration-200">
                          {suggestion.action}
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Total Savings Summary */}
            <GlassCard>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="text-xl">💰</span> Total Optimization Potential
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Combined savings from all identified opportunities</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold font-mono text-emerald-400">₹6,37,000</p>
                  <p className="text-sm text-emerald-400/70 mt-1">Across 4 strategies</p>
                </div>
              </div>
              <div className="mt-4 w-full h-2 rounded-full overflow-hidden bg-slate-700/50">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: '72%' }} />
              </div>
              <p className="text-xs text-slate-500 mt-2">72% of optimization opportunities actioned</p>
            </GlassCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
