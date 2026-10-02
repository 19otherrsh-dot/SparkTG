import React, { useState } from 'react';
import { PhoneCall, Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './pages.css';
import './login.css';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      <div className="login-container animate-fade-in">
        {/* Left Side — Branding */}
        <div className="login-hero">
          <div className="hero-content">
            <div className="hero-logo">
              <div className="hero-logo-icon">
                <PhoneCall size={32} />
              </div>
              <h1>SparkTG <span>Nexus</span></h1>
            </div>
            <p className="hero-tagline">
              Next-Generation Unified Communications Platform
            </p>
            <div className="hero-features">
              <div className="hero-feature">
                <Zap size={18} />
                <span>Omnichannel Contact Center</span>
              </div>
              <div className="hero-feature">
                <Zap size={18} />
                <span>AI-Powered Agent Assist</span>
              </div>
              <div className="hero-feature">
                <Zap size={18} />
                <span>Visual IVR Designer</span>
              </div>
              <div className="hero-feature">
                <Zap size={18} />
                <span>Real-Time Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Login Form */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your command center</p>

            {error && (
              <div className="login-error animate-slide-up">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="deepak@sparktg.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="login-spinner"></span>
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p style={{ marginBottom: '12px' }}>Quick Demo Login</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="demo-role-btn"
                  onClick={() => { setEmail('supervisor@sparktg.com'); setPassword('demo123'); }}
                >
                  <span className="demo-role-dot" style={{ backgroundColor: '#6366f1' }}></span>
                  Supervisor
                </button>
                <button
                  type="button"
                  className="demo-role-btn"
                  onClick={() => { setEmail('agent@sparktg.com'); setPassword('demo123'); }}
                >
                  <span className="demo-role-dot" style={{ backgroundColor: '#10b981' }}></span>
                  Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
