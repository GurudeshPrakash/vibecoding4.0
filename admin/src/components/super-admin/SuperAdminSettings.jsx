import React, { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Settings as SettingsIcon,
    CreditCard,
    Camera,
    Globe,
    Clock,
    Lock,
    Smartphone,
    CheckCircle2,
    AlertCircle,
    Key
} from 'lucide-react';
import '../../style/super-admin/SuperAdminSettings.css';

const SuperAdminSettings = ({ adminName, setAdminName }) => {
    const [activeTab, setActiveTab] = useState('Account');

    const tabs = [
        { id: 'Account', icon: <User size={20} />, desc: 'Personal details' },
        { id: 'Notifications', icon: <Bell size={20} />, desc: 'Alerts & emails' },
        { id: 'Security', icon: <Shield size={20} />, desc: 'Passwords & 2FA' },
        { id: 'Preferences', icon: <SettingsIcon size={20} />, desc: 'Locale & UI' },
        { id: 'Billing', icon: <CreditCard size={20} />, desc: 'Plans & payments' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Account':
                return (
                    <div className="sas-content-card">
                        <h2 className="sas-section-title">Profile Configuration</h2>
                        <div className="sas-profile-grid">
                            <div>
                                <div className="sas-input-group">
                                    <label className="sas-label">Super Admin Name</label>
                                    <input
                                        className="sas-input"
                                        type="text"
                                        value={adminName}
                                        onChange={(e) => setAdminName(e.target.value)}
                                    />
                                </div>
                                <div className="sas-input-group">
                                    <label className="sas-label">Corporate Email</label>
                                    <input className="sas-input" type="email" defaultValue="master@vibecoding.com" disabled />
                                </div>
                                <div className="sas-input-group">
                                    <label className="sas-label">Authentication Phrase</label>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <input className="sas-input" type="password" defaultValue="*********" disabled />
                                        <button className="sas-btn-secondary">Update</button>
                                    </div>
                                </div>
                                <div style={{ marginTop: '48px' }}>
                                    <button className="sas-btn-primary">
                                        <CheckCircle2 size={18} /> Save Configurations
                                    </button>
                                </div>
                            </div>

                            <div className="sas-profile-pic-area">
                                <div className="sas-avatar-wrapper">
                                    <img className="sas-avatar" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=FF0000&color=fff&size=200`} alt="Profile" />
                                    <button className="sas-avatar-badge" title="Change Avatar">
                                        <Camera size={20} />
                                    </button>
                                </div>
                                <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
                                    High-res images render best.<br />Max size 5MB.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="sas-content-card">
                        <h2 className="sas-section-title">Notification Center</h2>

                        <div className="sas-toggle-item">
                            <div className="sas-toggle-info">
                                <h4>System & Security Alerts</h4>
                                <p>Critical infrastructure notifications and security warnings.</p>
                            </div>
                            <label className="sas-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="sas-slider red"></span>
                            </label>
                        </div>

                        <div className="sas-toggle-item">
                            <div className="sas-toggle-info">
                                <h4>Financial Operations</h4>
                                <p>Alerts for high-volume transactions, failures, and payouts.</p>
                            </div>
                            <label className="sas-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="sas-slider"></span>
                            </label>
                        </div>

                        <div className="sas-toggle-item">
                            <div className="sas-toggle-info">
                                <h4>Manager Activity Reports</h4>
                                <p>Daily summaries of branch manager actions and attendance.</p>
                            </div>
                            <label className="sas-switch">
                                <input type="checkbox" />
                                <span className="sas-slider"></span>
                            </label>
                        </div>
                    </div>
                );
            case 'Security':
                return (
                    <div className="sas-content-card">
                        <h2 className="sas-section-title">Access & Security</h2>

                        <div className="sas-toggle-item" style={{ borderColor: 'rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.02)' }}>
                            <div className="sas-toggle-info">
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-red)' }}>
                                    <Smartphone size={18} /> Two-Factor Authentication (2FA)
                                </h4>
                                <p>Require a biometric or SMS code during super admin logins.</p>
                            </div>
                            <label className="sas-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="sas-slider red"></span>
                            </label>
                        </div>

                        <div style={{ marginTop: '40px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Authentication Logs</h3>

                            <div className="sas-action-row">
                                <div className="sas-toggle-info">
                                    <h4>Cryptographic Key Management</h4>
                                    <p>Last rotated 45 days ago. Recommended every 90 days.</p>
                                </div>
                                <button className="sas-btn-secondary"><Key size={16} /> Rotate Keys</button>
                            </div>

                            <div className="sas-action-row">
                                <div className="sas-toggle-info">
                                    <h4>Active Root Sessions</h4>
                                    <p>3 active sessions across desktop and mobile devices.</p>
                                </div>
                                <button className="sas-danger-btn"><AlertCircle size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Revoke All</button>
                            </div>
                        </div>
                    </div>
                );
            case 'Preferences':
                return (
                    <div className="sas-content-card">
                        <h2 className="sas-section-title">Localization Rules</h2>
                        <div style={{ maxWidth: '480px' }}>
                            <div className="sas-input-group">
                                <label className="sas-label"><Globe size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Global Language</label>
                                <select className="sas-input">
                                    <option value="en">English (United States)</option>
                                    <option value="en-gb">English (United Kingdom)</option>
                                </select>
                            </div>
                            <div className="sas-input-group">
                                <label className="sas-label"><Clock size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Origin Timezone</label>
                                <select className="sas-input">
                                    <option value="SL">Sri Lanka Standard Time (GMT+5:30)</option>
                                    <option value="UTC">Universal Coordinated Time (GMT+0:00)</option>
                                </select>
                            </div>
                            <div className="sas-input-group">
                                <label className="sas-label">Chronology Format</label>
                                <select className="sas-input">
                                    <option value="DD/MM/YYYY">DD / MM / YYYY</option>
                                    <option value="MM/DD/YYYY">MM / DD / YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY - MM - DD</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'Billing':
                return (
                    <div className="sas-content-card">
                        <h2 className="sas-section-title">Enterprise Licensing</h2>

                        <div className="sas-plan-card">
                            <div>
                                <div className="sas-plan-title">Active Contract</div>
                                <div className="sas-plan-name">Super Admin Node</div>
                                <p style={{ margin: 0, opacity: 0.8, fontWeight: 500 }}>Next audit and renewal: <strong>January 01, 2028</strong></p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>$14,500</span>
                                <span style={{ opacity: 0.7, fontWeight: 600 }}>/yr</span>
                            </div>
                        </div>

                        <div className="sas-action-row" style={{ marginTop: '24px' }}>
                            <div className="sas-toggle-info">
                                <h4>Primary Funding Source</h4>
                                <p>Corporate Visa ending in •••• 4242</p>
                            </div>
                            <button className="sas-btn-secondary">Update Source</button>
                        </div>

                        <div className="sas-action-row">
                            <div className="sas-toggle-info">
                                <h4>Invoice Archive</h4>
                                <p>Download past tax documents and enterprise invoices.</p>
                            </div>
                            <button className="sas-btn-secondary">View History</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="sas-container">
            <header className="sas-header">
                <h1 className="sas-title">System Configuration</h1>
                <p className="sas-subtitle">Advanced root controls, security enforcement, and global parameters.</p>
            </header>

            <div className="sas-layout">
                <nav className="sas-nav">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`sas-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <div className="nav-icon">
                                {tab.icon}
                            </div>
                            <div className="sas-nav-text">
                                <h4>{tab.id}</h4>
                                <p>{tab.desc}</p>
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="sas-content-area">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SuperAdminSettings;
