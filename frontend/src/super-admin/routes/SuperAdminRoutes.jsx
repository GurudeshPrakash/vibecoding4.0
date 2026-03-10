import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/SuperAdminDashboard';
import Administrations from '../pages/AdminManagement';
import StaffManagement from '../pages/StaffManagement';
import Locations from '../pages/BranchManagement';
import AdminLogs from '../pages/AdminLogs';
import Settings from '../pages/Settings';
import Members from '../pages/MemberManagement';
import Reports from '../pages/Reports';

const SuperAdminRoutes = ({ sharedProps }) => {
    return (
        <Routes>
            <Route path="dashboard" element={
                <Dashboard
                    adminName={sharedProps.userName}
                />
            } />

            <Route path="admins" element={<Administrations />} />
            <Route path="create-admin" element={<Administrations showCreateModal={true} />} />

            <Route path="staff" element={<StaffManagement />} />
            <Route path="locations" element={<Locations />} />
            <Route path="members" element={<Members />} />
            <Route path="reports" element={<Reports />} />
            <Route path="activity-logs" element={<AdminLogs onViewLog={sharedProps.handleViewActivityLog} />} />

            <Route path="settings" element={
                <Settings
                    adminName={sharedProps.userName}
                    userEmail={sharedProps.userEmail}
                />
            } />

            {/* Default redirect for /super-admin */}
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
    );
};

export default SuperAdminRoutes;

