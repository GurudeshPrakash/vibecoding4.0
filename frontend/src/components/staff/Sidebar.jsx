import React from 'react';
import { LayoutDashboard, Package, User, LogOut } from 'lucide-react';
import logo from '../../assets/logo1.png';
import '../../style/Sidebar.css';

const StaffSidebar = ({ activeTab, setActiveTab, onLogoutTrigger }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'inventory', label: 'Inventory', icon: <Package size={20} /> },
        { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    ];

    return (
        <div className="sidebar">
            <div className="logo-container" style={{ padding: '20px', textAlign: 'center' }}>
                <img src={logo} alt="Power World" style={{ width: '130px', height: 'auto' }} />
            </div>

            <nav className="sidebar-nav">
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
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={() => window.location.href = '/'}>
                    <LogOut size={20} />
                    <span>Back to Home</span>
                </button>
            </div>
        </div>
    );
};

export default StaffSidebar;
