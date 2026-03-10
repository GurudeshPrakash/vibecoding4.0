import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import TopNav from '../../shared/components/TopNav';

/**
 * AdminLayout defines the common structure for the Admin panel.
 * It includes the Sidebar, TopNav, and a content area for children components.
 */
const AdminLayout = ({
    children,
    onLogoutTrigger,
    userName,
    userEmail,
    notifications,
    setNotifications,
    handleViewActivityLog,
}) => {
    return (
        <div className="app-layout">
            <Sidebar
                onLogoutTrigger={onLogoutTrigger}
            />


            <main className="main-container">
                <TopNav
                    adminName={userName}
                    adminEmail={userEmail}
                    onLogoutTrigger={onLogoutTrigger}
                    role="Administrator"
                    notifications={notifications}
                    setNotifications={setNotifications}
                    onViewLog={handleViewActivityLog}
                />




                <div className="content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
