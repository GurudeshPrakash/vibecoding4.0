import React, { useState, useMemo } from 'react';
import { Mail, Lock, User, Phone, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import logo from '../../assets/logo1.png';
import '../../style/admin/AdminAuth.css';

const AdminSignUp = ({ onSignUpSuccess, onBack, onGoToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = useMemo(() => {
    const pass = formData.password;
    if (!pass) return { score: 0, label: '', emoji: '' };

    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[!@#$%&*?]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', emoji: '😕', class: 'weak' };
    if (score === 2) return { score: 2, label: 'Medium', emoji: '😐', class: 'medium' };
    return { score: 3, label: 'Strong', emoji: '🤩', class: 'strong' };
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Please use a stronger password!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: '+94' + formData.phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify({
          firstName: data.firstName,
          email: data.email
        }));

        alert("Admin Registration Successful!");
        onSignUpSuccess();
      } else {
        setError(data.message || 'Registration failed.');
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
          <h1>Admin Sign Up</h1>
          <p>Create your admin account for the panel</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="firstName"
                  placeholder="Admin"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Sur Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="lastName"
                  placeholder="User"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                name="email"
                placeholder="admin@powerworld.com"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
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
            <div className="password-requirements">
              Password must have:<br />
              • Min. 8 characters<br />
              • At least one uppercase (A-Z)<br />
              • At least one symbol: ! @ # $ % & * ?
            </div>
            {formData.password && (
              <div className={`strength-indicator`}>
                <div className={`strength-bar ${passwordStrength.class}`}>
                  <div className="fill"></div>
                </div>
                <span className={`strength-text ${passwordStrength.class}`}>
                  {passwordStrength.emoji} {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <div className="phone-input-container">
              <div className="country-code">+94</div>
              <div className="phone-number-field input-wrapper" style={{ flex: 1 }}>
                <Phone className="input-icon" size={18} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="77 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
          </button>
        </form>

        <div className="login-footer">
          <span>Already have an admin account?</span>
          <button className="signup-link" onClick={onGoToLogin}>Log In</button>
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

export default AdminSignUp;
