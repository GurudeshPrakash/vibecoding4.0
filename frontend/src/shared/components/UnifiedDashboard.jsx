import React from 'react';
import SuperAdminDashboard from '../../super-admin/pages/SuperAdminDashboard';
import AdminDashboard from '../../admin/pages/AdminDashboard';
import StaffDashboard from '../../staff/pages/StaffDashboard';

const UnifiedDashboard = (props) => {
    const { userRole, adminName, stats, recentInventory, dismantleRequests, setDismantleRequests, refreshInventory, setActiveTab } = props;

    // Render only the section that matches the user's role
    return (
        <div className="unified-dashboard-scroll-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '100px' }}>

            {/* 1. SUPER ADMIN SECTION */}
            {userRole === 'super_admin' && (
                <section id="super-admin-section">
                    <SuperAdminDashboard
                        adminName={adminName}
                        setActiveTab={setActiveTab}
                        userRole={userRole}
                    />
                </section>
            )}

            {/* 2. ADMIN SECTION */}
            {userRole === 'admin' && (
                <section id="admin-section">
                    <AdminDashboard
                        stats={stats}
                        adminName={adminName}
                        recentInventory={recentInventory}
                        dismantleRequests={dismantleRequests}
                        setDismantleRequests={setDismantleRequests}
                        refreshInventory={refreshInventory}
                        userRole={userRole}
                    />
                </section>
            )}

            {/* 3. STAFF SECTION */}
            {userRole === 'staff' && (
                <section id="staff-section">
                    <StaffDashboard setActiveTab={setActiveTab} />
                </section>
            )}
        </div>
    );
};

export default UnifiedDashboard;
