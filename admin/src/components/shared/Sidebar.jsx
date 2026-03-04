import React from 'react';
import { LayoutDashboard, Users, MapPin, Settings, LogOut, ShieldCheck, ClipboardList, CheckSquare, DollarSign } from 'lucide-react';
import logo from '../../assets/logo1.png';
import '../../style/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, onLogoutTrigger, adminRole }) => {
    const normalizedRole = adminRole === 'super_admin' ? 'superadmin' : (adminRole || 'staff');

    const superAdminMenu = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'admins', label: 'Administrators', icon: <ShieldCheck size={20} /> },
        { id: 'managers', label: 'Managers', icon: <Users size={20} /> },
        { id: 'locations', label: 'Locations', icon: <MapPin size={20} /> },
        { id: 'activity-logs', label: 'Session History', icon: <ClipboardList size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    const adminMenu = [
        { id: 'dashboard', label: 'Admin Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'members', label: 'Members', icon: <Users size={20} /> },
        { id: 'locations', label: 'Branch Management', icon: <MapPin size={20} /> },
        { id: 'trainers', label: 'Trainers', icon: <Users size={20} /> },
        { id: 'reports', label: 'Reports', icon: <ClipboardList size={20} /> },
    ];

    const staffMenu = [
        { id: 'dashboard', label: 'Staff Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'check-ins', label: 'Member Check-ins', icon: <CheckSquare size={20} /> },
        { id: 'payments', label: 'Payments', icon: <DollarSign size={20} /> },
        { id: 'attendance', label: 'Attendance', icon: <Users size={20} /> },
    ];

    const renderNavSection = (title, menuItems) => (
        <div style={{ marginBottom: '24px' }}>
            <h4 style={{
                padding: '0 20px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#9CA3AF',
                marginBottom: '12px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
            }}>
                {title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#fff', borderRight: '1px solid #e5e7eb' }}>
            <div className="logo-container" style={{ padding: '24px 20px', textAlign: 'center' }}>
                <img src={logo} alt="Power World" style={{ width: '130px', height: 'auto' }} />
            </div>

            <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
                {normalizedRole === 'superadmin' && renderNavSection('SUPER ADMIN', superAdminMenu)}

                {(normalizedRole === 'superadmin' || normalizedRole === 'admin') && (
                    <>
                        <div style={{ height: '1px', background: '#f3f4f6', margin: '0 20px 24px 20px' }}></div>
                        {renderNavSection('ADMIN', adminMenu)}
                    </>
                )}

                <div style={{ height: '1px', background: '#f3f4f6', margin: '0 20px 24px 20px' }}></div>
                {renderNavSection('STAFF', staffMenu)}
            </nav>

            <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid #f3f4f6' }}>
                <button className="logout-btn" onClick={onLogoutTrigger}>
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
