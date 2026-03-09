import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import TopNav from '../../shared/components/TopNav';

/**
 * StaffLayout defines the common structure for the Staff panel.
 */
const StaffLayout = ({
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
    handleViewActivityLog,
    handleQuickSwitch
}) => {
    return (
        <div className="app-layout">
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
                    role="Staff"
                    notifications={notifications}
                    setNotifications={setNotifications}
                    loginRole={loginRole}
                    onViewLog={handleViewActivityLog}
                    adminRole={adminRole}
                    viewRole={viewRole}
                    handleQuickSwitch={handleQuickSwitch}
                />

                <div className="content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default StaffLayout;
