'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GlassCard from '@/components/ui/GlassCard';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import AgentHeader from '@/components/ui/AgentHeader';

const sparklineScore = [89, 90, 91, 92, 93, 93, 94, 94, 95, 96];
const sparklineFilings = [2, 4, 6, 8, 10, 12, 14, 15, 17, 18];
const sparklineDeadlines = [8, 7, 7, 6, 6, 5, 5, 6, 6, 6];
const sparklineOverdue = [2, 1, 1, 0, 0, 0, 0, 0, 0, 0];

/* ─── Calendar Events ─── */
interface CalendarEvent {
  day: number;
  label: string;
  color: 'amber' | 'green' | 'blue' | 'rose';
}

const calendarEvents: CalendarEvent[] = [
  { day: 7, label: 'TDS Payment', color: 'amber' },
  { day: 11, label: 'GSTR-1 Filing', color: 'amber' },
  { day: 15, label: 'PF/ESI Payment', color: 'green' },
  { day: 20, label: 'GSTR-3B + GST', color: 'amber' },
  { day: 25, label: 'TCS Return', color: 'green' },
  { day: 30, label: 'ROC Annual Filing Prep', color: 'blue' },
];

const eventDotColors: Record<string, string> = {
  amber: 'bg-amber-500',
  green: 'bg-emerald-500',
  blue: 'bg-blue-500',
  rose: 'bg-rose-500',
};

const eventRingColors: Record<string, string> = {
  amber: 'ring-amber-500/30',
  green: 'ring-emerald-500/30',
  blue: 'ring-blue-500/30',
  rose: 'ring-rose-500/30',
};

/* ─── Filing Tracker Data ─── */
const filingData = [
  { filing: 'GSTR-1 (June)', type: 'GST', dueDate: '2026-07-11', status: 'Pending', priority: 'High' },
  { filing: 'GSTR-3B (June)', type: 'GST', dueDate: '2026-07-20', status: 'Pending', priority: 'High' },
  { filing: 'TDS Return — Q1 (26Q)', type: 'TDS', dueDate: '2026-07-31', status: 'Pending', priority: 'Medium' },
  { filing: 'PF Monthly Return', type: 'PF/ESI', dueDate: '2026-07-15', status: 'Filed', priority: 'Low' },
  { filing: 'ESI Monthly Return', type: 'PF/ESI', dueDate: '2026-07-15', status: 'Filed', priority: 'Low' },
  { filing: 'GSTR-1 (May)', type: 'GST', dueDate: '2026-06-11', status: 'Filed', priority: 'Low' },
  { filing: 'GSTR-3B (May)', type: 'GST', dueDate: '2026-06-20', status: 'Filed', priority: 'Low' },
  { filing: 'ROC Annual Return (MGT-7)', type: 'ROC', dueDate: '2026-10-30', status: 'Upcoming', priority: 'Medium' },
  { filing: 'MCA DIR-3 KYC', type: 'MCA', dueDate: '2026-09-30', status: 'Upcoming', priority: 'Medium' },
  { filing: 'Income Tax Return (ITR-6)', type: 'Income Tax', dueDate: '2026-10-31', status: 'Upcoming', priority: 'High' },
];

