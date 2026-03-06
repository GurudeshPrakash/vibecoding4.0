import React, { useState } from 'react';
import { User, Bell, Shield, Globe, CreditCard, Camera, Save, Lock, LogOut, Check } from 'lucide-react';
import '../../style/admin/AdminSettings.css';

const Settings = ({
  adminName,
  setAdminName,
  profileImage,
  setProfileImage
}) => {
  const [activeTab, setActiveTab] = useState('Account');
  const [email, setEmail] = useState('admin@gym.com');
  const [password, setPassword] = useState('********');
  const [localProfileImage, setLocalProfileImage] = useState(null);

  const [preferences, setPreferences] = useState({
    notifications: true,
    language: 'English',
    timezone: 'UTC+5:30 (Colombo)',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-hour'
  });

  const [notifSettings, setNotifSettings] = useState({
    systemAlerts: true,
    payments: true,
    maintenance: false
  });

  const [security, setSecurity] = useState({
    twoStep: false,
    currentPassword: '',
    newPassword: ''
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (section) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert(`${section} settings updated successfully!`);
    }, 600);
  };

  const tabs = [
    { id: 'Account', icon: <User size={14} /> },
    { id: 'Notifications', icon: <Bell size={14} /> },
    { id: 'Security', icon: <Shield size={14} /> },
    { id: 'Preferences', icon: <Globe size={14} /> },
    { id: 'Billing', icon: <CreditCard size={14} /> }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfileImage(reader.result);
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Account':
        return (
          <div className="settings-content-card">
            <div className="profile-split">
              <div className="profile-left">
                <div className="form-group">
                  <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>Full Name</label>
                  <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="Full Name" style={{ fontSize: '0.78rem', padding: '10px' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" style={{ fontSize: '0.78rem', padding: '10px' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>Password</label>
                  <div className="input-with-action">
                    <input type="password" value={password} disabled placeholder="Current Password" style={{ fontSize: '0.78rem', padding: '10px' }} />
                    <button
                      className="text-action-btn"
                      onClick={() => {
                        setActiveTab('Security');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{ fontSize: '0.7rem', fontWeight: 700 }}
                    >
                      Change
                    </button>
                  </div>
                </div>
                <div className="profile-actions-bottom">
                  <button
                    className="btn-save"
                    onClick={() => handleSave('Profile')}
                    disabled={saving}
                    style={{ fontSize: '0.72rem', padding: '8px 16px' }}
                  >
                    {saving ? 'Saving...' : <><Save size={14} /> Update Profile</>}
                  </button>
                </div>
              </div>
              <div className="profile-right">
                <div className="profile-avatar-container">
                  <div className="large-avatar-frame" style={{ width: '120px', height: '120px' }}>
                    {(localProfileImage || profileImage) ? <img src={localProfileImage || profileImage} alt="Profile" className="settings-avatar-img" /> : <User size={40} color="var(--color-text-dim)" />}
                  </div>
                  <label className="edit-photo-btn" style={{ fontSize: '0.65rem', padding: '6px 12px' }}>
                    <Camera size={12} /> Edit Photo
                    <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Notifications':
        return (
          <div className="settings-content-card">
            <h3 className="section-title-professional" style={{ fontSize: '0.9rem' }}>Notifications</h3>
            <div className="options-list-wide">
              {['System Alerts', 'Payment Notifications', 'Maintenance Alerts'].map((item, idx) => (
                <div className="settings-option" key={idx}>
                  <div className="option-info">
                    <h4 style={{ fontSize: '0.78rem' }}>{item}</h4>
                    <p style={{ fontSize: '0.68rem' }}>Configure your preferences for {item.toLowerCase()}.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={idx < 2} />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
              <div className="profile-actions-bottom">
                <button
                  className="btn-save"
                  onClick={() => handleSave('Notification')}
                  disabled={saving}
                  style={{ fontSize: '0.72rem', padding: '8px 16px' }}
                >
                  {saving ? 'Saving...' : <><Save size={14} /> Save Alerts</>}
                </button>
              </div>
            </div>
          </div>
        );
      case 'Security':
        return (
          <div className="settings-content-card">
            <h3 className="section-title-professional" style={{ fontSize: '0.9rem' }}>Security Settings</h3>
            <div className="options-list-wide">
              <div className="form-group-row">
                <div className="form-group">
                  <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>Current Password</label>
                  <input
                    type="password"
                    placeholder="Current"
                    style={{ fontSize: '0.78rem', padding: '10px' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>New Password</label>
                  <input
                    type="password"
                    placeholder="New"
                    style={{ fontSize: '0.78rem', padding: '10px' }}
                  />
                </div>
              </div>
              <div className="settings-option" style={{ marginTop: '20px' }}>
                <div className="option-info">
                  <h4 style={{ fontSize: '0.78rem' }}>Two-Step Verification</h4>
                  <p style={{ fontSize: '0.68rem' }}>Add an extra layer of security to your account</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={security.twoStep} onChange={() => setSecurity(s => ({ ...s, twoStep: !s.twoStep }))} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="profile-actions-bottom" style={{ gap: '12px' }}>
                <button
                  className="btn-save"
                  onClick={() => handleSave('Security')}
                  disabled={saving}
                  style={{ fontSize: '0.72rem', padding: '8px 16px' }}
                >
                  {saving ? 'Updating...' : <><Save size={14} /> Update Security</>}
                </button>
              </div>
            </div>
          </div>
        );
      case 'Preferences':
        return (
          <div className="settings-content-card">
            <h3 className="section-title-professional" style={{ fontSize: '0.9rem' }}>Global Preferences</h3>
            <div className="options-list-wide">
              <div className="form-group">
                <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>Time Zone</label>
                <select className="simple-select-full" value={preferences.timezone} onChange={(e) => setPreferences(p => ({ ...p, timezone: e.target.value }))} style={{ fontSize: '0.78rem', padding: '10px' }}>
                  <option>UTC+5:30 (Colombo)</option>
                  <option>UTC+0:00 (GMT)</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>Default Language</label>
                <select className="simple-select-full" value={preferences.language} onChange={(e) => setPreferences(p => ({ ...p, language: e.target.value }))} style={{ fontSize: '0.78rem', padding: '10px' }}>
                  <option>English</option>
                  <option>Tamil</option>
                  <option>Sinhala</option>
                </select>
              </div>
              <div className="profile-actions-bottom">
                <button
                  className="btn-save"
                  onClick={() => handleSave('Preference')}
                  disabled={saving}
                  style={{ fontSize: '0.72rem', padding: '8px 16px' }}
                >
                  {saving ? 'Saving...' : <><Save size={14} /> Save Preferences</>}
                </button>
              </div>
            </div>
          </div>
        );
      case 'Billing':
        return (
          <div className="settings-content-card">
            <h3 className="section-title-professional" style={{ fontSize: '0.9rem' }}>Billing & Invoices</h3>
            <div className="options-list-wide">
              <div className="billing-summary">
                <div className="billing-item" style={{ fontSize: '0.75rem' }}>
                  <span>Current Plan</span>
                  <strong>Enterprise Super Admin</strong>
                </div>
              </div>
              <button
                className="btn-save-outline"
                onClick={() => alert('Redirecting to Billing Portal...')}
                style={{ fontSize: '0.72rem', padding: '8px 16px' }}
              >
                <CreditCard size={14} /> Manage Billing
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <header className="content-header">
        <h1 className="page-title" style={{ fontSize: '1.4rem', fontWeight: 800 }}>Settings</h1>
        <p className="page-subtitle" style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>Manage your account settings and preferences</p>
      </header>

      <div className="settings-tabs" style={{ gap: '10px', marginBottom: '24px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ fontSize: '0.75rem', padding: '8px 16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {tab.icon}
            {tab.id}
          </button>
        ))}
      </div>

      <div className="settings-container-new">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;

