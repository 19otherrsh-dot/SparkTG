import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { AgentDesktop } from './pages/AgentDesktop';
import { IVRDesigner } from './pages/ivr/IVRDesigner';
import { ReportsQA } from './pages/ReportsQA';
import { Settings } from './pages/Settings';
import { Contacts } from './pages/Contacts';
import { CallHistory } from './pages/CallHistory';
import { LoginPage } from './pages/LoginPage';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <div className="login-spinner" style={{ width: 32, height: 32, border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Role-based index component
const IndexRedirect: React.FC = () => {
  const { user } = useAuth();
  const isAgent = user?.role?.toUpperCase() === 'AGENT';
  
  if (isAgent) {
    return <AgentDesktop />;
  }
  return <Dashboard />;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<IndexRedirect />} />
        <Route path="agent" element={<AgentDesktop />} />
        <Route path="ivr" element={<IVRDesigner />} />
        <Route path="reports" element={<ReportsQA />} />
        <Route path="call-history" element={<CallHistory />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
