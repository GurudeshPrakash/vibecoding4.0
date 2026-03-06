import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import TopNav from '../../shared/components/TopNav';

/**
 * AdminLayout defines the common structure for the Admin panel.
 * It includes the Sidebar, TopNav, and a content area for children components.
 */
const AdminLayout = ({
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
        <div className={`app-layout ${viewRole === 'super_admin' ? 'is-super-admin' : ''}`}>
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
                    role={viewRole === 'super_admin' ? 'Super Admin' : viewRole === 'admin' ? 'Administrator' : 'Staff'}
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

export default AdminLayout;
