import React from 'react';
import Dashboard from '../pages/Dashboard';
import Inventory from '../pages/Inventory';
import Members from '../pages/Members';
import Payments from '../pages/Payments';

const StaffRoutes = ({ activeTab, props, adminRole }) => {
    switch (activeTab) {
        case 'dashboard':
            return <Dashboard />;
        case 'inventory':
            return <Inventory inventoryData={props.inventoryData} userRole={adminRole} />;
        case 'members':
            return <Members userRole={adminRole} />;
        case 'payments':
            return <Payments userRole={adminRole} />;
        default:
            return <Dashboard />;
    }
};

export default StaffRoutes;
