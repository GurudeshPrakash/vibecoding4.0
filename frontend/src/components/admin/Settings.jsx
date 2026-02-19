import React, { useState } from 'react';
import { User, Bell, Monitor, Palette, Camera, Save, BellRing, Settings as SettingsIcon } from 'lucide-react';
import '../../style/AdminSettings.css';

const Settings = ({
  adminName,
  setAdminName,
  profileImage,
  setProfileImage,
  theme,
  toggleTheme,
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
    }
  };

  return (
    <div className="settings-page">
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

        {/* Theme & Display Settings */}
        <section className="settings-section card">
          <div className="section-header-top">
            <Palette size={20} color="var(--color-red)" />
            <h3>Theme & Appearance</h3>
          </div>

          <div className="theme-selector-group">
            <div className="settings-option">
              <div className="option-info">
                <h4>Dark Mode</h4>
                <p>Use the sleek dark interface (Black & Ash)</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="theme-color-preview">
              <label>Theme Colors</label>
              <div className="color-dots">
                <div className="color-dot" style={{ background: 'var(--color-red)' }} title="Primary Red"></div>
                <div className="color-dot" style={{ background: 'var(--color-bg)' }} title="Background"></div>
                <div className="color-dot" style={{ background: 'var(--color-surface)' }} title="Surface"></div>
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

    </div>
  );
};

export default Settings;
