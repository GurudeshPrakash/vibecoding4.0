import React from 'react';
import StaffDashboard from '../pages/StaffDashboard';
import InventoryManagement from '../pages/InventoryManagement';
import MembersManagement from '../pages/MembersManagement';
import Payments from '../pages/Payments';
import ProfilePage from '../../shared/pages/ProfilePage';

const StaffRoutes = ({ activeTab, props, adminRole }) => {
    switch (activeTab) {
        case 'dashboard':
            return <StaffDashboard adminName={props.userName} />;
        case 'inventory':
            return <InventoryManagement inventoryData={props.inventoryData} userRole={adminRole} />;
        case 'members':
            return <MembersManagement userRole={adminRole} />;
        case 'payments':
            return <Payments userRole={adminRole} />;
        case 'profile':
            return (
                <ProfilePage
                    userRole="staff"
                    setGlobalUserName={props.setUserName}
                    setGlobalUserEmail={props.setUserEmail}
                    setGlobalUserPhone={props.setAdminPhone}
                />
            );
        default:
            return <StaffDashboard adminName={props.userName} />;
    }
};

export default StaffRoutes;
