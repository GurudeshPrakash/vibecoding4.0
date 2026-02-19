import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import logo from '../../assets/logo1.png';
import '../../style/StaffAuth.css';

const StaffLogin = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const savedEmail = localStorage.getItem('staff_remember_me');
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
            const response = await fetch('http://localhost:5000/api/staff/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                if (rememberMe) {
                    localStorage.setItem('staff_remember_me', email);
                } else {
                    localStorage.removeItem('staff_remember_me');
                }

                // Store auth data
                localStorage.setItem('staff_token', data.token);
                localStorage.setItem('staff_current_log', data.logId);
                localStorage.setItem('staff_user_info', JSON.stringify({
                    firstName: data.firstName,
                    email: data.email,
                    branch: data.branch
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
                    <h1>Staff Portal</h1>
                    <p>Power World Gym Management System</p>
                </div>

                {error && <div className="auth-error-msg">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Staff Email</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                placeholder="name@powerworld.com"
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
                    </div>

                    <button type="submit" className="login-submit-btn" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Access Panel'}
                    </button>
                </form>

                <div className="login-footer">
                    <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                        Protected System. Access restricted to authorized personnel.
                    </p>
                </div>
            </div>

            <style>{`
                .auth-error-msg {
                    background: rgba(255, 0, 0, 0.1);
                    color: #ff4444;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-size: 0.85rem;
                    text-align: center;
                    border: 1px solid rgba(255, 0, 0, 0.2);
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

export default StaffLogin;
