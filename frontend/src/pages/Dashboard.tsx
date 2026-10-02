import React, { useState, useEffect } from 'react';
import { PhoneCall, Users, Clock, AlertCircle, TrendingUp, TrendingDown, CheckCircle2, Wifi, Activity, User, Headphones, ArrowRightLeft, LogOut, MoreVertical } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useSocket } from '../contexts/SocketContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

import './pages.css';

interface QueueData {
  name: string;
  waiting: number;
  active: number;
  sla: number;
  status: string;
}

interface AgentData {
  name: string;
  status: string;
  queue: string;
  duration: string;
}

interface WallboardMetrics {
  activeCalls: number;
  agentsOnline: number;
  agentsTotal: number;
  avgWaitTime: string;
  abandonRate: string;
  queues: QueueData[];
  agents: AgentData[];
  timestamp: string;
}

export const Dashboard: React.FC = () => {
  const { socket, isConnected } = useSocket();
  const [metrics, setMetrics] = useState<WallboardMetrics | null>(null);
  const [callHistory, setCallHistory] = useState<number[]>([65, 85, 110, 95, 130, 150, 120]);
  const [timeLabels, setTimeLabels] = useState<string[]>(['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']);
  const [actionToast, setActionToast] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (data: WallboardMetrics) => {
      setMetrics(data);
      setCallHistory(prev => {
        const next = [...prev.slice(1), data.activeCalls];
        return next;
      });
      setTimeLabels(prev => {
        const now = new Date();
        const label = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        return [...prev.slice(1), label];
      });
    };

    socket.on('wallboard_update', handleUpdate);
    return () => { socket.off('wallboard_update', handleUpdate); };
  }, [socket]);

  const showToast = (message: string) => {
    setActionToast(message);
    setTimeout(() => setActionToast(null), 3000);
  };

  const lineChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Active Calls',
        data: callHistory,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#6366f1',
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { grid: { display: false } },
    },
    animation: { duration: 500 },
  };

  const doughnutData = {
    labels: ['Resolved', 'Escalated', 'Abandoned'],
    datasets: [
      {
        data: [75, 15, 10],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const activeCalls = metrics?.activeCalls ?? 42;
  const agentsOnline = metrics?.agentsOnline ?? 18;
  const agentsTotal = metrics?.agentsTotal ?? 25;
  const avgWait = metrics?.avgWaitTime ?? '01:24';
  const abandonRate = metrics?.abandonRate ?? '2.4';
  const queues = metrics?.queues ?? [];
  const agents = metrics?.agents ?? [];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'on-call': return 'badge-warning';
      case 'available': return 'badge-success';
      case 'wrap-up': return 'badge-neutral';
      case 'break': return 'badge-danger';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="dashboard animate-fade-in">
      {/* Supervisor Action Toast */}
      {actionToast && (
        <div className="supervisor-toast animate-fade-in">
          <CheckCircle2 size={16} />
          {actionToast}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Supervisor Wallboard</h1>
          <p className="page-subtitle">
            Real-time contact center performance metrics
            {isConnected && <span className="live-pulse"> • <Activity size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Live</span>}
          </p>
        </div>
        <div className="header-actions">
          <select className="select-input">
            <option>All Queues</option>
            <option>Support Queue</option>
            <option>Sales Queue</option>
          </select>
          <button className="btn btn-primary">Export Report</button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card glass">
          <div className="metric-header">
            <span className="metric-title">Active Calls</span>
            <div className="metric-icon bg-primary-light">
              <PhoneCall size={20} className="text-primary-600" />
            </div>
          </div>
          <div className="metric-value animated-number">{activeCalls}</div>
          <div className="metric-trend positive">
            <TrendingUp size={16} /> <span>+12% vs last hour</span>
          </div>
        </div>

        <div className="metric-card glass">
          <div className="metric-header">
            <span className="metric-title">Agents Online</span>
            <div className="metric-icon bg-success-light">
              <Users size={20} className="text-success-600" />
            </div>
          </div>
          <div className="metric-value">{agentsOnline} <span className="text-muted text-sm font-normal">/ {agentsTotal}</span></div>
          <div className="metric-trend neutral">
            <CheckCircle2 size={16} /> <span>Optimal staffing</span>
          </div>
        </div>

        <div className="metric-card glass">
          <div className="metric-header">
            <span className="metric-title">Avg Wait Time</span>
            <div className="metric-icon bg-warning-light">
              <Clock size={20} className="text-warning-600" />
            </div>
          </div>
          <div className="metric-value">{avgWait}</div>
          <div className="metric-trend negative">
            <TrendingUp size={16} /> <span>+18s vs target</span>
          </div>
        </div>

        <div className="metric-card glass">
          <div className="metric-header">
            <span className="metric-title">Abandonment Rate</span>
            <div className="metric-icon bg-danger-light">
              <AlertCircle size={20} className="text-danger-600" />
            </div>
          </div>
          <div className="metric-value">{abandonRate}%</div>
          <div className="metric-trend positive">
            <TrendingDown size={16} /> <span>-0.5% vs yesterday</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card glass">
          <h3 className="card-title">Call Volume (Live)</h3>
          <div className="chart-container" style={{ height: '300px' }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
        <div className="chart-card glass">
          <h3 className="card-title">Call Outcomes</h3>
          <div className="chart-container" style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Live Queue Status */}
      <div className="queues-section mt-8">
        <h3 className="section-title mb-4">Active Queues</h3>
        <div className="table-container glass">
          <table className="data-table">
            <thead>
              <tr>
                <th>Queue Name</th>
                <th>Waiting</th>
                <th>Active</th>
                <th>Service Level (SLA)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {queues.length > 0 ? queues.map((q, i) => (
                <tr key={i}>
                  <td>{q.name}</td>
                  <td>
                    <span className={`badge ${q.waiting > 12 ? 'badge-danger' : q.waiting > 5 ? 'badge-warning' : 'badge-neutral'}`}>
                      {q.waiting}
                    </span>
                  </td>
                  <td>{q.active}</td>
                  <td>{q.sla}%</td>
                  <td>
                    <span className={`status-indicator ${q.status}`}>
                      {q.status === 'good' ? 'Healthy' : q.status === 'warning' ? 'High Load' : 'SLA Risk'}
                    </span>
                  </td>
                </tr>
              )) : (
                <>
                  <tr><td>Tier 1 Support</td><td><span className="badge badge-warning">12</span></td><td>24</td><td>94%</td><td><span className="status-indicator warning">High Load</span></td></tr>
                  <tr><td>Enterprise Sales</td><td><span className="badge badge-neutral">2</span></td><td>8</td><td>99%</td><td><span className="status-indicator good">Healthy</span></td></tr>
                  <tr><td>Billing Enquiries</td><td><span className="badge badge-danger">18</span></td><td>10</td><td>82%</td><td><span className="status-indicator critical">SLA Risk</span></td></tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Agent Status with Supervisor Controls */}
      {agents.length > 0 && (
        <div className="queues-section mt-8">
          <h3 className="section-title mb-4">Agent Status</h3>
          <div className="table-container glass">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Status</th>
                  <th>Queue</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a, i) => (
                  <tr key={i}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="agent-avatar-sm">
                        <User size={14} />
                      </div>
                      {a.name}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(a.status)}`}>
                        {a.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td>{a.queue}</td>
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{a.duration}</td>
                    <td>
                      <div className="supervisor-actions">
                        {a.status === 'on-call' && (
                          <button
                            className="action-btn whisper"
                            title="Whisper / Coach"
                            onClick={() => showToast(`Whisper mode started for ${a.name}`)}
                          >
                            <Headphones size={14} />
                          </button>
                        )}
                        <button
                          className="action-btn move"
                          title="Move to Queue"
                          onClick={() => showToast(`${a.name} reassigned to Tier 1 Support`)}
                        >
                          <ArrowRightLeft size={14} />
                        </button>
                        <button
                          className="action-btn force-logout"
                          title="Force Logout"
                          onClick={() => showToast(`${a.name} has been logged out`)}
                        >
                          <LogOut size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
