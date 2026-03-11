import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Auth Components
import Login from './auth/pages/Login';
import { useAuth } from './auth/hooks/useAuth.jsx';
import ProtectedRoute from './shared/components/ProtectedRoute';

// Layouts & Routes
import SuperAdminLayout from './super-admin/layouts/SuperAdminLayout';
import AdminLayout from './admin/layouts/AdminLayout';
import StaffLayout from './staff/layouts/StaffLayout';
import SuperAdminRoutes from './super-admin/routes/SuperAdminRoutes';
import AdminRoutes from './admin/routes/AdminRoutes';
import StaffRoutes from './staff/routes/StaffRoutes';

// Shared Components & Hooks
import LogoutModal from './shared/components/LogoutModal';
import ActivityDetailModal from './shared/components/ActivityDetailModal';
import { useEquipmentData } from './shared/hooks/useEquipmentData';
import { useNotifications } from './shared/hooks/useNotifications';

function App() {
  const { user, login, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // State for modals
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Get role-specific data using hooks
  // These hooks will fetch data based on the authenticated user's role
  const activeRole = user?.role?.toLowerCase() || 'staff';

  const {
    inventoryData,
    dismantleRequests,
    dismantledHistory,
    refreshInventory,
    setDismantleRequests
  } = useEquipmentData(isAuthenticated, activeRole);

  const { notifications, setNotifications } = useNotifications(isAuthenticated, activeRole);

  // Handle logout with cleanup
  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  const handleViewActivityLog = async (logId) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/admin/staff-logs/${logId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedLog(data);
        setIsLogModalOpen(true);
      }
    } catch (e) {
      console.error('Failed to fetch activity log', e);
    }
  };

  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
        <Loader2 className="animate-spin" size={48} color="#ff0000" />
        <p style={{ marginTop: '20px', fontWeight: 600, letterSpacing: '1px' }}>INITIALIZING SECURE TERMINAL...</p>
      </div>
    );
  }

  const sharedProps = {
    inventoryData,
    dismantleRequests,
    setDismantleRequests,
    refreshInventory,
    dismantledHistory,
    notifications,
    setNotifications,
    handleViewActivityLog
  };

  return (
    <>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to={`/${user.role.replace('_', '-')}/dashboard`} replace />
          ) : (
            <Login onLogin={(userData) => login(userData, userData.token)} />
          )
        } />

        {/* SUPER ADMIN PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
          <Route path="/super-admin/*" element={
            <SuperAdminLayout
              userName={user?.firstName}
              userEmail={user?.email}
              notifications={notifications}
              setNotifications={setNotifications}
              onLogoutTrigger={() => setShowLogoutModal(true)}
              onViewLog={handleViewActivityLog}
            >
              <SuperAdminRoutes sharedProps={sharedProps} />
            </SuperAdminLayout>
          } />
        </Route>

        {/* ADMIN PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={
            <AdminLayout
              userName={user?.firstName}
              userEmail={user?.email}
              notifications={notifications}
              setNotifications={setNotifications}
              onLogoutTrigger={() => setShowLogoutModal(true)}
              onViewLog={handleViewActivityLog}
            >
              <AdminRoutes sharedProps={sharedProps} />
            </AdminLayout>
          } />
        </Route>

        {/* STAFF PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route path="/staff/*" element={
            <StaffLayout
              userName={user?.firstName}
              userEmail={user?.email}
              notifications={notifications}
              setNotifications={setNotifications}
              onLogoutTrigger={() => setShowLogoutModal(true)}
              onViewLog={handleViewActivityLog}
            >
              <StaffRoutes sharedProps={sharedProps} />
            </StaffLayout>
          } />
        </Route>

        {/* ROOT REDIRECT */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Global Modals */}
      <LogoutModal
        isOpen={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />

      <ActivityDetailModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        log={selectedLog}
      />
    </>
  );
}

export default App;



