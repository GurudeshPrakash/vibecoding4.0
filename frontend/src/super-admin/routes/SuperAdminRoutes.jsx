import React from 'react';
import Dashboard from '../components/SuperAdminDashboard';
import Administrators from '../pages/Administrators';
import Managers from '../pages/Managers';
import Locations from '../pages/Locations';
import AdminLogs from '../pages/AdminLogs';
import Settings from '../pages/Settings';
import Members from '../components/SuperAdminMembers';
import Reports from '../components/SuperAdminReports';

const SuperAdminRoutes = ({ activeTab, props, viewRole }) => {
    switch (activeTab) {
        case 'dashboard':
            return <Dashboard adminName={props.userName} setActiveTab={props.setActiveTab} userRole={viewRole} />;
        case 'admins':
            return <Administrators userRole={viewRole} />;
        case 'staff':
            return <Managers userRole={viewRole} />;
        case 'locations':
            return <Locations userRole={viewRole} />;
        case 'members':
            return <Members userRole={viewRole} />;
        case 'reports':
            return <Reports userRole={viewRole} />;
        case 'activity-logs':
            return <AdminLogs onViewLog={props.handleViewActivityLog} />;
        case 'settings':
            return <Settings adminName={props.userName} setAdminName={props.setUserName} />;
        default:
            return <Dashboard adminName={props.userName} setActiveTab={props.setActiveTab} userRole={viewRole} />;
    }
};

export default SuperAdminRoutes;
