import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'AGENT' | 'SUPERVISOR';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  apiFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sparktg_token'));
  const navigate = useNavigate();

  useEffect(() => {
    // If we have a token but no user, we could fetch profile. For MVP, we decode from token or just wait for login.
    // Real app would hit /api/auth/profile with the token.
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload as User);
      } catch (e) {
        logout();
      }
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('sparktg_token', data.token);
        return true;
      }
    } catch (err) {
      console.error('Login failed', err);
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sparktg_token');
    navigate('/login');
  };

  // Wrapper for fetch that adds the Authorization header
  const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const currentToken = localStorage.getItem('sparktg_token');
    const headers = {
      ...init?.headers,
      ...(currentToken ? { 'Authorization': `Bearer ${currentToken}` } : {})
    };

    const res = await fetch(input, { ...init, headers });
    
    if (res.status === 401) {
      logout();
    }
    
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
