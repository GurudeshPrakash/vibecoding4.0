import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Layouts
import AdminLayout from './admin/layouts/AdminLayout';
import SuperAdminLayout from './super-admin/layouts/SuperAdminLayout';
import StaffLayout from './staff/layouts/StaffLayout';

// Shared Components
import Landing from './shared/components/Landing';
import UnifiedDashboard from './shared/components/UnifiedDashboard';
import LogoutModal from './shared/components/LogoutModal';
import ActivityDetailModal from './shared/components/ActivityDetailModal';
// Shared Hooks & Context
import { useEquipmentData } from './shared/hooks/useEquipmentData';
import { useNotifications } from './shared/hooks/useNotifications';
import { useAuth } from './shared/context/AuthContext';

// Role-based Routes (Internal Page Mapping)
import AdminRoutes from './admin/routes/AdminRoutes';
import SuperAdminRoutes from './super-admin/routes/SuperAdminRoutes';
import StaffRoutes from './staff/routes/StaffRoutes';

function App() {
  const simulatedAuthenticated = true;
  const { login, logout, isAuthenticated: originalIsAuthenticated } = useAuth();
  const isAuthenticated = simulatedAuthenticated || originalIsAuthenticated;

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-load user data from localStorage
  const savedAdminData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user')) || {};
    } catch {
      return {};
    }
  }, []);

  const [userName, setUserName] = useState(savedAdminData.firstName || savedAdminData.name || 'Vibe Master');
  const [userEmail, setUserEmail] = useState(savedAdminData.email || 'master@vibecoding.com');
  const [adminRole, setAdminRole] = useState('super_admin');
  const [viewRole, setViewRole] = useState('super_admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSection, setActiveSection] = useState('super_admin');

  const loginRole = viewRole === 'super_admin' ? 'admin' : viewRole;

  useEffect(() => {
    setActiveSection(viewRole);
  }, [viewRole]);

  const [adminPhone, setAdminPhone] = useState('+94 77 999 8888');
  const [adminId, setAdminId] = useState('ADM-2026-001');
  const [profileImage, setProfileImage] = useState(null);

  const [selectedLog, setSelectedLog] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const {
    inventoryData,
    dismantleRequests,
    dismantledHistory,
    refreshInventory,
    setDismantleRequests
  } = useEquipmentData(isAuthenticated, loginRole);

  const { notifications, setNotifications } = useNotifications(isAuthenticated, loginRole);

  const handleViewActivityLog = async (logId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:5000/api/admin/staff-logs/${logId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedLog(data);
        setIsLogModalOpen(true);
      }
    } catch (error) {
      console.error('Fetch log detail error:', error);
    }
  };

  const stats = useMemo(() => {
    return {
      total: inventoryData.length,
      good: inventoryData.filter(i => i.status === 'Good').length,
      maintenance: inventoryData.filter(i => i.status === 'Maintenance').length,
      dismantled: dismantledHistory.length
    };
  }, [inventoryData, dismantledHistory]);

  const handleLogout = async () => {
    const logId = localStorage.getItem('admin_current_log');
    if (logId) {
      try {
        await fetch('http://localhost:5000/api/admin/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logId })
        });
      } catch (e) {
        console.error('Logout logging failed', e);
      }
    }
    logout();
    setAdminRole('admin');
    setShowLogoutModal(false);
    navigate('/');
  };

  const layoutProps = {
    activeTab,
    setActiveTab,
    activeSection,
    setActiveSection,
    navigate,
    setShowLogoutModal,
    adminRole,
    viewRole,
    setViewRole,
    setAdminRole,
    userName,
    userEmail,
    adminId,
    adminPhone,
    profileImage,
    setProfileImage,
    notifications,
    setNotifications,
    loginRole,
    handleViewActivityLog
  };

  const renderDynamicTabContent = () => {
    const props = {
      userName,
      stats,
      inventoryData,
      dismantleRequests,
      setDismantleRequests,
      refreshInventory,
      handleViewActivityLog,
      dismantledHistory,
      setActiveTab,
      setUserName
    };

    switch (activeSection) {
      case 'super_admin':
        return <SuperAdminRoutes activeTab={activeTab} props={props} viewRole={viewRole} />;
      case 'admin':
        return <AdminRoutes activeTab={activeTab} props={props} viewRole={viewRole} />;
      case 'staff':
        return <StaffRoutes activeTab={activeTab} props={props} adminRole={adminRole} />;
      default:
        return (
          <UnifiedDashboard
            userRole={viewRole}
            permissionsRole={adminRole}
            adminName={props.userName}
            stats={props.stats}
            recentInventory={props.inventoryData}
            dismantleRequests={props.dismantleRequests}
            setDismantleRequests={props.setDismantleRequests}
            refreshInventory={props.refreshInventory}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  const renderContentWithLayout = () => {
    const content = renderDynamicTabContent();

    switch (activeSection) {
      case 'super_admin':
        return (
          <SuperAdminLayout {...layoutProps}>
            {content}
          </SuperAdminLayout>
        );
      case 'admin':
        return (
          <AdminLayout {...layoutProps}>
            {content}
          </AdminLayout>
        );
      case 'staff':
        return (
          <StaffLayout {...layoutProps}>
            {content}
          </StaffLayout>
        );
      default:
        return (
          <AdminLayout {...layoutProps}>
            {content}
          </AdminLayout>
        );
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={renderContentWithLayout()} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      <LogoutModal isOpen={showLogoutModal} onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
      <ActivityDetailModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} log={selectedLog} />
    </>
  );
}

export default App;
