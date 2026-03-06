import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import TopNav from '../../shared/components/TopNav';

/**
 * SuperAdminLayout defines the common structure for the Super Admin panel.
 * It uses the same Sidebar and TopNav components as Admin but with super_admin context.
 */
const SuperAdminLayout = ({
    children,
    activeTab,
    setActiveTab,
    activeSection,
    setActiveSection,
    setShowLogoutModal,
    adminRole,
    viewRole,
    setViewRole,
    userName,
    userEmail,
    adminId,
    adminPhone,
    profileImage,
    setProfileImage,
    notifications,
    setNotifications,
    loginRole,
    handleViewActivityLog
}) => {
    return (
        <div className="app-layout is-super-admin">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onLogoutTrigger={() => setShowLogoutModal(true)}
                adminRole={adminRole}
                viewRole={viewRole}
                setViewRole={setViewRole}
            />

            <main className="main-container">
                <TopNav
                    adminName={userName}
                    adminEmail={userEmail}
                    adminPhone={adminPhone}
                    adminId={adminId}
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    setActiveTab={setActiveTab}
                    onLogoutTrigger={() => setShowLogoutModal(true)}
                    role="Super Admin"
                    notifications={notifications}
                    setNotifications={setNotifications}
                    loginRole={loginRole}
                    onViewLog={handleViewActivityLog}
                    adminRole={adminRole}
                    viewRole={viewRole}
                />

                <div className="content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default SuperAdminLayout;
