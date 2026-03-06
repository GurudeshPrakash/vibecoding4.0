import React from 'react';
import Dashboard from '../pages/Dashboard';
import Administrators from '../pages/Administrators';
import Managers from '../pages/Managers';
import Locations from '../pages/Locations';
import AdminLogs from '../pages/AdminLogs';
import Settings from '../pages/Settings';

const SuperAdminRoutes = ({ activeTab, props, viewRole }) => {
    switch (activeTab) {
        case 'dashboard':
            return <Dashboard />;
        case 'admins':
            return <Administrators userRole={viewRole} />;
        case 'staff':
            return <Managers userRole={viewRole} />;
        case 'locations':
            return <Locations />;
        case 'activity-logs':
            return <AdminLogs onViewLog={props.handleViewActivityLog} />;
        case 'settings':
            return <Settings adminName={props.userName} setAdminName={props.setUserName} />;
        default:
            return <Dashboard />;
    }
};

export default SuperAdminRoutes;
