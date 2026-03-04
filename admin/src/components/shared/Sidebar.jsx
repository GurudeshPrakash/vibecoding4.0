import React from 'react';
import { LayoutDashboard, Users, MapPin, Settings, LogOut, ShieldCheck, ClipboardList, CheckSquare, DollarSign, Package } from 'lucide-react';
import logo from '../../assets/logo1.png';
import '../../style/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, onLogoutTrigger, adminRole, viewRole, setViewRole }) => {

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
        { id: 'inventory', label: 'Asset Management', icon: <Package size={20} /> },
        { id: 'managers', label: 'Staff Management', icon: <Users size={20} /> },
        { id: 'members', label: 'Members', icon: <Users size={20} /> },
        { id: 'locations', label: 'Branch Management', icon: <MapPin size={20} /> },
        { id: 'trainers', label: 'Trainers', icon: <Users size={20} /> },
        { id: 'reports', label: 'Reports', icon: <ClipboardList size={20} /> },
    ];

    const staffMenu = [
        { id: 'dashboard', label: 'Staff Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'check-ins', label: 'Member Check-ins', icon: <CheckSquare size={20} /> },
        { id: 'payments', label: 'Payments', icon: <DollarSign size={20} /> },
        { id: 'members', label: 'Members', icon: <Users size={20} /> },
        { id: 'inventory', label: 'Facility Inventory', icon: <Package size={20} /> },
    ];

    const canAccess = (userRole, targetSectionRole) => {
        if (userRole === 'super_admin') return true;
        if (userRole === 'admin') return targetSectionRole === 'admin' || targetSectionRole === 'staff';
        if (userRole === 'staff') return targetSectionRole === 'staff';
        return false;
    };

    const renderNavSection = (title, menuItems, sectionRole) => {
        const isRestricted = !canAccess(adminRole, sectionRole);

        return (
            <div style={{ marginBottom: '24px', opacity: isRestricted ? 0.6 : 1 }}>
                <h4 style={{
                    padding: '0 20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#9CA3AF',
                    marginBottom: '12px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <span>{title}</span>
                    {isRestricted && <span style={{ fontSize: '9px', background: '#FEE2E2', color: '#EF4444', padding: '2px 6px', borderRadius: '4px' }}>LOCKED</span>}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.id && viewRole === sectionRole;
                        return (
                            <button
                                key={item.id}
                                className={`nav-item ${isActive ? 'active' : ''} ${isRestricted ? 'restricted' : ''}`}
                                onClick={() => {
                                    if (!isRestricted) {
                                        setViewRole(sectionRole);
                                        setActiveTab(item.id);
                                    }
                                }}
                                style={{
                                    cursor: isRestricted ? 'not-allowed' : 'pointer',
                                    position: 'relative'
                                }}
                                title={isRestricted ? `Access restricted to ${sectionRole.replace('_', ' ')}s` : ''}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#fff', borderRight: '1px solid #e5e7eb' }}>
            <div className="logo-container" style={{ padding: '24px 20px', textAlign: 'center' }}>
                <img src={logo} alt="Power World" style={{ width: '130px', height: 'auto' }} />
            </div>

            <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
                {renderNavSection('SUPER ADMIN', superAdminMenu, 'super_admin')}
                <div style={{ height: '1px', background: '#f3f4f6', margin: '0 20px 24px 20px' }}></div>

                {renderNavSection('ADMIN', adminMenu, 'admin')}
                <div style={{ height: '1px', background: '#f3f4f6', margin: '0 20px 24px 20px' }}></div>

                {renderNavSection('STAFF', staffMenu, 'staff')}
            </nav>

            <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid #f3f4f6' }}>
                <button className="logout-btn" onClick={onLogoutTrigger}>
                    <LogOut size={20} />
                    <span>Back to Home</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
