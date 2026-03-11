/**
 * @module StaffModule
 * @status STABLE - LOCKED
 * @description This module is development-complete. Avoid modifications unless specifically requested.
 */
import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import TopNav from '../../shared/components/TopNav';

/**
 * StaffLayout defines the common structure for the Staff panel.
 */
const StaffLayout = ({
    children,
    onLogoutTrigger,
    userName,
    userEmail,
    notifications,
    setNotifications,
    handleViewActivityLog
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
                    role="Staff"
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

export default StaffLayout;
