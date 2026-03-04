import React from 'react';
import { LayoutDashboard, Users, MapPin, Settings, LogOut, ShieldCheck, ClipboardList } from 'lucide-react';
import logo from '../../assets/logo1.png';
import '../../style/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, onLogoutTrigger, adminRole }) => {
    // Note: adminRole passed here might be the old naming, we'll normalize it or use user.role if we had useAuth here.
    const normalizedRole = adminRole === 'super_admin' ? 'superadmin' : adminRole;

    const adminMenu = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'superadmin'] },
        { id: 'admins', label: 'Administrators', icon: <ShieldCheck size={20} />, roles: ['superadmin'] },
        { id: 'owners', label: 'Managers', icon: <Users size={20} />, roles: ['admin', 'superadmin'] },
        { id: 'locations', label: 'Locations', icon: <MapPin size={20} />, roles: ['admin', 'superadmin'] },
        { id: 'activity-logs', label: 'Session History', icon: <ClipboardList size={20} />, roles: ['admin', 'superadmin'] },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} />, roles: ['admin', 'superadmin'] },
    ];

    const menuItems = adminMenu.filter(item => item.roles.includes(normalizedRole));

    return (
        <div className="sidebar">
            <div className="logo-container" style={{ padding: '20px', textAlign: 'center' }}>
                <img src={logo} alt="Power World" style={{ width: '130px', height: 'auto' }} />
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    return (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={onLogoutTrigger}>
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
