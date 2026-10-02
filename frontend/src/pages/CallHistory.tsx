import React, { useState, useEffect } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, Search, Filter, Download, Calendar, User, ArrowUpRight, ArrowDownLeft, X as XIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './pages.css';

interface CallRecord {
  id: string;
  direction: 'inbound' | 'outbound' | 'missed';
  callerName: string;
  callerNumber: string;
  agent: string;
  queue: string;
  duration: string;
  waitTime: string;
  disposition: string;
  timestamp: string;
  date: string;
  recording: boolean;
}

export const CallHistory: React.FC = () => {
  const { apiFetch } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [history, setHistory] = useState<CallRecord[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiFetch('http://localhost:3001/api/analytics/history');
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error('Failed to fetch call history', err);
      }
    };
    fetchHistory();
  }, [apiFetch]);

  const filtered = history.filter(r => {
    const matchSearch = r.callerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.callerNumber.includes(searchQuery) ||
      r.agent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDir = directionFilter === 'all' || r.direction === directionFilter;
    return matchSearch && matchDir;
  });

  const getDirectionIcon = (dir: string) => {
    if (dir === 'inbound') return <ArrowDownLeft size={14} style={{ color: 'var(--success-500)' }} />;
    if (dir === 'outbound') return <ArrowUpRight size={14} style={{ color: 'var(--primary-500)' }} />;
    return <PhoneMissed size={14} style={{ color: 'var(--danger-500)' }} />;
  };

  const getDispositionClass = (d: string) => {
    if (d === 'Resolved') return 'badge-success';
    if (d === 'Escalated') return 'badge-warning';
    if (d === 'Abandoned') return 'badge-danger';
    return 'badge-neutral';
  };

  const exportCSV = () => {
    const headers = ['Direction', 'Caller', 'Number', 'Agent', 'Queue', 'Duration', 'Wait Time', 'Disposition', 'Time', 'Date'];
    const rows = filtered.map(r => [r.direction, r.callerName, r.callerNumber, r.agent, r.queue, r.duration, r.waitTime, r.disposition, r.timestamp, r.date]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sparktg_call_history_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalCalls = history.length;
  const answered = history.filter(r => r.direction !== 'missed').length;
  const missed = history.filter(r => r.direction === 'missed').length;
  
  // Basic average duration calc (could be done in backend or skipped for now)
  let totalDur = 0;
  history.forEach(r => {
    const p = r.duration.split(':');
    if (p.length === 2) totalDur += (parseInt(p[0]) * 60) + parseInt(p[1]);
  });
  const avgS = history.length > 0 ? Math.floor(totalDur / history.length) : 0;
  const avgDuration = `${String(Math.floor(avgS / 60)).padStart(2, '0')}:${String(avgS % 60).padStart(2, '0')}`;

  return (
    <div className="call-history-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Call History</h1>
          <p className="page-subtitle">Call Detail Records (CDR) and interaction logs</p>
        </div>
        <div className="header-actions">
          <button className="btn bg-bg-hover text-text-primary">
            <Calendar size={16} /> Date Range
          </button>
          <button className="btn bg-bg-hover text-text-primary" onClick={exportCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="cdr-summary">
        <div className="cdr-stat glass">
          <Phone size={20} className="text-primary-600" />
          <div>
            <span className="cdr-stat-value">{totalCalls}</span>
            <span className="cdr-stat-label">Total Calls</span>
          </div>
        </div>
        <div className="cdr-stat glass">
          <PhoneIncoming size={20} className="text-success-600" />
          <div>
            <span className="cdr-stat-value">{answered}</span>
            <span className="cdr-stat-label">Answered</span>
          </div>
        </div>
        <div className="cdr-stat glass">
          <PhoneMissed size={20} className="text-danger-600" />
          <div>
            <span className="cdr-stat-value">{missed}</span>
            <span className="cdr-stat-label">Missed</span>
          </div>
        </div>
        <div className="cdr-stat glass">
          <Clock size={20} className="text-warning-600" />
          <div>
            <span className="cdr-stat-value">{avgDuration}</span>
            <span className="cdr-stat-label">Avg Duration</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="cdr-toolbar glass">
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by caller, number, or agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-tags">
          {[{ key: 'all', label: 'All' }, { key: 'inbound', label: 'Inbound' }, { key: 'outbound', label: 'Outbound' }, { key: 'missed', label: 'Missed' }].map(f => (
            <button
              key={f.key}
              className={`filter-chip ${directionFilter === f.key ? 'active' : ''}`}
              onClick={() => setDirectionFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* CDR Table */}
      <div className="table-container glass mt-6">
        <table className="data-table cdr-table">
          <thead>
            <tr>
              <th></th>
              <th>Caller</th>
              <th>Agent</th>
              <th>Queue</th>
              <th>Duration</th>
              <th>Wait</th>
              <th>Disposition</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(record => (
              <tr key={record.id} className="cdr-row">
                <td>{getDirectionIcon(record.direction)}</td>
                <td>
                  <div className="contact-cell">
                    <div>
                      <span className="contact-name">{record.callerName}</span>
                      <span className="contact-email">{record.callerNumber}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div className="agent-avatar-sm"><User size={12} /></div>
                    <span>{record.agent}</span>
                  </div>
                </td>
                <td className="text-sm">{record.queue}</td>
                <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{record.duration}</td>
                <td className="text-muted text-sm" style={{ fontVariantNumeric: 'tabular-nums' }}>{record.waitTime}</td>
                <td><span className={`badge ${getDispositionClass(record.disposition)}`}>{record.disposition}</span></td>
                <td className="text-muted text-sm">
                  <div>{record.timestamp}</div>
                  <div style={{ fontSize: '0.7rem' }}>{record.date}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
