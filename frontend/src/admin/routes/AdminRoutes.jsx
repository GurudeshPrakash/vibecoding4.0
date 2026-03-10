import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import BranchManagement from '../pages/BranchManagement';
import MembersManagement from '../pages/MembersManagement';
import StaffManagement from '../pages/StaffManagement';
import InventoryManagement from '../pages/InventoryManagement';
import Payments from '../pages/Payments';
import Reports from '../pages/Reports';

const AdminRoutes = ({ sharedProps }) => {
    return (
        <Routes>
            <Route path="dashboard" element={<AdminDashboard adminName={sharedProps.userName} />} />
            <Route path="locations" element={<BranchManagement />} />
            <Route path="members" element={<MembersManagement />} />

            <Route path="staff" element={<StaffManagement />} />
            <Route path="manage-staff" element={<StaffManagement />} />
            <Route path="create-staff" element={<StaffManagement showCreateModal={true} />} />

            <Route path="inventory" element={<InventoryManagement inventoryData={sharedProps.inventoryData} />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reports" element={<Reports />} />

            {/* Default redirect for /admin */}
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
    );
};

export default AdminRoutes;

