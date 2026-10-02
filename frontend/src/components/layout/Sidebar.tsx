import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PhoneCall, Users, GitMerge, BarChart3, Settings, UserCircle, History } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isSupervisor = user?.role?.toUpperCase() === 'SUPERVISOR';

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <PhoneCall size={20} className="text-primary-500" />
          </div>
          <span className="logo-text">SparkTG Nexus</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {/* Analytics — Supervisor only */}
        {isSupervisor && (
          <div className="nav-group">
            <span className="nav-group-title">Analytics</span>
            <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Supervisor Wallboard</span>
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <BarChart3 size={18} />
              <span>Reports & QA</span>
            </NavLink>
            <NavLink to="/call-history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <History size={18} />
              <span>Call History</span>
            </NavLink>
          </div>
        )}

        {/* Contact Center — shared */}
        <div className="nav-group">
          <span className="nav-group-title">Contact Center</span>
          <NavLink to={isSupervisor ? '/agent' : '/'} end={!isSupervisor} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            <span>Agent Desktop</span>
          </NavLink>
          {isSupervisor && (
            <>
              <NavLink to="/ivr" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <GitMerge size={18} />
                <span>IVR Designer</span>
              </NavLink>
              <NavLink to="/contacts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <UserCircle size={18} />
                <span>Contacts</span>
              </NavLink>
            </>
          )}
        </div>

        <div className="nav-group mt-auto">
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};