const filingColumns = [
  { key: 'filing', label: 'Filing' },
  { key: 'type', label: 'Type' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
];

/* ─── Document Checklist ─── */
const checklistItems = [
  { id: 1, label: 'Audited Financial Statements (Balance Sheet & P&L)', completed: true },
  { id: 2, label: 'Board Resolution for Annual Filing', completed: true },
  { id: 3, label: 'Director\'s Report & Annexures', completed: true },
  { id: 4, label: 'Annual Return Form MGT-7', completed: false },
  { id: 5, label: 'Statutory Auditor\'s Report', completed: true },
  { id: 6, label: 'Secretarial Audit Report (MR-3)', completed: false },
  { id: 7, label: 'AOC-4 (Financial Statements to ROC)', completed: false },
  { id: 8, label: 'Updated Register of Members & Directors', completed: true },
];

const today = 20; // June 20, 2026 — but calendar shows July 2026

export default function CompliancePage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [checklistState, setChecklistState] = useState(
    checklistItems.map(item => ({ ...item }))
  );

  const completedCount = checklistState.filter(i => i.completed).length;
  const totalChecklist = checklistState.length;
  const progress = (completedCount / totalChecklist) * 100;

  const toggleChecklist = (id: number) => {
    setChecklistState(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  // July 2026 starts on Wednesday (day index 3, 0=Sun)
  const firstDayOfMonth = 3; // Wednesday
  const daysInMonth = 31;
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Build calendar grid
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const getEventsForDay = (day: number) => calendarEvents.filter(e => e.day === day);

  const typeColors: Record<string, string> = {
    GST: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    TDS: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    ROC: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    MCA: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    'PF/ESI': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    'Income Tax': 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  };

  const statusStyles: Record<string, { text: string; icon: string; className: string }> = {
    Filed: { text: 'Filed', icon: '✅', className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    Pending: { text: 'Pending', icon: '🟡', className: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    Upcoming: { text: 'Upcoming', icon: '⬜', className: 'bg-slate-500/20 text-slate-400 border border-slate-500/30' },
  };

  const priorityStyles: Record<string, string> = {
    High: 'text-rose-400',
    Medium: 'text-amber-400',
    Low: 'text-slate-400',
  };

  const filingTableData = filingData.map(row => ({
    filing: <span className="text-slate-200 font-medium">{row.filing}</span>,
    type: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[row.type]}`}>
        {row.type}
      </span>
    ),
    dueDate: <span className="font-mono text-sm text-slate-300">{row.dueDate}</span>,
    status: (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[row.status].className}`}>
        {statusStyles[row.status].icon} {statusStyles[row.status].text}
      </span>
    ),
    priority: (
      <span className={`text-sm font-medium ${priorityStyles[row.priority]}`}>
        {row.priority === 'High' ? '🔴' : row.priority === 'Medium' ? '🟡' : '🟢'} {row.priority}
      </span>
    ),
  }));

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <DashboardLayout title="Compliance Agent">
      {/* Agent Header */}
      <AgentHeader
        icon="🛡️"
        name="Compliance Agent"
        status="active"
        description="Tracks all regulatory deadlines, ROC filings, and ensures 100% compliance"
        lastRun="10 minutes ago"
        taskCount={31}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <MetricCard
          title="Compliance Score"
          value="96%"
          change="+2%"
          changeType="up"
          icon="🛡️"
          sparklineData={sparklineScore}
        />
        <MetricCard
          title="Filings Done (YTD)"
          value="18"
          change="On track"
          changeType="up"
          icon="📄"
          sparklineData={sparklineFilings}
        />
        <MetricCard
          title="Upcoming Deadlines"
          value="6"
          change="Next 30 days"
          changeType="neutral"
          icon="📅"
          sparklineData={sparklineDeadlines}
        />
        <MetricCard
          title="Overdue"
          value="0"
          change="All clear ✅"
          changeType="up"
          icon="✅"
          sparklineData={sparklineOverdue}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Compliance Calendar — spans 2 cols */}
        <div className="lg:col-span-2">
          <GlassCard>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-xl">📅</span> Compliance Calendar — July 2026
              </h2>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> On Track</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Preparation</span>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map(dn => (
                <div key={dn} className="text-center text-xs font-medium text-slate-500 py-2">
                  {dn}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-20 rounded-lg bg-white/[0.02]" />;
                }
                const events = getEventsForDay(day);
                const isSelected = selectedDay === day;
                const isWeekend = idx % 7 === 0 || idx % 7 === 6;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                    className={`
                      relative h-20 rounded-lg border text-left p-1.5 transition-all duration-200 flex flex-col
                      ${isSelected
                        ? 'border-indigo-500/50 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                        : events.length > 0
                          ? 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20'
                          : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                      }
                    `}
                  >
                    <span className={`text-xs font-medium ${isWeekend ? 'text-slate-500' : 'text-slate-300'}`}>
                      {day}
                    </span>
                    {events.length > 0 && (
                      <div className="mt-auto space-y-0.5">
                        {events.map((evt, ei) => (
                          <div key={ei} className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${eventDotColors[evt.color]} ring-2 ${eventRingColors[evt.color]}`} />
                            <span className="text-[10px] text-slate-400 truncate leading-tight">{evt.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Details */}
            {selectedDay && selectedEvents.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 animate-in fade-in slide-in-from-top-2 duration-200">
                <h4 className="text-sm font-semibold text-indigo-300 mb-2">
                  July {selectedDay}, 2026
                </h4>
                <div className="space-y-2">
                  {selectedEvents.map((evt, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${eventDotColors[evt.color]}`} />
                      <span className="text-sm text-slate-200">{evt.label}</span>
                      <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                        evt.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                        evt.color === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {evt.color === 'amber' ? 'Action Required' : evt.color === 'green' ? 'On Track' : 'Prepare'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Sidebar — Document Checklist */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
              <span className="text-xl">📋</span> ROC Annual Filing Checklist
            </h2>
            <p className="text-xs text-slate-500 mb-4">Due: October 30, 2026</p>

            {/* Progress Bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">{completedCount} of {totalChecklist} completed</span>
                <span className="text-indigo-400 font-mono font-medium">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden bg-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2">
              {checklistState.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`
                    w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200
                    ${item.completed
                      ? 'bg-emerald-500/5 border border-emerald-500/10'
                      : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10'
                    }
                  `}
                >
                  <div className={`
                    flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all
                    ${item.completed
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-500 hover:border-indigo-400'
                    }
                  `}>
                    {item.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm leading-relaxed ${
                    item.completed ? 'text-slate-500 line-through' : 'text-slate-300'
                  }`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Checklist Footer */}
            <div className="mt-5 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className="text-xs text-slate-400">
                  {progress === 100 ? 'All documents ready for filing!' : `${totalChecklist - completedCount} documents pending`}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Filing Tracker Table — Full Width */}
      <div className="mt-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-xl">📊</span> Filing Tracker
            </h2>
            <div className="flex items-center gap-3">
              <StatusBadge status="active" label="Auto-monitoring" />
              <span className="text-xs text-slate-500">{filingData.length} filings tracked</span>
            </div>
          </div>
          <DataTable columns={filingColumns} data={filingTableData} />

          {/* Summary Footer */}
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Filed: {filingData.filter(f => f.status === 'Filed').length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Pending: {filingData.filter(f => f.status === 'Pending').length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              Upcoming: {filingData.filter(f => f.status === 'Upcoming').length}
            </span>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
