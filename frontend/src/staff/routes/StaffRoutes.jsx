/**
 * @module StaffModule
 * @status STABLE - LOCKED
 * @description This module is development-complete. Avoid modifications unless specifically requested.
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StaffDashboard from '../pages/StaffDashboard';
import InventoryManagement from '../pages/InventoryManagement';
import MembersManagement from '../pages/MembersManagement';
import Payments from '../pages/Payments';

const StaffRoutes = ({ sharedProps }) => {
    return (
        <Routes>
            <Route path="dashboard" element={<StaffDashboard adminName={sharedProps.userName} inventoryData={sharedProps.inventoryData} />} />
            <Route path="inventory" element={<InventoryManagement inventoryData={sharedProps.inventoryData} userRole="staff" />} />
            <Route path="members" element={<MembersManagement userRole="staff" />} />
            <Route path="payments" element={<Payments userRole="staff" />} />
            <Route path="profile" element={<div className="p-4">Profile Section (Professional)</div>} />

            {/* Default redirect for /staff */}
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
    );
};

export default StaffRoutes;

