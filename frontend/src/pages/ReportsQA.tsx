import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Filter, Star, Play, Mic, TrendingUp, Clock, PhoneCall, Users } from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import './pages.css';

interface ReportMetrics {
  totalCalls: number;
  avgDuration: string;
  channelDistribution: number[];
  statusCounts: {
    resolved: number;
    active: number;
  };
}

export const ReportsQA: React.FC = () => {
  const { apiFetch } = useAuth();
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await apiFetch('http://localhost:3001/api/analytics/reports');
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error('Failed to fetch reports', err);
      }
    };
    fetchReports();
  }, [apiFetch]);

  const barChartData = {
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Remote'],
    datasets: [
      {
        label: 'Avg QA Score (%)',
        data: [88, 92, 85, 96, 90],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { grid: { display: false } },
    },
  };

  const trendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calls Handled',
        data: [420, 380, 450, 490, 460, 280, 310],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
      },
      {
        label: 'Avg Handle Time (s)',
        data: [240, 220, 260, 235, 250, 210, 225],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { usePointStyle: true } },
    },
    scales: {
      y: { grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { grid: { display: false } },
    },
  };

  const channelData = {
    labels: ['Voice', 'Chat', 'Email', 'WhatsApp'],
    datasets: [{
      data: metrics ? metrics.channelDistribution : [0, 0, 0, 0],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      borderWidth: 0,
    }],
  };

  const channelOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { usePointStyle: true, padding: 16 } },
    },
    cutout: '65%',
  };

  const totalCalls = metrics ? metrics.totalCalls : 0;
  const avgDuration = metrics ? metrics.avgDuration : '00:00';
  const fcr = metrics && totalCalls > 0 ? Math.round((metrics.statusCounts.resolved / totalCalls) * 100) + '%' : '0%';

  return (
    <div className="reports-qa animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & QA</h1>
          <p className="page-subtitle">Analyze team performance and quality assurance metrics</p>
        </div>
        <div className="header-actions">
          <button className="btn bg-bg-hover text-text-primary">
            <Filter size={16} /> Filters
          </button>
          <button className="btn btn-primary">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card glass">
          <div className="metric-header">
            <span className="metric-title">Average QA Score</span>
            <div className="metric-icon bg-primary-light">
              <Star size={20} className="text-primary-600" />
            </div>
          </div>
          <div className="metric-value">91.4%</div>
          <div className="metric-trend positive">
            <span>+2.1% vs last month</span>
          </div>
        </div>

        <div className="metric-card glass">
          <div className="metric-header">
            <span className="metric-title">Total Evaluated Calls</span>
            <div className="metric-icon bg-success-light">
              <Mic size={20} className="text-success-600" />
            </div>
          </div>
          <div className="metric-value">{totalCalls}</div>
          <div className="metric-trend positive">
            <span>Live Data</span>
          </div>
        </div>

        <div className="metric-card glass">
          <div className="metric-header">
            <span className="metric-title">Avg Handle Time</span>
            <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <Clock size={20} style={{ color: '#f59e0b' }} />
            </div>
          </div>
          <div className="metric-value">{avgDuration}</div>
          <div className="metric-trend negative">
            <span>Live Data</span>
          </div>
        </div>

        <div className="metric-card glass">
          <div className="metric-header">
            <span className="metric-title">First Call Resolution</span>
            <div className="metric-icon" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
              <TrendingUp size={20} style={{ color: '#ec4899' }} />
            </div>
          </div>
          <div className="metric-value">{fcr}</div>
          <div className="metric-trend positive">
            <span>Live Data</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid mt-6">
        <div className="chart-card glass" style={{ gridColumn: 'span 2' }}>
          <h3 className="card-title">Weekly Performance Trend</h3>
          <div className="chart-container" style={{ height: '280px' }}>
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>
      </div>

      <div className="charts-grid mt-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="chart-card glass">
          <h3 className="card-title">QA Scores by Team</h3>
          <div className="chart-container" style={{ height: '250px' }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
        <div className="chart-card glass">
          <h3 className="card-title">Channel Distribution</h3>
          <div className="chart-container" style={{ height: '250px' }}>
            <Doughnut data={channelData} options={channelOptions} />
          </div>
        </div>
      </div>

      {/* QA Evaluations Table */}
      <div className="queues-section mt-8">
        <h3 className="section-title mb-4">Recent QA Evaluations</h3>
        <div className="table-container glass">
          <table className="data-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Interaction ID</th>
                <th>Channel</th>
                <th>Date</th>
                <th>Score</th>
                <th>Evaluator</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { agent: 'Priya Sharma', intId: 'INT-99214', channel: 'Voice', date: 'May 19, 2026', score: 82, evaluator: 'Rahul M.', scoreClass: 'badge-warning' },
                { agent: 'Amit Patel', intId: 'INT-99215', channel: 'Chat', date: 'May 19, 2026', score: 98, evaluator: 'Neha K.', scoreClass: 'badge-success' },
                { agent: 'Sunita Rao', intId: 'INT-99218', channel: 'Voice', date: 'May 18, 2026', score: 65, evaluator: 'Rahul M.', scoreClass: 'badge-danger' },
                { agent: 'Deepak Sharma', intId: 'INT-99220', channel: 'Email', date: 'May 18, 2026', score: 91, evaluator: 'Neha K.', scoreClass: 'badge-success' },
                { agent: 'Kavita Nair', intId: 'INT-99222', channel: 'Voice', date: 'May 17, 2026', score: 88, evaluator: 'Rahul M.', scoreClass: 'badge-warning' },
                { agent: 'Rahul Verma', intId: 'INT-99225', channel: 'Chat', date: 'May 17, 2026', score: 94, evaluator: 'Neha K.', scoreClass: 'badge-success' },
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{row.agent}</td>
                  <td><span className="text-primary-600">{row.intId}</span></td>
                  <td><span className="tag">{row.channel}</span></td>
                  <td>{row.date}</td>
                  <td><span className={`badge ${row.scoreClass}`}>{row.score}%</span></td>
                  <td>{row.evaluator}</td>
                  <td>
                    <button className="btn bg-bg-hover text-text-primary" style={{ padding: '4px 8px' }}>
                      <Play size={14} /> Listen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
