import React from 'react';
import { LayoutDashboard, Users, MapPin, Settings, LogOut, ShieldCheck, ClipboardList, DollarSign, Package, User } from 'lucide-react';
import logo from '../assets/logo1.png';
import '../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, activeSection, setActiveSection, onLogoutTrigger, adminRole, viewRole, setViewRole }) => {

    const superAdminMenu = [
        { id: 'dashboard', label: 'Super Admin Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'admins', label: 'Admin Management', icon: <ShieldCheck size={20} /> },
        { id: 'staff', label: 'Staff Management', icon: <Users size={20} /> },
        { id: 'locations', label: 'Branch Management', icon: <MapPin size={20} /> },
        { id: 'members', label: 'Member Management', icon: <Users size={20} /> },
        { id: 'reports', label: 'Reports', icon: <ClipboardList size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    const adminMenu = [
        { id: 'dashboard', label: 'Admin Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'staff', label: 'Staff Management', icon: <Users size={20} /> },
        { id: 'locations', label: 'Branch Management', icon: <MapPin size={20} /> },
        { id: 'inventory', label: 'Inventory Management', icon: <Package size={20} /> },
        { id: 'members', label: 'Members Management', icon: <Users size={20} /> },
        { id: 'payments', label: 'Payments', icon: <DollarSign size={20} /> },
        { id: 'reports', label: 'Reports', icon: <ClipboardList size={20} /> },
    ];

    const staffMenu = [
        { id: 'dashboard', label: 'Staff Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'inventory', label: 'Inventory Management', icon: <Package size={20} /> },
        { id: 'members', label: 'Members Management', icon: <Users size={20} /> },
        { id: 'payments', label: 'Payments', icon: <DollarSign size={20} /> },
    ];

    // ✅ FIX 1: canAccess returns boolean properly
    const canAccess = (role, targetSectionRole) => {
        if (role === 'super_admin') return true;
        if (role === 'admin') return targetSectionRole === 'admin' || targetSectionRole === 'staff';
        if (role === 'staff') return targetSectionRole === 'staff';
        return false;
    };

    const renderNavSection = (title, menuItems, sectionRole) => {
        // Lock UI based on currently switched viewRole
        const isSimulatedRestricted = !canAccess(viewRole, sectionRole);

        return (
            <div style={{ marginBottom: '24px', opacity: isSimulatedRestricted ? 0.6 : 1 }}>
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
                    {isSimulatedRestricted && <span style={{ fontSize: '9px', background: '#FEE2E2', color: '#EF4444', padding: '2px 6px', borderRadius: '4px' }}>LOCKED</span>}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {menuItems.map((item, index) => {
                        // Logic for temporary page locking
                        let isTemporarilyLocked = false;
                        if (sectionRole === 'super_admin' && (item.id === 'members' || item.id === 'reports')) {
                            isTemporarilyLocked = true;
                        } else if (sectionRole === 'admin' && (item.id === 'members' || item.id === 'payments' || item.id === 'reports')) {
                            isTemporarilyLocked = true;
                        } else if (sectionRole === 'staff' && (item.id === 'members' || item.id === 'payments')) {
                            isTemporarilyLocked = true;
                        }

                        const isDisabled = isSimulatedRestricted || isTemporarilyLocked;
                        const canClick = !isDisabled;
                        const isActive = activeTab === item.id && activeSection === sectionRole && !isDisabled;

                        return (
                            <button
                                key={item.id}
                                className={`nav-item ${isActive ? 'active' : ''} ${isDisabled ? 'blocked' : ''}`}
                                onClick={() => {
                                    if (canClick) {
                                        setActiveSection(sectionRole);
                                        setActiveTab(item.id);
                                    }
                                }}
                                style={{
                                    cursor: canClick ? 'pointer' : 'not-allowed',
                                    position: 'relative',
                                    opacity: isDisabled ? 0.6 : 1,
                                    backgroundColor: isDisabled ? 'transparent' : undefined,
                                }}
                                title={isDisabled ? (isTemporarilyLocked ? 'This feature is temporarily locked' : `Access restricted to ${sectionRole}s`) : ''}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    flex: 1,
                                    color: isDisabled ? '#94A3B8' : 'inherit'
                                }}>
                                    {item.icon}
                                    <span style={{ fontSize: '0.75rem', fontWeight: isDisabled ? '600' : 'inherit' }}>{item.label}</span>
                                </div>
                                {isTemporarilyLocked && (
                                    <span style={{
                                        fontSize: '8px',
                                        background: '#FCA5A5',
                                        color: '#FFFFFF',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontWeight: '900',
                                        letterSpacing: '0.05em',
                                        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)'
                                    }}>LOCKED</span>
                                )}
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