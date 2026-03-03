import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import logo from '../../assets/logo1.png';
import '../../style/AdminAuth.css';

const AdminLogin = ({ onLogin, onBack, onGoToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('admin_remember_me');
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
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem('admin_remember_me', email);
        } else {
          localStorage.removeItem('admin_remember_me');
        }

        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify({
          firstName: data.firstName,
          email: data.email
        }));

        onLogin(data);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection failed. Server might be offline.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-overlay"></div>

      <button className="back-btn-top" onClick={onBack}>
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="login-card animate-scale-in">
        <div className="login-header">
          <img src={logo} alt="Power World" className="brand-logo-small" />
          <h1>Admin Login</h1>
          <p>Enter your credentials to access the panel</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="admin@powerworld.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          <div className="login-extras">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
            </label>
            <button
              type="button"
              className="forgot-pass"
              onClick={() => onGoToSignUp('forgot-password')}
              style={{ background: 'none', border: 'none', color: 'var(--color-red)', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Log In'}
          </button>
        </form>

        <div className="login-footer">
          <span>Don't have an admin account?</span>
          <button className="signup-link" onClick={() => onGoToSignUp('signup')}>Sign Up</button>
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
      `}</style>
    </div>
  );
};

export default AdminLogin;
