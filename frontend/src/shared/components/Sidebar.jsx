import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, MapPin, Settings, LogOut, ShieldCheck, ClipboardList, DollarSign, Package, User, Plus } from 'lucide-react';
import logo from '../assets/logo1.png';
import '../styles/Sidebar.css';
import { useAuth } from '../../auth/hooks/useAuth.jsx';

const Sidebar = ({ onLogoutTrigger }) => {
    const { user } = useAuth();
    const role = user?.role?.toLowerCase() || 'staff';

    const superAdminMenu = [
        { id: 'sa-dashboard', label: 'Super admin dashboard', icon: <LayoutDashboard size={18} />, path: '/super-admin/dashboard' },
        { id: 'sa-admins', label: 'Admin management', icon: <ShieldCheck size={18} />, path: '/super-admin/admins' },
        { id: 'sa-staff', label: 'Staff management', icon: <Users size={18} />, path: '/super-admin/staff' },
        { id: 'sa-branches', label: 'Branch management', icon: <MapPin size={18} />, path: '/super-admin/locations' },
        { id: 'sa-members', label: 'Members management', icon: <Users size={18} />, path: '/super-admin/members' },
        { id: 'sa-reports', label: 'Reports', icon: <ClipboardList size={18} />, path: '/super-admin/reports' },
        { id: 'sa-settings', label: 'Settings', icon: <Settings size={18} />, path: '/super-admin/settings' },
    ];

    const adminMenu = [
        { id: 'adm-dashboard', label: 'Admin dashboard', icon: <LayoutDashboard size={18} />, path: '/admin/dashboard' },
        { id: 'adm-staff', label: 'Staff management', icon: <Users size={18} />, path: '/admin/staff' },
        { id: 'adm-branches', label: 'Branch management', icon: <MapPin size={18} />, path: '/admin/locations' },
        { id: 'adm-inventory', label: 'Inventory management', icon: <Package size={18} />, path: '/admin/inventory' },
        { id: 'adm-members', label: 'Members management', icon: <Users size={18} />, path: '/admin/members' },
        { id: 'adm-payments', label: 'Payments', icon: <DollarSign size={18} />, path: '/admin/payments' },
        { id: 'adm-reports', label: 'Reports', icon: <ClipboardList size={18} />, path: '/admin/reports' },
    ];

    const staffMenu = [
        { id: 'stf-dashboard', label: 'Staff dashboard', icon: <LayoutDashboard size={18} />, path: '/staff/dashboard' },
        { id: 'stf-inventory', label: 'Inventory management', icon: <Package size={18} />, path: '/staff/inventory' },
        { id: 'stf-members', label: 'Members management', icon: <Users size={18} />, path: '/staff/members' },
        { id: 'stf-payments', label: 'Payments', icon: <DollarSign size={18} />, path: '/staff/payments' },
    ];


    const renderNavSection = (title, menuItems, themeColor, isRestricted = false) => {
        return (
            <div style={{ marginBottom: '24px', opacity: isRestricted ? 0.6 : 1 }}>
                <h4 style={{
                    padding: '0 20px',
                    fontSize: '10px',
                    fontWeight: '800',
                    color: isRestricted ? '#94A3B8' : (themeColor || '#94A3B8'),
                    marginBottom: '10px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: isRestricted ? '#CBD5E1' : (themeColor || '#94A3B8') }} />
                    {title}
                    {isRestricted && <ShieldCheck size={10} style={{ marginLeft: 'auto', color: '#94A3B8' }} />}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {menuItems.map((item) => (
                        <div key={item.id} style={{ position: 'relative' }}>
                            {isRestricted ? (
                                <div
                                    className="nav-item blocked"
                                    style={{
                                        cursor: 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 20px',
                                        color: '#94A3B8',
                                        filter: 'grayscale(1)'
                                    }}
                                >
                                    {item.icon}
                                    <span style={{ fontSize: '0.815rem', fontWeight: '500' }}>{item.label}</span>
                                </div>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                    style={{ cursor: 'pointer', textDecoration: 'none' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                        {item.icon}
                                        <span style={{ fontSize: '0.815rem', fontWeight: '500' }}>{item.label}</span>
                                    </div>
                                </NavLink>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#fff', borderRight: '1px solid #F1F5F9' }}>
            <div className="logo-container" style={{ padding: '32px 20px', textAlign: 'center' }}>
                <img src={logo} alt="Power World" style={{ width: '140px', height: 'auto' }} />
            </div>

            <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
                {/* Super Admin Section - Always Visible, Restricted for Admin/Staff */}
                {renderNavSection(
                    'SUPER ADMIN',
                    superAdminMenu,
                    '#6366F1',
                    role !== 'super_admin'
                )}

                <div style={{ margin: '15px 20px', borderTop: '1px dashed #E2E8F0' }} />

                {/* Admin Section - Always Visible, Restricted for Staff */}
                {renderNavSection(
                    'ADMIN',
                    adminMenu,
                    '#F59E0B',
                    (role !== 'super_admin' && role !== 'admin')
                )}

                <div style={{ margin: '15px 20px', borderTop: '1px dashed #E2E8F0' }} />

                {/* Staff Portal - Always Active for everyone */}
                {renderNavSection('STAFF', staffMenu, '#10B981', false)}
            </nav>

            <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid #F1F5F9' }}>
                <button className="logout-btn" onClick={onLogoutTrigger} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', border: 'none', background: '#FEF2F2', color: '#EF4444', fontWeight: '600', cursor: 'pointer' }}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};



export default Sidebar;