import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Moon, Sun, User, Search, LogOut, Phone, MessageSquare, AlertTriangle, CheckCircle, X, ChevronDown, Coffee, Clock, WifiOff, LayoutDashboard, Users, BarChart3, History, GitMerge, UserCircle, Settings, Command } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface Notification {
  id: string;
  type: 'call' | 'chat' | 'alert' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

type AgentStatus = 'available' | 'on-break' | 'away' | 'offline';

const statusConfig: Record<AgentStatus, { label: string; color: string; dotColor: string; icon: React.ReactNode }> = {
  'available': { label: 'Available', color: 'rgba(16, 185, 129, 0.1)', dotColor: '#10b981', icon: <CheckCircle size={14} /> },
  'on-break': { label: 'On Break', color: 'rgba(245, 158, 11, 0.1)', dotColor: '#f59e0b', icon: <Coffee size={14} /> },
  'away': { label: 'Away', color: 'rgba(99, 102, 241, 0.1)', dotColor: '#6366f1', icon: <Clock size={14} /> },
  'offline': { label: 'Offline', color: 'rgba(148, 163, 184, 0.1)', dotColor: '#94a3b8', icon: <WifiOff size={14} /> },
};

interface SearchItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'page' | 'agent' | 'action';
}

const initialNotifications: Notification[] = [
  { id: 'n1', type: 'alert', title: 'Queue Overload', message: 'Billing Enquiries queue has exceeded SLA threshold. 22 callers waiting.', time: '2 min ago', read: false },
  { id: 'n2', type: 'call', title: 'Missed VIP Call', message: 'Kavita Nair (Enterprise) tried calling — no available agent.', time: '8 min ago', read: false },
  { id: 'n3', type: 'system', title: 'System Update', message: 'IVR flow "Main Menu v3" deployed successfully across all regions.', time: '25 min ago', read: false },
  { id: 'n4', type: 'chat', title: 'Chat Escalation', message: 'Agent Priya Reddy escalated chat #4821 to Supervisor.', time: '1 hour ago', read: true },
  { id: 'n5', type: 'system', title: 'Agent Status', message: 'Rahul Verma changed status to "Break" at 5:30 PM.', time: '2 hours ago', read: true },
];

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('available');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentStatus = statusConfig[agentStatus];

  // Keyboard shortcut: Ctrl+K for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
        setSearchQuery('');
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowNotifications(false);
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus palette input
  useEffect(() => {
    if (showCommandPalette && paletteInputRef.current) {
      setTimeout(() => paletteInputRef.current?.focus(), 50);
    }
  }, [showCommandPalette]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setShowStatusDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismissNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  const getNotifIcon = (type: string) => {
    if (type === 'call') return <Phone size={16} />;
    if (type === 'chat') return <MessageSquare size={16} />;
    if (type === 'alert') return <AlertTriangle size={16} />;
    return <CheckCircle size={16} />;
  };

  const getNotifColor = (type: string) => {
    if (type === 'alert') return 'var(--danger-500)';
    if (type === 'call') return 'var(--warning-500)';
    if (type === 'chat') return 'var(--primary-500)';
    return 'var(--success-500)';
  };

  // Command palette items
  const allSearchItems: SearchItem[] = [
    { id: 'p1', label: 'Supervisor Wallboard', description: 'Real-time metrics dashboard', icon: <LayoutDashboard size={18} />, action: () => navigate('/'), category: 'page' },
    { id: 'p2', label: 'Agent Desktop', description: 'Omnichannel inbox & controls', icon: <Users size={18} />, action: () => navigate('/agent'), category: 'page' },
    { id: 'p3', label: 'Reports & QA', description: 'Analytics & quality assurance', icon: <BarChart3 size={18} />, action: () => navigate('/reports'), category: 'page' },
    { id: 'p4', label: 'Call History', description: 'Call detail records', icon: <History size={18} />, action: () => navigate('/call-history'), category: 'page' },
    { id: 'p5', label: 'IVR Designer', description: 'Visual IVR flow builder', icon: <GitMerge size={18} />, action: () => navigate('/ivr'), category: 'page' },
    { id: 'p6', label: 'Contacts', description: 'CRM contact directory', icon: <UserCircle size={18} />, action: () => navigate('/contacts'), category: 'page' },
    { id: 'p7', label: 'Settings', description: 'Platform configuration', icon: <Settings size={18} />, action: () => navigate('/settings'), category: 'page' },
    { id: 'a1', label: 'Deepak Sharma', description: 'Supervisor • On Call', icon: <User size={18} />, action: () => navigate('/contacts'), category: 'agent' },
    { id: 'a2', label: 'Priya Reddy', description: 'Agent • Available', icon: <User size={18} />, action: () => navigate('/contacts'), category: 'agent' },
    { id: 'a3', label: 'Amit Joshi', description: 'Agent • On Call', icon: <User size={18} />, action: () => navigate('/contacts'), category: 'agent' },
    { id: 'a4', label: 'Sneha Kapoor', description: 'Agent • Wrap-up', icon: <User size={18} />, action: () => navigate('/contacts'), category: 'agent' },
    { id: 'x1', label: 'Toggle Dark Mode', description: 'Switch theme', icon: <Moon size={18} />, action: () => { toggleTheme(); setShowCommandPalette(false); }, category: 'action' },
    { id: 'x2', label: 'Sign Out', description: 'End your session', icon: <LogOut size={18} />, action: () => { logout(); setShowCommandPalette(false); }, category: 'action' },
  ];

  const filteredItems = searchQuery.trim()
    ? allSearchItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSearchItems;

  const groupedItems = {
    page: filteredItems.filter(i => i.category === 'page'),
    agent: filteredItems.filter(i => i.category === 'agent'),
    action: filteredItems.filter(i => i.category === 'action'),
  };

  const handlePaletteSelect = useCallback((item: SearchItem) => {
    item.action();
    setShowCommandPalette(false);
  }, []);

  return (
    <>
      <header className="header glass">
        {/* Search bar — opens command palette */}
        <div className="header-search" onClick={() => { setShowCommandPalette(true); setSearchQuery(''); }}>
          <Search size={18} className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search interactions, agents, numbers..."
            className="search-input"
            readOnly
            style={{ cursor: 'pointer' }}
          />
          <kbd className="search-shortcut">⌘K</kbd>
        </div>
        
        <div className="header-actions">
          {/* Agent Status Selector */}
          <div className="status-selector-wrapper" ref={statusRef}>
            <button
              className="agent-status-badge"
              style={{ borderColor: currentStatus.dotColor + '40', background: currentStatus.color }}
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <span className="status-dot" style={{ backgroundColor: currentStatus.dotColor }}></span>
              {currentStatus.label}
              <ChevronDown size={14} style={{ marginLeft: '2px', opacity: 0.6 }} />
            </button>

            {showStatusDropdown && (
              <div className="status-dropdown glass animate-fade-in">
                {(Object.keys(statusConfig) as AgentStatus[]).map(key => (
                  <button
                    key={key}
                    className={`status-option ${agentStatus === key ? 'active' : ''}`}
                    onClick={() => { setAgentStatus(key); setShowStatusDropdown(false); }}
                  >
                    <span className="status-dot" style={{ backgroundColor: statusConfig[key].dotColor }}></span>
                    <span>{statusConfig[key].label}</span>
                    {agentStatus === key && <CheckCircle size={14} style={{ marginLeft: 'auto', color: statusConfig[key].dotColor }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="icon-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Notifications */}
          <div className="notification-wrapper" ref={notifRef}>
            <button className="icon-btn notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="notification-panel glass animate-fade-in">
                <div className="notif-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="notif-mark-read" onClick={markAllRead}>Mark all read</button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">
                      <Bell size={24} style={{ opacity: 0.2 }} />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`}>
                        <div className="notif-icon" style={{ color: getNotifColor(n.type) }}>
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="notif-body">
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-message">{n.message}</div>
                          <div className="notif-time">{n.time}</div>
                        </div>
                        <button className="notif-dismiss" onClick={() => dismissNotification(n.id)}>
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="user-profile">
            <div className="avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Agent'}</span>
              <span className="user-role">{user?.role || 'Agent'}</span>
            </div>
          </div>

          <button className="icon-btn" onClick={logout} title="Logout" style={{ marginLeft: '4px' }}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Command Palette Overlay */}
      {showCommandPalette && (
        <div className="command-palette-overlay" onClick={() => setShowCommandPalette(false)}>
          <div className="command-palette glass animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="palette-search">
              <Search size={20} className="palette-search-icon" />
              <input
                ref={paletteInputRef}
                type="text"
                placeholder="Search pages, agents, actions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="palette-input"
              />
              <kbd className="palette-esc">ESC</kbd>
            </div>
            <div className="palette-results">
              {filteredItems.length === 0 ? (
                <div className="palette-empty">
                  <p>No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <>
                  {groupedItems.page.length > 0 && (
                    <div className="palette-group">
                      <div className="palette-group-title">Pages</div>
                      {groupedItems.page.map(item => (
                        <button key={item.id} className="palette-item" onClick={() => handlePaletteSelect(item)}>
                          <div className="palette-item-icon">{item.icon}</div>
                          <div className="palette-item-text">
                            <span className="palette-item-label">{item.label}</span>
                            <span className="palette-item-desc">{item.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {groupedItems.agent.length > 0 && (
                    <div className="palette-group">
                      <div className="palette-group-title">Agents</div>
                      {groupedItems.agent.map(item => (
                        <button key={item.id} className="palette-item" onClick={() => handlePaletteSelect(item)}>
                          <div className="palette-item-icon">{item.icon}</div>
                          <div className="palette-item-text">
                            <span className="palette-item-label">{item.label}</span>
                            <span className="palette-item-desc">{item.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {groupedItems.action.length > 0 && (
                    <div className="palette-group">
                      <div className="palette-group-title">Actions</div>
                      {groupedItems.action.map(item => (
                        <button key={item.id} className="palette-item" onClick={() => handlePaletteSelect(item)}>
                          <div className="palette-item-icon">{item.icon}</div>
                          <div className="palette-item-text">
                            <span className="palette-item-label">{item.label}</span>
                            <span className="palette-item-desc">{item.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
