import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck, UserCircle, Zap } from 'lucide-react';
import logo from '../../shared/assets/logo1.png';
import '../styles/Login.css';

const UnifiedLogin = ({ onLogin, onBack, onGoToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('unified_remember_me');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/shared/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem('unified_remember_me', email);
        } else {
          localStorage.removeItem('unified_remember_me');
        }

        // Standardize storage for all roles
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          phone: data.phone
        }));

        onLogin(data);
      } else {
        setError(data.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection failed. Terminal offline.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-overlay"></div>

      <div className="login-card animate-scale-in" style={{ borderTop: '4px solid #ff0000' }}>
        <div className="login-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <img src={logo} alt="Power World" style={{ height: '60px', filter: 'drop-shadow(0 0 10px rgba(255,0,0,0.2))' }} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '8px' }}>Unified Portal</h1>
          <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>Login to access your specific command level</p>
        </div>

        <div className="role-indicator-pill" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
          <button type="button" onClick={() => { setEmail('alex@powerworld.com'); setPassword('admin123'); }} style={{ cursor: 'pointer', border: '1px dashed #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '6px 14px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, color: '#475569' }}>
            <ShieldCheck size={14} color="#EF4444" /> TEST SUPER ADMIN
          </button>
          <button type="button" onClick={() => { setEmail('daniel@powerworld.com'); setPassword('admin123'); }} style={{ cursor: 'pointer', border: '1px dashed #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '6px 14px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, color: '#475569' }}>
            <Zap size={14} color="#F59E0B" /> TEST ADMIN
          </button>
          <button type="button" onClick={() => { setEmail('nimal@powerworld.com'); setPassword('staff123'); }} style={{ cursor: 'pointer', border: '1px dashed #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '6px 14px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, color: '#475569' }}>
            <UserCircle size={14} color="#10B981" /> TEST STAFF
          </button>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center', border: '1px solid #FEE2E2' }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '8px', display: 'block' }}>Email Sequence</label>
            <div className="input-wrapper" style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <Mail className="input-icon" size={18} color="#94A3B8" />
              <input
                type="email"
                placeholder="name@powerworld.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ fontWeight: 600 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '8px', display: 'block' }}>Access Key</label>
            <div className="input-wrapper" style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <Lock className="input-icon" size={18} color="#94A3B8" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ fontWeight: 600 }}
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className="login-extras" style={{ marginTop: '16px', marginBottom: '24px' }}>
            <label className="remember-me" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#ff0000' }}
              />
              <span>Remember Sequence</span>
            </label>
            <button
              type="button"
              className="forgot-pass"
              onClick={() => onGoToSignUp('forgot-password')}
              style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ff0000' }}
            >
              Reset Key?
            </button>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading} style={{ background: '#111827', borderRadius: '14px', height: '54px', fontWeight: 800, fontSize: '1rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'AUTHENTICATE ACCESS'}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: '32px' }}>
          <p style={{ opacity: 0.6, fontSize: '0.7rem', fontWeight: 600 }}>
            ENCRYPTED COMMAND TERMINAL v4.0.2
          </p>
        </div>
      </div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .login-submit-btn:hover {
          background: #000 !important;
          transform: translateY(-2px);
        }
        .login-submit-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default UnifiedLogin;
