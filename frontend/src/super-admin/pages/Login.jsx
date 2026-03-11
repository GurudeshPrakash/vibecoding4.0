import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import logo from '../../shared/assets/logo1.png';
import '../../admin/styles/AdminAuth.css';

const SuperAdminLogin = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Developer Provided Credentials (STRICT):
    // Email: superadmin@powerworld.com
    // Password: password123

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
                // STRICT CHECK: ONLY allow super_admin role for this portal
                if (data.role !== 'super_admin') {
                    setError('STRICT ACCESS DENIED: Regular Admin credentials cannot access the Super Admin Portal.');
                    setIsLoading(false);
                    return;
                }

                sessionStorage.setItem('admin_token', data.token);
                sessionStorage.setItem('admin_current_log', data.logId);
                sessionStorage.setItem('admin_user', JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    role: data.role,
                    phone: data.phone
                }));

                onLogin(data);
            } else {
                setError(data.message || 'Verification failed. Invalid Super Admin credentials.');
            }
        } catch (err) {
            setError('System link failed. Super Admin authentication server is unreachable.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page sa-login-mode">
            <div className="login-bg-overlay sa-overlay"></div>

            <button className="back-btn-top sa-back" onClick={onBack}>
                <ArrowLeft size={20} />
                <span>Back to Portal</span>
            </button>

            <div className="login-card sa-card-premium animate-scale-in">
                <div className="login-header">
                    <div className="sa-shield-icon">
                        <ShieldCheck size={48} color="#FF0000" />
                    </div>
                    <img src={logo} alt="Power World" className="brand-logo-small" />
                    <h1 className="sa-title">Admin Portal</h1>
                    <p className="sa-subtitle">High-level System Access Authorization</p>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                        <button type="button" onClick={() => { setEmail('alex@powerworld.com'); setPassword('admin123'); }} style={{ background: 'rgba(255,0,0,0.1)', border: '1px dashed #ff0000', color: '#ff4444', padding: '6px 14px', borderRadius: '14px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ShieldCheck size={14} /> AUTOHACK (LOAD TEST SECRETS)
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="sa-error-box animate-shake">
                        <ShieldAlert size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Super Admin Email</label>
                        <div className="input-wrapper sa-input">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                placeholder="superadmin@powerworld.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Secure Key / Password</label>
                        <div className="input-wrapper sa-input">
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

                    <button type="submit" className="login-submit-btn sa-submit-btn" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} style={{ marginRight: '10px' }} />
                                Authenticating...
                            </>
                        ) : 'Authorize Portal Access'}
                    </button>
                </form>

                <div className="login-footer">
                    <p className="sa-restriction-notice">
                        WARNING: This is a restricted system. All login attempts are logged and monitored.
                        Unauthorized access is strictly prohibited.
                    </p>
                </div>
            </div>

            <style>{`
                .sa-login-mode {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
                }
                .sa-overlay {
                    background: 
                        radial-gradient(circle at 10% 20%, rgba(255, 0, 0, 0.08) 0%, transparent 40%),
                        radial-gradient(circle at 90% 80%, rgba(255, 0, 0, 0.1) 0%, transparent 40%) !important;
                }
                .sa-card-premium {
                    background: rgba(15, 23, 42, 0.95) !important;
                    border: 1px solid rgba(255, 0, 0, 0.2) !important;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255,0,0,0.1) !important;
                }
                .sa-title {
                    color: #ffffff !important;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .sa-subtitle {
                    color: #94a3b8 !important;
                    font-weight: 700 !important;
                }
                .sa-shield-icon {
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: center;
                }
                .sa-input input {
                    background: #1e293b !important;
                    border-color: #334155 !important;
                    color: #f1f5f9 !important;
                }
                .sa-input input:focus {
                    border-color: #ef4444 !important;
                    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2) !important;
                }
                .form-group label {
                    color: #94a3b8 !important;
                }
                .sa-submit-btn {
                    background: #ef4444 !important;
                    height: 54px;
                }
                .sa-restriction-notice {
                    color: #ef4444 !important;
                    font-size: 0.75rem !important;
                    font-weight: 700 !important;
                    line-height: 1.4;
                    opacity: 0.8;
                }
                .sa-error-box {
                    background: rgba(255, 0, 0, 0.1);
                    border: 1px solid rgba(255, 0, 0, 0.2);
                    color: #ff4444;
                    padding: 12px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                }
                .sa-back {
                    background: #1e293b !important;
                    border-color: #334155 !important;
                    color: #cbd5e1 !important;
                }
                .sa-back:hover {
                    color: #ff4444 !important;
                    border-color: #ef4444 !important;
                    background: #0f172a !important;
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
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

export default SuperAdminLogin;
