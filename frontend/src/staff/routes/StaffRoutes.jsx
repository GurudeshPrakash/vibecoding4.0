/**
 * @module StaffModule
 * @status STABLE - LOCKED
 * @description This module is development-complete. Avoid modifications unless specifically requested.
 */
import React from 'react';
import StaffDashboard from '../pages/StaffDashboard';
import InventoryManagement from '../pages/InventoryManagement';
import MembersManagement from '../pages/MembersManagement';
import Payments from '../pages/Payments';
import ProfilePage from '../../shared/pages/ProfilePage';

const StaffRoutes = ({ activeTab, props, viewRole }) => {
    switch (activeTab) {
        case 'dashboard':
            return <StaffDashboard adminName={props.userName} inventoryData={props.inventoryData} stats={props.stats} />;
        case 'inventory':
            return <InventoryManagement inventoryData={props.inventoryData} userRole={viewRole} />;
        case 'members':
            return <MembersManagement userRole={viewRole} />;
        case 'payments':
            return <Payments userRole={viewRole} />;
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
