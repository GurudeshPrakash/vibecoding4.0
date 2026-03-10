import React from 'react';
import AdminDashboard from '../pages/AdminDashboard';
import BranchManagement from '../pages/BranchManagement';
import MembersManagement from '../pages/MembersManagement';
import StaffManagement from '../pages/StaffManagement';
import InventoryManagement from '../pages/InventoryManagement';
import Payments from '../pages/Payments';
import Reports from '../pages/Reports';
import ProfilePage from '../../shared/pages/ProfilePage';

/**
 * AdminRoutes component maps the activeTab to the corresponding Page component.
 * In a traditional React app, these might be separate <Route> components,
 * but currently the app uses a state-based tab system.
 */
const AdminRoutes = ({ activeTab, props, viewRole }) => {
    switch (activeTab) {
        case 'dashboard':
            return (
                <AdminDashboard
                    adminName={props.userName}
                    stats={props.stats}
                    recentInventory={props.inventoryData}
                    dismantleRequests={props.dismantleRequests}
                    setDismantleRequests={props.setDismantleRequests}
                    refreshInventory={props.refreshInventory}
                    userRole={viewRole}
                />
            );
        case 'locations':
            return <BranchManagement />;
        case 'members':
            return <MembersManagement />;
        case 'staff':
            return <StaffManagement userRole={viewRole} />;
        case 'inventory':
            return <InventoryManagement inventoryData={props.inventoryData} userRole={viewRole} />;
        case 'payments':
            return <Payments />;
        case 'reports':
            return <Reports />;
        case 'profile':
            return (
                <ProfilePage
                    currentUserId={props.selectedProfileId}
                    userRole={viewRole}
                    setGlobalUserName={props.setUserName}
                    setGlobalUserEmail={props.setUserEmail}
                    setGlobalUserPhone={props.setAdminPhone}
                />
            );
        default:
            return <AdminDashboard adminName={props.userName} />;
    }
};

export default AdminRoutes;
