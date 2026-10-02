import React, { useState, useEffect } from 'react';
import { User, Users, Bell, Shield, Key, Webhook, Copy, Eye, EyeOff, Plus, Trash2, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './pages.css';

type SettingsTab = 'profile' | 'team' | 'notifications' | 'security' | 'api-keys' | 'webhooks';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'team', label: 'Team & Users', icon: <Users size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'api-keys', label: 'API Keys', icon: <Key size={18} /> },
    { id: 'webhooks', label: 'Webhooks', icon: <Webhook size={18} /> },
  ];

  return (
    <div className="settings animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your platform preferences and configurations</p>
        </div>
        <div className="header-actions">
          <button className={`btn ${saved ? 'btn-success' : 'btn-primary'}`} onClick={handleSave}>
            {saved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar glass">
          <nav className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-content glass">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="settings-panel animate-fade-in">
              <h2 className="section-title mb-4">Profile Information</h2>
              <div className="form-group mb-4">
                <label>Full Name</label>
                <input type="text" className="text-input full-width" defaultValue={user?.name || 'Deepak Sharma'} />
              </div>
              <div className="form-group mb-4">
                <label>Email Address</label>
                <input type="email" className="text-input full-width" defaultValue={user?.email || 'deepak.s@sparktg.com'} />
              </div>
              <div className="form-group mb-4">
                <label>Role</label>
                <input type="text" className="text-input full-width" defaultValue={user?.role || 'Supervisor'} disabled style={{ opacity: 0.7 }} />
              </div>
              <div className="form-group mb-4">
                <label>Phone Number</label>
                <input type="tel" className="text-input full-width" defaultValue="+91 98765 43210" />
              </div>
              <div className="form-group mb-4">
                <label>Timezone</label>
                <select className="select-input full-width">
                  <option>Asia/Kolkata (IST, UTC+5:30)</option>
                  <option>America/New_York (EST, UTC-5)</option>
                  <option>Europe/London (GMT, UTC+0)</option>
                  <option>Asia/Singapore (SGT, UTC+8)</option>
                </select>
              </div>
            </div>
          )}

          {/* TEAM TAB */}
          {activeTab === 'team' && (
            <TeamSettings />
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="settings-panel animate-fade-in">
              <h2 className="section-title mb-4">Notification Preferences</h2>
              <p className="text-muted mb-6" style={{ fontSize: '0.85rem' }}>Configure how and when you receive platform notifications.</p>
              
              {[
                { label: 'Queue SLA Alerts', desc: 'Notify when any queue breaches its SLA threshold', defaultOn: true },
                { label: 'Missed VIP Calls', desc: 'Alert when a VIP/Enterprise customer call goes unanswered', defaultOn: true },
                { label: 'Agent Status Changes', desc: 'Notify when agents change status (break, offline)', defaultOn: false },
                { label: 'New Chat Escalations', desc: 'Alert when an agent escalates a chat to supervisor', defaultOn: true },
                { label: 'IVR Deploy Notifications', desc: 'Notify when a new IVR flow is deployed', defaultOn: false },
                { label: 'System Maintenance', desc: 'Receive system maintenance and downtime alerts', defaultOn: true },
              ].map((item, i) => (
                <div key={i} className="settings-toggle-row">
                  <div>
                    <div className="toggle-label">{item.label}</div>
                    <div className="toggle-desc">{item.desc}</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={item.defaultOn} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="settings-panel animate-fade-in">
              <h2 className="section-title mb-4">Security Settings</h2>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-label">Two-Factor Authentication</div>
                  <div className="toggle-desc">Require an extra security step when logging in</div>
                </div>
                <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>Enable 2FA</button>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-label">Session Timeout</div>
                  <div className="toggle-desc">Auto-logout after period of inactivity</div>
                </div>
                <select className="select-input" style={{ width: '140px' }}>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>4 hours</option>
                  <option>Never</option>
                </select>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '24px 0' }} />

              <h3 className="section-title mb-4" style={{ fontSize: '0.95rem' }}>Change Password</h3>
              <div className="form-group mb-4">
                <label>Current Password</label>
                <input type="password" className="text-input full-width" placeholder="••••••••" />
              </div>
              <div className="form-group mb-4">
                <label>New Password</label>
                <input type="password" className="text-input full-width" placeholder="••••••••" />
              </div>
              <div className="form-group mb-4">
                <label>Confirm New Password</label>
                <input type="password" className="text-input full-width" placeholder="••••••••" />
              </div>
              <button className="btn btn-primary">Update Password</button>
            </div>
          )}

          {/* API KEYS TAB */}
          {activeTab === 'api-keys' && (
            <div className="settings-panel animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 className="section-title">API Keys</h2>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>Manage API keys for external integrations</p>
                </div>
                <button className="btn btn-primary" style={{ padding: '8px 16px' }}><Plus size={14} /> Generate Key</button>
              </div>

              <div className="api-key-card glass">
                <div className="api-key-header">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Production Key</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Created: May 1, 2026 • Last used: 2 hours ago</div>
                  </div>
                  <span className="badge badge-success">Active</span>
                </div>
                <div className="api-key-value">
                  <code>{showApiKey ? 'sk_live_sparktg_a7b3c9d1e5f2g8h4i6j0' : '••••••••••••••••••••••••••••••'}</code>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="icon-btn" onClick={() => setShowApiKey(!showApiKey)}>{showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    <button className="icon-btn"><Copy size={16} /></button>
                  </div>
                </div>
              </div>

              <div className="api-key-card glass" style={{ marginTop: '12px' }}>
                <div className="api-key-header">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Staging Key</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Created: Apr 15, 2026 • Last used: 5 days ago</div>
                  </div>
                  <span className="badge badge-warning">Staging</span>
                </div>
                <div className="api-key-value">
                  <code>sk_test_sparktg_x1y2z3w4v5u6t7s8</code>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="icon-btn"><Copy size={16} /></button>
                    <button className="icon-btn" style={{ color: 'var(--danger-500)' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WEBHOOKS TAB */}
          {activeTab === 'webhooks' && (
            <div className="settings-panel animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 className="section-title">Webhooks</h2>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>Configure webhook endpoints for real-time event delivery</p>
                </div>
                <button className="btn btn-primary" style={{ padding: '8px 16px' }}><Plus size={14} /> Add Webhook</button>
              </div>

              {[
                { url: 'https://api.crm.example.com/sparktg/events', events: ['call.completed', 'call.missed'], status: 'active', lastTriggered: '12 min ago' },
                { url: 'https://hooks.slack.com/services/T02/B04/xyz', events: ['queue.sla_breach', 'agent.status_change'], status: 'active', lastTriggered: '1 hour ago' },
                { url: 'https://analytics.internal.co/ingest', events: ['call.completed', 'chat.ended', 'email.resolved'], status: 'paused', lastTriggered: '3 days ago' },
              ].map((wh, i) => (
                <div key={i} className="webhook-card glass" style={{ marginBottom: '12px' }}>
                  <div className="webhook-header">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <code className="webhook-url">{wh.url}</code>
                      <div className="webhook-events">
                        {wh.events.map(ev => (
                          <span key={ev} className="tag">{ev}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`badge ${wh.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{wh.status}</span>
                      <button className="icon-btn" style={{ color: 'var(--danger-500)' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '8px' }}>Last triggered: {wh.lastTriggered}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TeamSettings: React.FC = () => {
  const { apiFetch, user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('AGENT');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await apiFetch('http://localhost:3001/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, name: newName, role: newRole })
      });
      
      if (res.ok) {
        await fetchUsers();
        setShowAdd(false);
        setNewEmail('');
        setNewName('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add user');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSupervisor = user?.role === 'SUPERVISOR';

  if (!isSupervisor) {
    return (
      <div className="settings-panel animate-fade-in">
        <h2 className="section-title mb-4">Team & Users</h2>
        <div className="empty-state">
          <AlertTriangle size={32} className="text-warning-500 mb-2" />
          <h3>Access Denied</h3>
          <p className="text-muted">Only Supervisors can manage team members.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-panel animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 className="section-title">Team & Users</h2>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Manage agents and supervisors on the platform</p>
        </div>
        {!showAdd && (
          <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Add User
          </button>
        )}
      </div>

      {showAdd && (
        <div className="api-key-card glass animate-fade-in mb-6" style={{ padding: '20px' }}>
          <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: '16px' }}>Add New Team Member</h3>
          <form onSubmit={handleAddUser}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="text-input full-width" required value={newName} onChange={e => setNewName(e.target.value)} placeholder="E.g. Priya Sharma" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="text-input full-width" required value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="agent@sparktg.com" />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select className="select-input full-width" value={newRole} onChange={e => setNewRole(e.target.value)}>
                  <option value="AGENT">Agent</option>
                  <option value="SUPERVISOR">Supervisor</option>
                </select>
              </div>
            </div>
            {error && <div style={{ color: 'var(--danger-500)', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn bg-bg-hover text-text-primary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Create User'}</button>
            </div>
          </form>
          <div className="text-muted mt-4" style={{ fontSize: '0.8rem' }}>
            * Note: New users are created with the default password <strong>password123</strong>.
          </div>
        </div>
      )}

      <div className="table-container glass">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="agent-avatar-sm">
                    <User size={14} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{u.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{u.email}</div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${u.role === 'SUPERVISOR' ? 'badge-primary' : 'badge-neutral'}`}>
                    {u.role}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="icon-btn" title="Edit User"><Copy size={16} /></button>
                    {u.id !== user?.id && <button className="icon-btn" title="Remove User" style={{ color: 'var(--danger-500)' }}><Trash2 size={16} /></button>}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Loading users...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
