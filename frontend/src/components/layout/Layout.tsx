import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './Layout.css';

export const Layout: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('sparktg_theme') as 'light' | 'dark') || 'light';
  });
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sparktg_theme', theme);
  }, [theme]);

  // Scroll to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main className="main-content" ref={mainRef}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
