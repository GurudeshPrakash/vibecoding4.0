import React, { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Settings as SettingsIcon,
    CreditCard,
    Camera,
    ChevronRight,
    Lock,
    Globe,
    Clock
} from 'lucide-react';
import '../../style/Settings.css';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('Account');

    const tabs = [
        { id: 'Account', icon: <User size={18} /> },
        { id: 'Notifications', icon: <Bell size={18} /> },
        { id: 'Security', icon: <Shield size={18} /> },
        { id: 'Preferences', icon: <SettingsIcon size={18} /> },
        { id: 'Billing', icon: <CreditCard size={18} /> }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Account':
                return (
                    <div className="settings-section account-layout">
                        <div className="profile-details">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" defaultValue="Shahana Kuganesan" />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" defaultValue="shahana@gymsys.com" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input type="password" defaultValue="********" disabled />
                                    <button className="btn-secondary">Change</button>
                                </div>
                            </div>
                            <div style={{ marginTop: '40px' }}>
                                <button className="btn-primary">Save Changes</button>
                            </div>
                        </div>
                        <div className="profile-picture-section">
                            <div className="profile-pic-container">
                                <img src="https://ui-avatars.com/api/?name=Shahana+Kuganesan&background=FF0000&color=fff&size=200" alt="Profile" />
                            </div>
                            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Camera size={16} /> Edit Photo
                            </button>
                        </div>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="settings-section settings-list">
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <h4>System Alerts</h4>
                                <p>Get notified about system updates and maintenance.</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <h4>Payment Notifications</h4>
                                <p>Receive alerts for pending and successful payments.</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <h4>Maintenance Notifications</h4>
                                <p>Be informed when hardware or facility maintenance is scheduled.</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                );
            case 'Security':
                return (
                    <div className="settings-section">
                        <div className="security-card">
                            <div className="settings-item" style={{ border: 'none', padding: 0 }}>
                                <div className="settings-item-info">
                                    <h4>Two-Step Verification</h4>
                                    <p>Add an extra layer of security to your account.</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                        <div className="settings-list">
                            <div className="settings-item">
                                <div className="settings-item-info">
                                    <h4>Password Management</h4>
                                    <p>Last changed 3 months ago</p>
                                </div>
                                <button className="btn-secondary">Update Password</button>
                            </div>
                            <div className="settings-item">
                                <div className="settings-item-info">
                                    <h4>Active Sessions</h4>
                                    <p>Manage devices currently logged into your account</p>
                                </div>
                                <span className="danger-text">Logout from all devices</span>
                            </div>
                        </div>
                    </div>
                );
            case 'Preferences':
                return (
                    <div className="settings-section">
                        <div className="form-group" style={{ maxWidth: '400px' }}>
                            <label><Globe size={14} style={{ marginRight: '8px' }} /> Language</label>
                            <select defaultValue="en">
                                <option value="en">English (US)</option>
                                <option value="en-gb">English (UK)</option>
                                <option value="si">Sinhala</option>
                                <option value="ta">Tamil</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ maxWidth: '400px' }}>
                            <label><Clock size={14} style={{ marginRight: '8px' }} /> Timezone</label>
                            <select defaultValue="SL">
                                <option value="SL">Sri Lanka (GMT+5:30)</option>
                                <option value="UTC">UTC (GMT+0:00)</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ maxWidth: '400px' }}>
                            <label>Date Format</label>
                            <select defaultValue="DD/MM/YYYY">
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                );
            case 'Billing':
                return (
                    <div className="settings-section">
                        <div className="security-card" style={{ background: '#F9FAFB' }}>
                            <div className="settings-item-info">
                                <h4 style={{ color: 'var(--color-ash)' }}>CURRENT PLAN</h4>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '8px' }}>Enterprise Professional</h3>
                                <p style={{ marginTop: '12px' }}>Next billing date: <strong>April 01, 2026</strong></p>
                            </div>
                        </div>
                        <div className="settings-list">
                            <div className="settings-item">
                                <div className="settings-item-info">
                                    <h4>Payment Methods</h4>
                                    <p>Visa ending in 4242</p>
                                </div>
                                <button className="btn-secondary">Manage</button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="settings-page">
            <header className="settings-header">
                <h1>Settings</h1>
                <p>Manage your account settings and preferences</p>
            </header>

            <nav className="settings-nav">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.id}
                    </div>
                ))}
            </nav>

            <div className="settings-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default SettingsPage;
