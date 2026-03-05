import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import logo from '../../assets/logo1.png';
import '../../style/admin/AdminAuth.css';

const ResetPassword = ({ token, onComplete }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validatePassword = (pass) => {
        return (
            pass.length >= 8 &&
            /[A-Z]/.test(pass) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(pass)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password does not meet the requirements');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:5000/api/shared/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onComplete();
                }, 3000);
            } else {
                setError(data.message || 'Reset failed. Token may be expired.');
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

            <div className="login-card animate-scale-in">
                <div className="login-header">
                    <img src={logo} alt="Power World" className="brand-logo-small" />
                    <h1>Set New Password</h1>
                    <p>Enter your new secure password below</p>
                </div>

                {success ? (
                    <div className="success-container animate-fade-in" style={{ textAlign: 'center', padding: '20px' }}>
                        <CheckCircle2 size={48} color="#4caf50" style={{ margin: '0 auto 16px' }} />
                        <h2 style={{ color: '#4caf50', marginBottom: '8px' }}>Success!</h2>
                        <p style={{ color: 'var(--color-text)' }}>Password changed successfully.</p>
                        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', marginTop: '16px' }}>Redirecting to login...</p>
                    </div>
                ) : (
                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && (
                            <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <XCircle size={16} /> {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label>New Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="input-wrapper">
                                <ShieldCheck className="input-icon" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="password-rules" style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-text-dim)' }}>Password Requirements:</p>
                            <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
                                <li style={{ fontSize: '0.7rem', color: password.length >= 8 ? '#4caf50' : 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} /> Minimum 8 characters
                                </li>
                                <li style={{ fontSize: '0.7rem', color: /[A-Z]/.test(password) ? '#4caf50' : 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} /> At least one Uppercase letter
                                </li>
                                <li style={{ fontSize: '0.7rem', color: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? '#4caf50' : 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} /> At least one Special character / Symbol
                                </li>
                            </ul>
                        </div>

                        <button type="submit" className="login-submit-btn" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>

            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
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

export default ResetPassword;
