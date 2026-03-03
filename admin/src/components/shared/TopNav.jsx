import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Camera, Mail, Phone, Settings, LogOut, X, LogIn, Monitor, ArrowLeft } from 'lucide-react';
import '../../style/TopNav.css';

const TopNav = ({
    adminName = "Admin",
    adminEmail = "admin@gymsys.com",
    adminPhone = "+94 77 000 0000",
    adminId = "ID-001",
    profileImage = null,
    setProfileImage,
    setActiveTab,
    onLogoutTrigger,
    hideSidebarToggle = false,
    role = "Administrator",
    notifications = [],
    setNotifications,
    loginRole,
    setSelectedEquipmentId,
    onViewLog,
    currentTab,
    onToggleRole,
    adminRole
}) => {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    const roleLabel = adminRole === 'super_admin' ? 'Super Admin' : 'Administrator';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllRead = async () => {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

        // Persist to DB for auth notifs
        const apiBase = loginRole === 'admin' ? '/api/admin' : '/api/staff';
        const token = localStorage.getItem(`${loginRole}_token`);
        if (token) {
            const unreadNotifs = notifications.filter(n => n.unread && n.isAuthNotif);
            for (const n of unreadNotifs) {
                try {
                    await fetch(`http://localhost:5000${apiBase}/notifications/${n.id}`, {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (e) {
                    console.error('Mark read fail', e);
                }
            }
        }
    };

    const handleNotificationClick = async (notif) => {
        if (notif.isAuthNotif) {
            if (loginRole === 'admin' && onViewLog && notif.activityLogId) {
                onViewLog(notif.activityLogId);
            }

            // Mark as read in DB
            const apiBase = loginRole === 'admin' ? '/api/admin' : '/api/staff';
            const token = localStorage.getItem(`${loginRole}_token`);
            if (token) {
                try {
                    await fetch(`http://localhost:5000${apiBase}/notifications/${notif.id}`, {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (e) { }
            }
        }

        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
        setShowNotifications(false);

        if (loginRole === 'staff' && notif.equipmentId) {
            setActiveTab('inventory');
            if (setSelectedEquipmentId) setSelectedEquipmentId(notif.equipmentId);
        }
    };

    return (
        <div className="top-nav">
            <div className="top-nav-left">
                {currentTab && currentTab !== 'dashboard' && (
                    <button
                        className="back-btn-nav"
                        onClick={() => window.history.back()}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginRight: '16px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                        }}
                    >
                        <ArrowLeft size={20} /> Back
                    </button>
                )}
                <div className="admin-greeting-left">
                    <span className="hello-text-red">Hello,</span>
                    <span className="admin-name-top">{adminName}</span>
                </div>
            </div>

            <div className="top-nav-right">
                {onToggleRole && (
                    <button
                        onClick={onToggleRole}
                        className="mode-toggle-btn"
                        style={{
                            marginRight: '15px',
                            padding: '8px 16px',
                            backgroundColor: adminRole === 'super_admin' ? 'var(--color-red)' : 'transparent',
                            color: adminRole === 'super_admin' ? 'white' : 'var(--color-text)',
                            border: `1px solid ${adminRole === 'super_admin' ? 'var(--color-red)' : 'var(--color-border)'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {adminRole === 'super_admin' ? 'Switch to Admin' : 'Switch to Super Admin'}
                    </button>
                )}


                <div className="notif-wrapper-rel" ref={notifRef}>
                    <button
                        className={`icon-btn ${unreadCount > 0 ? 'has-notifs' : ''}`}
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            if (!showNotifications && unreadCount > 0) markAllRead();
                        }}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
                    </button>

                    {showNotifications && (
                        <div className="notifications-tray animate-pop-in">
                            <div className="notif-header">
                                <h3>Notifications</h3>
                                {unreadCount > 0 && <button onClick={markAllRead}>Mark all as read</button>}
                            </div>
                            <div className="notif-list">
                                {notifications.length === 0 ? (
                                    <div className="empty-notifs">No new notifications</div>
                                ) : (
                                    notifications.map(notif => (
                                        <div
                                            key={notif.id}
                                            className={`notif-item ${notif.unread ? 'unread' : ''}`}
                                            onClick={() => handleNotificationClick(notif)}
                                        >
                                            <div className="notif-img" style={{ background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {notif.type === 'Inventory' ? (
                                                    <Monitor size={20} color="var(--color-red)" />
                                                ) : (
                                                    notif.isAuthNotif ? <LogIn size={20} color="var(--color-red)" /> : <Monitor size={20} />
                                                )}
                                            </div>
                                            <div className="notif-content">
                                                <p className="notif-text">
                                                    {notif.type === 'Inventory' ? (
                                                        <>{notif.action}</>
                                                    ) : (
                                                        notif.action?.startsWith('You') ? (
                                                            <strong>{notif.action}</strong>
                                                        ) : (
                                                            <><strong>{notif.staffName}</strong> {notif.action}</>
                                                        )
                                                    )}
                                                    {notif.type !== 'Inventory' && (notif.isAuthNotif ? <strong> {notif.branch}</strong> : <strong> {notif.equipmentName}</strong>)}
                                                </p>
                                                <div className="notif-meta">
                                                    <span className={`status-pill-small ${notif.status.toLowerCase()}`}>{notif.status}</span>
                                                    <span className="notif-time">{notif.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="profile-container-rel" ref={dropdownRef}>
                    <div
                        className="profile-section-new"
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    >
                        <div className="profile-avatar-top">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="avatar-img-top" />
                            ) : (
                                <User size={20} />
                            )}
                        </div>
                    </div>

                    {showProfileDropdown && (
                        <div className="profile-dropdown-comprehensive animate-pop-in">
                            <button
                                className="dropdown-close-x"
                                onClick={() => setShowProfileDropdown(false)}
                            >
                                <X size={16} />
                            </button>

                            <div className="dropdown-header-main">
                                <div className="large-avatar-wrapper">
                                    <div className="avatar-circle-large">
                                        {profileImage ? (
                                            <img src={profileImage} alt="Large" />
                                        ) : (
                                            <User size={40} />
                                        )}
                                        <label className="update-photo-overlay" title="Update Photo">
                                            <Camera size={16} />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <h3 className="user-full-name">{adminName}</h3>
                                <span className="user-role">{roleLabel}</span>
                            </div>

                            <div className="dropdown-info-section">
                                <div className="info-row">
                                    <User size={14} className="info-icon-dim" />
                                    <span>{adminId}</span>
                                </div>
                                <div className="info-row">
                                    <Mail size={14} className="info-icon-dim" />
                                    <span>{adminEmail}</span>
                                </div>
                                <div className="info-row">
                                    <Phone size={14} className="info-icon-dim" />
                                    <span>{adminPhone}</span>
                                </div>
                            </div>

                            <div className="dropdown-actions-section">
                                <button className="dropdown-btn-item" onClick={() => { setActiveTab(loginRole === 'admin' ? 'settings' : 'profile'); setShowProfileDropdown(false); }}>
                                    <div className="btn-icon-box"><User size={16} /></div>
                                    <span>Edit Profile</span>
                                </button>
                                <button className="dropdown-btn-item" onClick={() => { setActiveTab(loginRole === 'admin' ? 'settings' : 'profile'); setShowProfileDropdown(false); }}>
                                    <div className="btn-icon-box"><Settings size={16} /></div>
                                    <span>Settings</span>
                                </button>
                            </div>

                            <div className="dropdown-footer-logout">
                                <button className="logout-btn-dropdown" onClick={() => { onLogoutTrigger(); setShowProfileDropdown(false); }}>
                                    <LogOut size={16} />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopNav;
