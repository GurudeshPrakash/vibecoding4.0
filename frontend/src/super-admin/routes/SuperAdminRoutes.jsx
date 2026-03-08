import React from 'react';
import Dashboard from '../pages/SuperAdminDashboard';
import Administrators from '../pages/AdminManagement';
import StaffManagement from '../pages/StaffManagement';
import Locations from '../pages/BranchManagement';
import AdminLogs from '../pages/AdminLogs';
import Settings from '../pages/Settings';
import Members from '../pages/MemberManagement';
import Reports from '../pages/Reports';
import ProfilePage from '../../shared/pages/ProfilePage';

const SuperAdminRoutes = ({ activeTab, props, viewRole }) => {
    switch (activeTab) {
        case 'dashboard':
            return <Dashboard adminName={props.userName} setActiveTab={props.setActiveTab} userRole={viewRole} />;
        case 'admins':
            return <Administrators userRole={viewRole} setActiveTab={props.setActiveTab} setSelectedProfileId={props.setSelectedProfileId} />;
        case 'staff':
            return <StaffManagement userRole={viewRole} setActiveTab={props.setActiveTab} setSelectedProfileId={props.setSelectedProfileId} />;
        case 'locations':
            return <Locations userRole={viewRole} />;
        case 'members':
            return <Members userRole={viewRole} />;
        case 'reports':
            return <Reports userRole={viewRole} />;
        case 'activity-logs':
            return <AdminLogs onViewLog={props.handleViewActivityLog} />;
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
        case 'settings':
            return (
                <Settings
                    adminName={props.userName}
                    setAdminName={props.setUserName}
                    userEmail={props.userEmail}
                    setUserEmail={props.setUserEmail}
                    adminPhone={props.adminPhone}
                    setAdminPhone={props.setAdminPhone}
                    userRole={viewRole}
                />
            );
        default:
            return <Dashboard adminName={props.userName} setActiveTab={props.setActiveTab} userRole={viewRole} />;
    }
};

export default SuperAdminRoutes;
