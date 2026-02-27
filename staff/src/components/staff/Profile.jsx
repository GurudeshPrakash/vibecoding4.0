import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, Lock, Camera, Save, Shield, UserCircle,
    Calendar, Clock, Activity, Settings, Bell, LogOut,
    MapPin, Briefcase, Building2, Key, ToggleLeft, ToggleRight,
    CheckCircle2, Edit3, RefreshCw, Hash, ChevronRight, AlertCircle
} from 'lucide-react';
import '../../style/StaffProfile.css';

const StaffProfile = ({ staffInfo, setProfileImage, onLogoutTrigger }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const [twoFA, setTwoFA] = useState(false);
    const [notifEnabled, setNotifEnabled] = useState(true);
    const [profileImg, setProfileImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    const [formData, setFormData] = useState(() => {
        try {
            const s = JSON.parse(localStorage.getItem('staff_user_info')) || {};
            return {
                firstName: s.firstName || '',
                lastName: s.lastName || '',
                email: s.email || '',
                phone: s.phone || '',
                branch: s.branch || '',
                role: s.role || 'staff',
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
        } catch {
            return { firstName: '', lastName: '', email: '', phone: '', branch: '', role: 'staff', oldPassword: '', newPassword: '', confirmPassword: '' };
        }
    });

    const [staffMeta, setStaffMeta] = useState({
        userId: '',
        dateJoined: '',
        lastLogin: ''
    });

    const [activityLogs, setActivityLogs] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('staff_token');
                const response = await fetch('/api/staff/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormData(prev => ({
                        ...prev,
                        firstName: data.firstName || prev.firstName,
                        lastName: data.lastName || prev.lastName,
                        email: data.email || prev.email,
                        phone: data.phone || prev.phone,
                        branch: data.branch || prev.branch,
                        role: data.role || prev.role,
                    }));
                    setStaffMeta({
                        userId: data._id || '—',
                        dateJoined: data.createdAt
                            ? new Date(data.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                            : '—',
                        lastLogin: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    });
                    if (data.profilePicture) {
                        setProfileImg(data.profilePicture);
                        setProfileImage(data.profilePicture);
                    }
                }
            } catch (error) {
                console.error('Profile load failed:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [setProfileImage]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImg(reader.result);
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const token = localStorage.getItem('staff_token');
            const body = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                profilePicture: profileImg,
                ...(formData.newPassword ? { password: formData.newPassword } : {})
            };
            const res = await fetch('/api/staff/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
                setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
                setProfileImage(profileImg);
            } else {
                const err = await res.json();
                alert(err.message || "Update failed");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const roleLabelMap = { staff: 'Staff Member', admin: 'Admin', manager: 'Manager', super_admin: 'Super Admin' };
    const roleLabel = roleLabelMap[formData.role] || 'Staff Member';
    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: <User size={16} /> },
        { id: 'account', label: 'Account', icon: <Shield size={16} /> },
        { id: 'activity', label: 'Activity', icon: <Activity size={16} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    ];

    return (
        <div className="sp-page">
            {/* ── HERO CARD ── */}
            <div className="sp-hero-card">
                <div className="sp-hero-banner">
                    <div className="sp-hero-pattern" />
                </div>
                <div className="sp-hero-body">
                    <div className="sp-hero-avatar-wrap">
                        <div className="sp-hero-avatar">
                            {profileImg
                                ? <img src={profileImg} alt="avatar" />
                                : <User size={52} color="#bbb" />}
                        </div>
                        <label className="sp-avatar-cam" title="Change photo">
                            <Camera size={13} color="#fff" />
                            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </label>
                    </div>

                    <div className="sp-hero-info">
                        <div className="sp-hero-name-row">
                            <h2 className="sp-hero-name">{formData.firstName} {formData.lastName}</h2>
                            <span className="sp-status-badge active"><span className="sp-status-dot" />Active</span>
                        </div>
                        <div className="sp-hero-meta">
                            <span className="sp-role-pill"><Shield size={11} />{roleLabel}</span>
                            {formData.branch && <span className="sp-meta-chip"><Building2 size={12} />{formData.branch}</span>}
                            {formData.email && <span className="sp-meta-chip"><Mail size={12} />{formData.email}</span>}
                        </div>
                    </div>

                    <div className="sp-hero-quick-stats">
                        <div className="sp-quick-stat">
                            <span className="sp-qs-val">{staffMeta.userId ? staffMeta.userId.slice(-6).toUpperCase() : '—'}</span>
                            <span className="sp-qs-label">Staff ID</span>
                        </div>
                        <div className="sp-qs-divider" />
                        <div className="sp-quick-stat">
                            <span className="sp-qs-val">{staffMeta.dateJoined || '—'}</span>
                            <span className="sp-qs-label">Member Since</span>
                        </div>
                        <div className="sp-qs-divider" />
                        <div className="sp-quick-stat">
                            <span className="sp-qs-val">{formData.branch || '—'}</span>
                            <span className="sp-qs-label">Branch</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TABS ── */}
            <div className="sp-tabs">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        className={`sp-tab-btn ${activeTab === t.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(t.id)}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {/* ── PERSONAL INFO ── */}
                {activeTab === 'personal' && (
                    <div className="sp-content-grid">
                        {/* Basic Information */}
                        <div className="sp-card">
                            <div className="sp-card-head">
                                <div className="sp-card-icon"><UserCircle size={18} color="var(--primary-color)" /></div>
                                <div>
                                    <h3>Basic Information</h3>
                                    <p>Your name and primary contact details</p>
                                </div>
                            </div>
                            <div className="sp-form-grid">
                                <div className="sp-field">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
                                </div>
                                <div className="sp-field">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                                </div>
                                <div className="sp-field">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={formData.email} readOnly className="sp-readonly" />
                                </div>
                                <div className="sp-field">
                                    <label>Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+94 77 000 0000" />
                                </div>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div className="sp-card">
                            <div className="sp-card-head">
                                <div className="sp-card-icon"><Briefcase size={18} color="var(--primary-color)" /></div>
                                <div>
                                    <h3>Professional Details</h3>
                                    <p>Your role and branch assignment</p>
                                </div>
                            </div>
                            <div className="sp-info-list">
                                <div className="sp-info-item">
                                    <span className="sp-info-label"><Briefcase size={13} />Role</span>
                                    <span className="sp-info-val sp-role-pill-sm">{roleLabel}</span>
                                </div>
                                <div className="sp-info-item">
                                    <span className="sp-info-label"><Building2 size={13} />Branch / Location</span>
                                    <span className="sp-info-val">{formData.branch || '—'}</span>
                                </div>
                                <div className="sp-info-item">
                                    <span className="sp-info-label"><Shield size={13} />Department</span>
                                    <span className="sp-info-val">Gym Operations</span>
                                </div>
                                <div className="sp-info-item">
                                    <span className="sp-info-label"><User size={13} />Reports To</span>
                                    <span className="sp-info-val">Administrator</span>
                                </div>
                            </div>
                        </div>

                        <div className="sp-save-row">
                            {saved && <span className="sp-saved-msg"><CheckCircle2 size={15} /> Changes saved!</span>}
                            <button type="submit" className="sp-save-btn">
                                <Save size={15} /> Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* ── ACCOUNT ── */}
                {activeTab === 'account' && (
                    <div className="sp-content-grid">
                        {/* Account Details */}
                        <div className="sp-card">
                            <div className="sp-card-head">
                                <div className="sp-card-icon"><Hash size={18} color="var(--primary-color)" /></div>
                                <div><h3>Account Details</h3><p>Your system account information</p></div>
                            </div>
                            <div className="sp-info-list">
                                <div className="sp-info-item">
                                    <span className="sp-info-label"><Hash size={13} />User ID</span>
                                    <span className="sp-info-val sp-mono">{staffMeta.userId || '—'}</span>
                                </div>
                                <div className="sp-info-item">
                                    <span className="sp-info-label"><Calendar size={13} />Date Joined</span>
                                    <span className="sp-info-val">{staffMeta.dateJoined || '—'}</span>
                                </div>
                                <div className="sp-info-item">
                                    <span className="sp-info-label"><Clock size={13} />Last Login</span>
                                    <span className="sp-info-val">{staffMeta.lastLogin || '—'}</span>
                                </div>
                                <div className="sp-info-item">
                                    <span className="sp-info-label"><CheckCircle2 size={13} />Account Status</span>
                                    <span className="sp-status-badge active" style={{ fontSize: '0.78rem' }}><span className="sp-status-dot" />Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Change Password */}
                        <div className="sp-card">
                            <div className="sp-card-head">
                                <div className="sp-card-icon"><Key size={18} color="var(--primary-color)" /></div>
                                <div><h3>Change Password</h3><p>Keep your account secure</p></div>
                            </div>
                            <div className="sp-form-grid single">
                                <div className="sp-field">
                                    <label>Current Password</label>
                                    <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} placeholder="••••••••" />
                                </div>
                                <div className="sp-field">
                                    <label>New Password</label>
                                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="••••••••" />
                                </div>
                                <div className="sp-field">
                                    <label>Confirm New Password</label>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
                                </div>
                            </div>
                        </div>

                        {/* 2FA Toggle */}
                        <div className="sp-card">
                            <div className="sp-card-head">
                                <div className="sp-card-icon"><Shield size={18} color="var(--primary-color)" /></div>
                                <div><h3>Security Options</h3><p>Two-factor authentication and protection</p></div>
                            </div>
                            <div className="sp-toggle-row">
                                <div className="sp-toggle-info">
                                    <h4>Two-Factor Authentication</h4>
                                    <p>Add an extra layer of security to your account</p>
                                </div>
                                <button type="button" className={`sp-toggle-btn ${twoFA ? 'on' : ''}`} onClick={() => setTwoFA(!twoFA)}>
                                    {twoFA ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                </button>
                            </div>
                        </div>

                        <div className="sp-save-row">
                            {saved && <span className="sp-saved-msg"><CheckCircle2 size={15} /> Changes saved!</span>}
                            <button type="submit" className="sp-save-btn">
                                <Save size={15} /> Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* ── ACTIVITY ── */}
                {activeTab === 'activity' && (
                    <div className="sp-content-grid">
                        <div className="sp-card">
                            <div className="sp-card-head">
                                <div className="sp-card-icon"><Activity size={18} color="var(--primary-color)" /></div>
                                <div><h3>Recent Activity</h3><p>Your latest login and session history</p></div>
                            </div>
                            <div className="sp-activity-list">
                                {[
                                    { action: 'Logged In', time: new Date().toLocaleString(), icon: <CheckCircle2 size={15} color="#10B981" />, color: '#10B981' },
                                    { action: 'Profile Viewed', time: new Date().toLocaleString(), icon: <User size={15} color="#3B82F6" />, color: '#3B82F6' },
                                    { action: 'Inventory Checked', time: new Date().toLocaleString(), icon: <Briefcase size={15} color="#F59E0B" />, color: '#F59E0B' },
                                ].map((item, i) => (
                                    <div key={i} className="sp-activity-item">
                                        <div className="sp-activity-icon" style={{ background: `${item.color}15` }}>
                                            {item.icon}
                                        </div>
                                        <div className="sp-activity-info">
                                            <span className="sp-activity-action">{item.action}</span>
                                            <span className="sp-activity-time">{item.time}</span>
                                        </div>
                                        <ChevronRight size={16} color="var(--color-text-dim)" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sp-card">
                            <div className="sp-card-head">
                                <div className="sp-card-icon"><Clock size={18} color="var(--primary-color)" /></div>
                                <div><h3>Login History</h3><p>Recent sign-in sessions for your account</p></div>
                            </div>
                            <div className="sp-login-history">
                                <div className="sp-login-row header">
                                    <span>Date & Time</span>
                                    <span>Status</span>
                                    <span>Device</span>
                                </div>
                                {[
                                    { date: new Date().toLocaleString(), status: 'success', device: 'Chrome / Windows' },
                                    { date: new Date(Date.now() - 86400000).toLocaleString(), status: 'success', device: 'Chrome / Windows' },
                                    { date: new Date(Date.now() - 172800000).toLocaleString(), status: 'success', device: 'Mobile Browser' },
                                ].map((row, i) => (
                                    <div key={i} className="sp-login-row">
                                        <span>{row.date}</span>
                                        <span className={`sp-login-status ${row.status}`}>{row.status === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}{row.status}</span>
                                        <span>{row.device}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── SETTINGS ── */}
                {activeTab === 'settings' && (
                    <div className="sp-content-grid">
                        <div className="sp-card">
                            <div className="sp-card-head">
                                <div className="sp-card-icon"><Bell size={18} color="var(--primary-color)" /></div>
                                <div><h3>Notification Settings</h3><p>Control your alerts and notifications</p></div>
                            </div>
                            <div className="sp-settings-list">
                                <div className="sp-toggle-row">
                                    <div className="sp-toggle-info">
                                        <h4>Push Notifications</h4>
                                        <p>Receive alerts for inventory updates and requests</p>
                                    </div>
                                    <button type="button" className={`sp-toggle-btn ${notifEnabled ? 'on' : ''}`} onClick={() => setNotifEnabled(!notifEnabled)}>
                                        {notifEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                    </button>
                                </div>
                                <div className="sp-toggle-row">
                                    <div className="sp-toggle-info">
                                        <h4>Login Alerts</h4>
                                        <p>Get notified on new sign-ins to your account</p>
                                    </div>
                                    <button type="button" className="sp-toggle-btn on" disabled>
                                        <ToggleRight size={32} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="sp-card">
                            <div className="sp-card-head">
                                <div className="sp-card-icon"><Settings size={18} color="var(--primary-color)" /></div>
                                <div><h3>Account Actions</h3><p>Manage your account preferences</p></div>
                            </div>
                            <div className="sp-action-list">
                                <button type="button" className="sp-action-item" onClick={() => setActiveTab('personal')}>
                                    <div className="sp-action-icon blue"><Edit3 size={16} /></div>
                                    <div className="sp-action-info"><span>Edit Profile</span><small>Update your personal information</small></div>
                                    <ChevronRight size={16} color="var(--color-text-dim)" />
                                </button>
                                <button type="button" className="sp-action-item" onClick={() => setActiveTab('account')}>
                                    <div className="sp-action-icon amber"><Key size={16} /></div>
                                    <div className="sp-action-info"><span>Change Password</span><small>Update your security credentials</small></div>
                                    <ChevronRight size={16} color="var(--color-text-dim)" />
                                </button>
                                <button type="button" className="sp-action-item" onClick={() => setActiveTab('activity')}>
                                    <div className="sp-action-icon green"><Activity size={16} /></div>
                                    <div className="sp-action-info"><span>View Activity Logs</span><small>See your recent sessions and actions</small></div>
                                    <ChevronRight size={16} color="var(--color-text-dim)" />
                                </button>
                                {onLogoutTrigger && (
                                    <button type="button" className="sp-action-item danger" onClick={onLogoutTrigger}>
                                        <div className="sp-action-icon red"><LogOut size={16} /></div>
                                        <div className="sp-action-info"><span>Logout</span><small>Sign out from your account</small></div>
                                        <ChevronRight size={16} color="var(--color-text-dim)" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default StaffProfile;
