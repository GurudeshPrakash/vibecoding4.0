import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import logo from '../../assets/logo1.png';
import '../../style/admin/AdminAuth.css';

const ForgotPassword = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/shared/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
            } else {
                setError(data.message || 'Something went wrong.');
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
                <span>Back to Login</span>
            </button>

            <div className="login-card animate-scale-in">
                <div className="login-header">
                    <img src={logo} alt="Power World" className="brand-logo-small" />
                    <h1>Forgot Password</h1>
                    <p>Enter the email address you used to log in.</p>
                </div>

                {message ? (
                    <div className="success-container animate-fade-in" style={{ textAlign: 'center', padding: '20px' }}>
                        <CheckCircle2 size={48} color="#4caf50" style={{ margin: '0 auto 16px' }} />
                        <p style={{ color: 'var(--color-text)', marginBottom: '24px' }}>{message}</p>
                        <button className="login-submit-btn" onClick={onBack}>Return to Login</button>
                    </div>
                ) : (
                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && (
                            <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

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

                        <button type="submit" className="login-submit-btn" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
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

export default ForgotPassword;
