import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import TopNav from '../../shared/components/TopNav';

/**
 * SuperAdminLayout defines the common structure for the Super Admin panel.
 * It uses the same Sidebar and TopNav components as Admin but with super_admin context.
 */
const SuperAdminLayout = ({
    children,
    onLogoutTrigger,
    userName,
    userEmail,
    notifications,
    setNotifications,
    handleViewActivityLog
}) => {
    return (
        <div className="app-layout is-super-admin">
            <Sidebar
                onLogoutTrigger={onLogoutTrigger}
            />


            <main className="main-container">
                <TopNav
                    adminName={userName}
                    adminEmail={userEmail}
                    onLogoutTrigger={onLogoutTrigger}
                    role="Super Admin"
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

export default SuperAdminLayout;
