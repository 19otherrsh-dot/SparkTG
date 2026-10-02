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
} from 'recharts';

const employeePayroll = [
  {
    employee: 'Arjun Mehta',
    designation: 'CTO',
    basic: '1,25,000',
    hra: '50,000',
    specialAllow: '75,000',
    pf: '15,000',
    tax: '42,500',
    netPay: '1,92,500',
  },
  {
    employee: 'Priya Sharma',
    designation: 'VP Engineering',
    basic: '1,00,000',
    hra: '40,000',
    specialAllow: '45,000',
    pf: '12,000',
    tax: '28,600',
    netPay: '1,44,400',
  },
  {
    employee: 'Rahul Gupta',
    designation: 'Senior Developer',
    basic: '75,000',
    hra: '30,000',
    specialAllow: '25,000',
    pf: '9,000',
    tax: '14,300',
    netPay: '1,06,700',
  },
  {
    employee: 'Sneha Iyer',
    designation: 'Senior Developer',
    basic: '72,000',
    hra: '28,800',
    specialAllow: '24,200',
    pf: '8,640',
    tax: '13,200',
    netPay: '1,03,160',
  },
  {
    employee: 'Vikram Singh',
    designation: 'Developer',
    basic: '55,000',
    hra: '22,000',
    specialAllow: '18,000',
    pf: '6,600',
    tax: '7,150',
    netPay: '81,250',
  },
  {
    employee: 'Ananya Reddy',
    designation: 'Designer',
    basic: '50,000',
    hra: '20,000',
    specialAllow: '15,000',
    pf: '6,000',
    tax: '5,500',
    netPay: '73,500',
  },
  {
    employee: 'Karan Malhotra',
    designation: 'Marketing Manager',
    basic: '60,000',
    hra: '24,000',
    specialAllow: '20,000',
    pf: '7,200',
    tax: '9,100',
    netPay: '87,700',
  },
  {
    employee: 'Deepika Nair',
    designation: 'Sales Lead',
    basic: '58,000',
    hra: '23,200',
    specialAllow: '19,800',
    pf: '6,960',
    tax: '8,450',
    netPay: '85,590',
  },
  {
    employee: 'Meera Joshi',
    designation: 'HR Manager',
    basic: '55,000',
    hra: '22,000',
    specialAllow: '18,000',
    pf: '6,600',
    tax: '7,150',
    netPay: '81,250',
  },
  {
    employee: 'Rohan Patil',
    designation: 'Intern',
    basic: '20,000',
    hra: '8,000',
    specialAllow: '2,000',
    pf: '2,400',
    tax: '0',
    netPay: '27,600',
  },
];

const payrollColumns = [
  { key: 'employee', label: 'Employee' },
  { key: 'designation', label: 'Designation' },
  { key: 'basic', label: 'Basic (₹)', align: 'right' as const },
  { key: 'hra', label: 'HRA (₹)', align: 'right' as const },
  { key: 'specialAllow', label: 'Special Allow (₹)', align: 'right' as const },
  { key: 'pf', label: 'PF (₹)', align: 'right' as const },
  { key: 'tax', label: 'Tax (₹)', align: 'right' as const },
  { key: 'netPay', label: 'Net Pay (₹)', align: 'right' as const },
];

const payrollHistory = [
  { month: 'June 2026', payout: '₹18,52,000', employees: 24, status: 'Processed' },
  { month: 'May 2026', payout: '₹17,94,000', employees: 23, status: 'Processed' },
  { month: 'April 2026', payout: '₹17,94,000', employees: 23, status: 'Processed' },
  { month: 'March 2026', payout: '₹17,36,000', employees: 22, status: 'Processed' },
  { month: 'February 2026', payout: '₹17,36,000', employees: 22, status: 'Processed' },
  { month: 'January 2026', payout: '₹16,80,000', employees: 21, status: 'Processed' },
];

const deductions = [
  { label: 'PF (Employee)', amount: '₹80,400', percent: 36, color: 'bg-indigo-500' },
  { label: 'PF (Employer)', amount: '₹80,400', percent: 36, color: 'bg-indigo-400' },
  { label: 'ESI (Employee)', amount: '₹13,890', percent: 6, color: 'bg-emerald-500' },
  { label: 'ESI (Employer)', amount: '₹43,860', percent: 20, color: 'bg-emerald-400' },
  { label: 'Professional Tax', amount: '₹6,000', percent: 3, color: 'bg-amber-500' },
  { label: 'TDS on Salary', amount: '₹1,35,950', percent: 61, color: 'bg-rose-500' },
];

