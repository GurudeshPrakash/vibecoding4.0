import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck, UserCircle, Zap } from 'lucide-react';
import logo from '../../shared/assets/logo1.png';
import '../../admin/styles/Login.css';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

const Login = ({ onLogin }) => {
    const { login: authLogin } = useAuth();
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
            const userData = await authService.login(email, password);

            if (rememberMe) {
                localStorage.setItem('unified_remember_me', email);
            } else {
                localStorage.removeItem('unified_remember_me');
            }

            authLogin(userData, userData.token);
            if (onLogin) onLogin(userData);
        } catch (err) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-bg-overlay"></div>

            <div className="login-card animate-scale-in">
                <div className="login-header">
                    <img src={logo} alt="Power World" className="brand-logo-small" />
                    <h1>Welcome Back</h1>
                    <p>Sign in to access your administrative panel</p>
                </div>

                {error && (
                    <div className="error-message-box" style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.825rem', textAlign: 'center', border: '1px solid rgba(255,0,0,0.2)' }}>
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

                    <div className="form-meta">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Remember me</span>
                        </label>
                    </div>

                    <button type="submit" className="login-submit-btn" disabled={isLoading}>
                        {isLoading ? (
                            <div className="loader-container">
                                <Loader2 className="animate-spin" size={20} />
                                <span>Authenticating...</span>
                            </div>
                        ) : (
                            'Log In System'
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '20px' }}>
                        Secure access for authorized personnel only.
                    </p>

                    <div style={{ marginTop: '30px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                            Simulation Portal Hub (Multi-Tab Access Ready)
                        </p>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                                type="button"
                                onClick={() => { setEmail('alex@powerworld.com'); setPassword('admin123'); }}
                                style={{ padding: '6px 12px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid #6366F1', background: '#EEF2FF', color: '#6366F1', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Super Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEmail('daniel@powerworld.com'); setPassword('admin123'); }}
                                style={{ padding: '6px 12px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid #F59E0B', background: '#FFFBEB', color: '#F59E0B', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEmail('nimal@powerworld.com'); setPassword('admin123'); }}
                                style={{ padding: '6px 12px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid #10B981', background: '#ECFDF5', color: '#10B981', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Staff Portal
                            </button>
                        </div>
                        <p style={{ fontSize: '0.6rem', color: '#94A3B8', marginTop: '10px', fontStyle: 'italic' }}>
                            💡 Pro Tip: Open this page in 3 separate tabs to run all portals at once!
                        </p>
                    </div>
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
        .error-message-box {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
        </div>
    );
};

export default Login;
