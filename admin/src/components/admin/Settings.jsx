import React, { useState } from 'react';
<<<<<<< HEAD
import {
  User,
  Bell,
  Shield,
  Settings as SettingsIcon,
  CreditCard,
  Camera,
  Globe,
  Clock,
  Lock
} from 'lucide-react';
import '../../style/AdminSettings.css';

const Settings = ({ adminName, setAdminName }) => {
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
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" defaultValue="admin@gymsys.com" />
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
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=FF0000&color=fff&size=200`} alt="Profile" />
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
                <h4 style={{ color: 'var(--color-ash)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>CURRENT PLAN</h4>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '8px', color: 'var(--color-text)' }}>Enterprise Professional</h3>
                <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>Next billing date: <strong>April 01, 2026</strong></p>
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
=======
import { User, Bell, Monitor, Camera, Save, BellRing, Settings as SettingsIcon } from 'lucide-react';
import '../../style/AdminSettings.css';

const Settings = ({
  adminName,
  setAdminName,
  profileImage,
  setProfileImage,
  realTimeUpdates,
  setRealTimeUpdates
}) => {
  const [phone, setPhone] = useState('+94 77 999 8888');
  const [notifications, setNotifications] = useState({
    all: true,
    dismantled: true,
    maintenance: true
  });

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
>>>>>>> main
    }
  };

  return (
    <div className="settings-page">
<<<<<<< HEAD
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
=======
      <header className="content-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure your profile, notification preferences, and system appearance.</p>
        </div>
      </header>

      <div className="settings-grid">
        {/* Admin Profile Settings */}
        <section className="settings-section card">
          <div className="section-header-top">
            <User size={20} color="var(--color-red)" />
            <h3>Admin Profile Settings</h3>
          </div>

          <div className="profile-edit-container">
            <div className="avatar-edit">
              <div className="large-avatar">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="settings-avatar-img" />
                ) : (
                  <User size={40} />
                )}
                <label className="camera-btn" title="Update Profile Photo">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <p className="avatar-hint">Click the camera to upload a new photo</p>
            </div>

            <div className="form-group">
              <label>Admin Name</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Enter admin name"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <button className="btn-save">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="settings-section card">
          <div className="section-header-top">
            <Bell size={20} color="var(--color-red)" />
            <h3>Notification Settings</h3>
          </div>

          <div className="options-list">
            <div className="settings-option">
              <div className="option-info">
                <h4>Master Notifications</h4>
                <p>Turn all system notifications ON/OFF</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.all}
                  onChange={() => handleToggleNotification('all')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className={`sub-options ${!notifications.all ? 'disabled' : ''}`}>
              <div className="settings-option">
                <div className="option-info">
                  <h4>Dismantled Updates</h4>
                  <p>Alert when equipment is marked as dismantled</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.dismantled}
                    onChange={() => handleToggleNotification('dismantled')}
                    disabled={!notifications.all}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="option-info">
                  <h4>Maintenance Alerts</h4>
                  <p>Alert for equipment status changes to maintenance</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.maintenance}
                    onChange={() => handleToggleNotification('maintenance')}
                    disabled={!notifications.all}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </section>


        {/* System Preferences */}
        <section className="settings-section card">
          <div className="section-header-top">
            <Monitor size={20} color="var(--color-red)" />
            <h3>System Preferences</h3>
          </div>

          <div className="settings-option">
            <div className="option-info">
              <h4>Real-time Dashboard</h4>
              <p>Immediately reflect equipment changes without refresh</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={realTimeUpdates}
                onChange={() => setRealTimeUpdates(!realTimeUpdates)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>
      </div>

>>>>>>> main
    </div>
  );
};

export default Settings;
