import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck, UserCircle, Zap } from 'lucide-react';
import logo from '../../shared/assets/logo1.png';
import '../../admin/styles/Login.css';

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

  const DEV_USERS = [
    {
      firstName: 'Alex',
      lastName: 'Fernando',
      email: 'superadmin@gym.com',
      password: 'SuperAdmin@123',
      role: 'SUPER_ADMIN',
      phone: '0711111111',
      _id: 'DEV-SUPER-ADMIN'
    },
    {
      firstName: 'Daniel',
      lastName: 'Perera',
      email: 'admin@gym.com',
      password: 'Admin@123',
      role: 'ADMIN',
      phone: '0722222222',
      _id: 'DEV-ADMIN'
    },
    {
      firstName: 'Nimal',
      lastName: 'Silva',
      email: 'staff@gym.com',
      password: 'Staff@123',
      role: 'STAFF',
      phone: '0733333333',
      _id: 'DEV-STAFF'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 1. Check Hardcoded Development Users First
    const devUser = DEV_USERS.find(u => u.email === email && u.password === password);

    if (devUser) {
      // Simulate network delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 800));

      const userData = { ...devUser, token: 'dev-token-xyz-123' };

      if (rememberMe) {
        localStorage.setItem('unified_remember_me', email);
      }

      sessionStorage.setItem('admin_token', userData.token);
      sessionStorage.setItem('admin_user', JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName}`,
        userName: `${userData.firstName} ${userData.lastName}`,
        userEmail: userData.email,
        userRole: userData.role,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        _id: userData._id
      }));

      onLogin(userData);
      setIsLoading(false);
      return;
    }

    // 2. Fallback to Backend Login if not a dev user
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

        sessionStorage.setItem('admin_token', data.token);
        sessionStorage.setItem('admin_user', JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          userName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          userEmail: data.email,
          userRole: data.role,
          email: data.email,
          role: data.role,
          phone: data.phone,
          _id: data._id
        }));

        onLogin(data);
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Connection failed. Backend may be offline. Try Dev Users.');
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
          <button type="button" onClick={() => { setEmail('superadmin@gym.com'); setPassword('SuperAdmin@123'); }} style={{ cursor: 'pointer', border: '1px dashed #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '6px 14px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, color: '#475569' }}>
            <ShieldCheck size={14} color="#EF4444" /> TEST SUPER ADMIN
          </button>
          <button type="button" onClick={() => { setEmail('admin@gym.com'); setPassword('Admin@123'); }} style={{ cursor: 'pointer', border: '1px dashed #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '6px 14px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, color: '#475569' }}>
            <Zap size={14} color="#F59E0B" /> TEST ADMIN
          </button>
          <button type="button" onClick={() => { setEmail('staff@gym.com'); setPassword('Staff@123'); }} style={{ cursor: 'pointer', border: '1px dashed #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '6px 14px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, color: '#475569' }}>
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