const monthlyTrend = [
  { month: 'Jan', payout: 16.8, employees: 21 },
  { month: 'Feb', payout: 17.36, employees: 22 },
  { month: 'Mar', payout: 17.36, employees: 22 },
  { month: 'Apr', payout: 17.94, employees: 23 },
  { month: 'May', payout: 17.94, employees: 23 },
  { month: 'Jun', payout: 18.52, employees: 24 },
];

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<'table' | 'history' | 'deductions'>('table');

  return (
    <DashboardLayout title="Payroll Agent">
      <div className="space-y-6">
        {/* Agent Header */}
        <AgentHeader
          icon="👥"
          name="Payroll Agent"
          status="active"
          description="Processes salaries, generates payslips, manages PF and ESI contributions"
          lastRun="20 Jun 2026, 09:30 AM"
          taskCount={5}
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Payroll"
            value="₹18.5L/mo"
            change="+3.2%"
            changeType="increase"
            icon="💰"
            sparklineData={[14.2, 15.1, 16.8, 17.36, 17.94, 18.52]}
          />
          <MetricCard
            title="Employees"
            value="24"
            change="Active"
            changeType="neutral"
            icon="👥"
            sparklineData={[18, 19, 21, 22, 23, 24]}
          />
          <MetricCard
            title="PF Contribution"
            value="₹2.22L/mo"
            change="+3.1%"
            changeType="increase"
            icon="🏦"
            sparklineData={[1.82, 1.88, 1.94, 2.04, 2.14, 2.22]}
          />
          <MetricCard
            title="ESI Contribution"
            value="₹57,750/mo"
            change="+2.8%"
            changeType="increase"
            icon="🏥"
            sparklineData={[48.2, 50.1, 52.3, 54.0, 55.8, 57.75]}
          />
        </div>

        {/* Payroll Trend Chart */}
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-1">Monthly Payroll Trend</h3>
            <p className="text-sm text-slate-400 mb-4">Total payroll outflow over the last 6 months (in Lakhs)</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
                    formatter={(value: number) => [`₹${value}L`, 'Payroll']}
                  />
                  <Area
                    type="monotone"
                    dataKey="payout"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#payrollGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          {[
            { key: 'table' as const, label: '📋 Employee Payroll' },
            { key: 'history' as const, label: '📅 Run History' },
            { key: 'deductions' as const, label: '📊 Deductions' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'table' && (
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Employee Payroll — June 2026</h3>
                  <p className="text-sm text-slate-400 mt-1">Net pay after PF, ESI, and TDS deductions</p>
                </div>
                <button className="px-4 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-sm font-medium hover:bg-indigo-500/30 transition-all">
                  📄 Download Payslips
                </button>
              </div>
              <DataTable columns={payrollColumns} data={employeePayroll} />
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm text-slate-400">Showing 10 of 24 employees</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">Total Net Payroll:</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">₹9,83,650</span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {payrollHistory.map((run) => (
              <GlassCard key={run.month} hover>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold">{run.month}</h4>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      <span>✅</span> {run.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Total Payout</span>
                      <span className="text-base font-mono font-semibold text-white">{run.payout}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Employees</span>
                      <span className="text-base font-mono font-semibold text-white">{run.employees}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <button className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                      View Breakdown →
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {activeTab === 'deductions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-1">Deductions Breakdown</h3>
                <p className="text-sm text-slate-400 mb-5">Monthly statutory deductions for June 2026</p>
                <div className="space-y-4">
                  {deductions.map((d) => (
                    <div key={d.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-slate-300">{d.label}</span>
                        <span className="text-sm font-mono font-semibold text-white">{d.amount}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${d.color} transition-all duration-700 ease-out`}
                          style={{ width: `${d.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm text-slate-400">Total Deductions</span>
                  <span className="text-lg font-mono font-bold text-rose-400">₹3,60,500</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-1">Deduction Distribution</h3>
                <p className="text-sm text-slate-400 mb-5">Visual breakdown of all statutory deductions</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'PF (Emp)', amount: 80400 },
                        { name: 'PF (Er)', amount: 80400 },
                        { name: 'ESI (Emp)', amount: 13890 },
                        { name: 'ESI (Er)', amount: 43860 },
                        { name: 'Prof Tax', amount: 6000 },
                        { name: 'TDS', amount: 135950 },
                      ]}
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#f1f5f9',
                          fontSize: '13px',
                        }}
                        formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                      />
                      <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                        {[
                          '#6366f1', '#818cf8', '#10b981', '#34d399', '#f59e0b', '#f43f5e',
                        ].map((color, i) => (
                          <rect key={i} fill={color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500" />
                      <span className="text-xs text-slate-400">PF — ₹1,60,800</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs text-slate-400">ESI — ₹57,750</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-xs text-slate-400">Prof Tax — ₹6,000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="text-xs text-slate-400">TDS — ₹1,35,950</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Activity Sidebar */}
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Payroll Activity</h3>
            <div className="space-y-4">
              {[
                { time: '2 hours ago', event: 'June 2026 payroll processed', icon: '✅', color: 'text-emerald-400' },
                { time: '2 hours ago', event: '24 payslips generated and emailed', icon: '📧', color: 'text-indigo-400' },
                { time: '2 hours ago', event: 'PF challan generated — ₹1,60,800', icon: '🏦', color: 'text-amber-400' },
                { time: '2 hours ago', event: 'ESI challan generated — ₹57,750', icon: '🏥', color: 'text-emerald-400' },
                { time: '1 day ago', event: 'Rohan Patil (Intern) added to payroll', icon: '👤', color: 'text-indigo-400' },
                { time: '3 days ago', event: 'Salary revision applied: Sneha Iyer +₹5,000', icon: '📈', color: 'text-amber-400' },
                { time: '5 days ago', event: 'Leave encashment processed: Vikram Singh — ₹12,500', icon: '💰', color: 'text-emerald-400' },
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
