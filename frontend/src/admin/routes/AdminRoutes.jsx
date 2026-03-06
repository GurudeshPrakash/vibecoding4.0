import React from 'react';
import Dashboard from '../pages/Dashboard';
import BranchManagement from '../pages/BranchManagement';
import MembersManagement from '../pages/MembersManagement';
import StaffManagement from '../pages/StaffManagement';
import InventoryManagement from '../pages/InventoryManagement';
import PaymentManagement from '../pages/PaymentManagement';
import Reports from '../pages/Reports';

/**
 * AdminRoutes component maps the activeTab to the corresponding Page component.
 * In a traditional React app, these might be separate <Route> components,
 * but currently the app uses a state-based tab system.
 */
const AdminRoutes = ({ activeTab, props, viewRole }) => {
    switch (activeTab) {
        case 'dashboard':
            return <Dashboard />;
        case 'locations':
            return <BranchManagement />;
        case 'members':
            return <MembersManagement />;
        case 'staff':
            return <StaffManagement userRole={viewRole} />;
        case 'inventory':
            return <InventoryManagement inventoryData={props.inventoryData} />;
        case 'payments':
            return <PaymentManagement />;
        case 'reports':
            return <Reports />;
        default:
            return <Dashboard />;
    }
};

export default AdminRoutes;
