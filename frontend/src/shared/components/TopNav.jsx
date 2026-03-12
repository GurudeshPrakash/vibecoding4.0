import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Camera, Mail, Phone, Settings, LogOut, X, LogIn, Monitor, ArrowLeft, Clock, CalendarDays, AlertTriangle } from 'lucide-react';
import '../styles/TopNav.css';
import { useAuth } from '../../auth/hooks/useAuth.jsx';

const TopNav = ({
    adminName = "User",
    adminEmail = "",
    setActiveTab,
    onLogoutTrigger,
    role = "Staff",
    notifications = [],
    setNotifications,
    onViewLog,
    currentTab,
}) => {
    const { user } = useAuth();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    const [selectedReport, setSelectedReport] = useState(null);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

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

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllRead = async () => {
        // Optimistic update for UI
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

        // Persist dev notifications to localStorage
        const devNotifs = JSON.parse(localStorage.getItem('dev_notifications') || '[]');
        if (devNotifs.length > 0) {
            const updatedDev = devNotifs.map(n => ({ ...n, unread: false }));
            localStorage.setItem('dev_notifications', JSON.stringify(updatedDev));
        }

        // Persist to DB for auth notifs (if any)
        const token = sessionStorage.getItem('admin_token');
        if (token) {
            const unreadNotifs = notifications.filter(n => n.unread && n.isAuthNotif);
            const currentRole = user?.role || role.toLowerCase();
            const apiBase = currentRole === 'staff' ? '/api/staff' : '/api/admin';
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
        // Handle Dev Damage Reports
        if (notif.type === 'Damaged' && notif.reportId) {
            const reports = JSON.parse(localStorage.getItem('dev_damaged_reports') || '[]');
            const report = reports.find(r => r.id === notif.reportId);
            if (report) {
                setSelectedReport(report);
                setShowNotifications(false);
                return;
            }
        }

        if (notif.isAuthNotif) {
            if (onViewLog && notif.activityLogId) {
                onViewLog(notif.activityLogId);
            }

            const token = sessionStorage.getItem('admin_token');
            if (token) {
                const apiBase = user?.role === 'staff' ? '/api/staff' : '/api/admin';
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
                            fontSize: '0.825rem',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginRight: '16px', padding: '6px 16px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1E3A5F', fontSize: '0.75rem', fontWeight: 800 }}>
                        <CalendarDays size={14} />
                        {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.1)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-red)', fontSize: '0.75rem', fontWeight: 800 }}>
                        <Clock size={14} />
                        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                </div>

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
                                                </p>
                                                <div className="notif-meta">
                                                    {notif.status && (
                                                        <span className={`status-pill-small ${notif.status.toLowerCase()}`}>{notif.status}</span>
                                                    )}
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
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt="Profile" className="avatar-img-top" />
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
                                        {user?.profilePic ? (
                                            <img src={user.profilePic} alt="Large" />
                                        ) : (
                                            <User size={40} />
                                        )}
                                    </div>
                                </div>
                                <div className="user-details-stack">
                                    <h3 className="user-full-name" style={{ marginBottom: '2px' }}>{adminName}</h3>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-red)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                        {role}
                                    </div>
                                    <span className="user-info-text">{adminEmail}</span>
                                    {user?.phone && <span className="user-info-text">{user.phone}</span>}
                                </div>
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
            </div >


            {/* Damage Report Review Modal (Admin/Super Admin only) */}
            {selectedReport && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
                    <div className="animate-pop-in" style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FEF2F2' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertTriangle color="#EF4444" size={24} />
                                <h3 style={{ margin: 0, color: '#991B1B', fontSize: '1rem', fontWeight: 800 }}>Damage Report Review</h3>
                            </div>
                            <button onClick={() => setSelectedReport(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B' }}><X size={20} /></button>
                        </div>

                        <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                <img src={selectedReport.machinePhoto} alt="Machine" style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #E2E8F0' }} />
                                <div>
                                    <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800 }}>{selectedReport.machineName}</h4>
                                    <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>ID: {selectedReport.machineId} | Branch: {selectedReport.branch}</p>
                                    <div style={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Awaiting Status: DAMAGED</div>
                                </div>
                            </div>

                            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>Staff Description</div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#1E293B', lineHeight: 1.5 }}>{selectedReport.description}</p>
                            </div>

                            {selectedReport.images && selectedReport.images.length > 0 && (
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '12px' }}>Damage Photos</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                                        {selectedReport.images.map((img, idx) => (
                                            <a key={idx} href={img} target="_blank" rel="noreferrer">
                                                <img src={img} alt="Damage" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0', cursor: 'zoom-in' }} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => {
                                        // Reject Logic
                                        const reports = JSON.parse(localStorage.getItem('dev_damaged_reports') || '[]');
                                        localStorage.setItem('dev_damaged_reports', JSON.stringify(reports.map(r => r.id === selectedReport.id ? { ...r, isRejected: true } : r)));

                                        // Notify Staff
                                        const staffNotif = {
                                            id: `NOTIF-STF-REJ-${Date.now()}`,
                                            type: 'Inventory', // Shows clean message without name prefix
                                            priority: 'High',
                                            recipientEmail: 'staff@gym.com',
                                            status: 'Rejected',
                                            title: 'Damage Report Rejected',
                                            action: `Your damage report for equipment ${selectedReport.machineId} has been rejected by the Admin.`,
                                            time: 'Just now',
                                            timestamp: new Date().toISOString(),
                                            unread: true,
                                            isAuthNotif: true
                                        };
                                        const devNotifs = JSON.parse(localStorage.getItem('dev_notifications') || '[]');
                                        const updatedNotifs = [staffNotif, ...devNotifs];
                                        localStorage.setItem('dev_notifications', JSON.stringify(updatedNotifs));
                                        if (setNotifications) setNotifications(updatedNotifs);

                                        alert("Damage report rejected.");
                                        setSelectedReport(null);
                                    }}
                                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontWeight: 800, cursor: 'pointer' }}
                                >
                                    Reject Report
                                </button>
                                <button
                                    onClick={() => {
                                        // Approve Logic
                                        const reports = JSON.parse(localStorage.getItem('dev_damaged_reports') || '[]');
                                        localStorage.setItem('dev_damaged_reports', JSON.stringify(reports.map(r => r.id === selectedReport.id ? { ...r, isApproved: true } : r)));

                                        const overrides = JSON.parse(localStorage.getItem('dev_status_overrides') || '{}');
                                        overrides[selectedReport.machineId] = 'Damaged';
                                        localStorage.setItem('dev_status_overrides', JSON.stringify(overrides));

                                        // NEW WORKFLOW: Create Physical Removal Task
                                        import('../../shared/services/taskService').then(({ default: taskService }) => {
                                            taskService.createTask({
                                                request_id: selectedReport.id,
                                                equipment_name: selectedReport.machineName,
                                                location: selectedReport.branch,
                                                remarks: 'Damage report approved. Physical removal required.'
                                            });
                                        });

                                        // Notify Staff
                                        const staffNotif = {
                                            id: `NOTIF-STF-APP-${Date.now()}`,
                                            type: 'Inventory', // Shows clean message without name prefix
                                            priority: 'High',
                                            recipientEmail: 'staff@gym.com',
                                            status: 'Approved',
                                            title: 'Damage Report Approved',
                                            action: `Your request for ${selectedReport.machineName} has been approved. You can now proceed with the physical equipment removal.`,
                                            time: 'Just now',
                                            timestamp: new Date().toISOString(),
                                            unread: true,
                                            isAuthNotif: true
                                        };
                                        const devNotifs = JSON.parse(localStorage.getItem('dev_notifications') || '[]');
                                        const updatedNotifs = [staffNotif, ...devNotifs];
                                        localStorage.setItem('dev_notifications', JSON.stringify(updatedNotifs));
                                        if (setNotifications) setNotifications(updatedNotifs);

                                        alert("Report approved! Equipment status updated to DAMAGED. Physical removal task created.");
                                        setSelectedReport(null);
                                    }}

                                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#10B981', color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                                >
                                    Approve & Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default TopNav;

