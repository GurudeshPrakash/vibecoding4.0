import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/shared/Sidebar';
import TopNav from './components/shared/TopNav';
import { Zap } from 'lucide-react';
import AdminDashboard from './components/admin/Dashboard';
import Locations from './components/super-admin/Locations';
import Settings from './components/admin/Settings';
import Landing from './components/shared/Landing';
import Administrators from './components/super-admin/Administrators';
import Managers from './components/super-admin/Managers';
import StaffManagement from './components/admin/StaffManagement';
import BranchManagement from './components/admin/BranchManagement';
import InventoryManagement from './components/admin/InventoryManagement';
import MembersManagement from './components/admin/MembersManagement';
import PaymentManagement from './components/admin/PaymentManagement';
import Reports from './components/admin/Reports';
import ActivityLogs from './components/super-admin/AdminLogs';
import LogoutModal from './components/shared/LogoutModal';
import ActivityDetailModal from './components/shared/ActivityDetailModal';
import ForgotPassword from './components/admin/ForgotPassword';
import ResetPassword from './components/admin/ResetPassword';
import SuperAdminDashboard from './components/super-admin/SuperAdminDashboard';
import SuperAdminLogin from './components/super-admin/SuperAdminLogin';
import SuperAdminSettings from './components/super-admin/SuperAdminSettings';
import StaffDashboard from './components/staff/StaffDashboard';
import CheckIns from './components/staff/CheckIns';
import Payments from './components/staff/Payments';
import Members from './components/staff/Members';
import StaffInventory from './components/staff/StaffInventory';
import UnifiedDashboard from './components/shared/UnifiedDashboard';

import { useEquipmentData } from './hooks/useEquipmentData';
import { useNotifications } from './hooks/useNotifications';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AdminLayout = ({
  children,
  activeTab,
  setActiveTab,
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
}) => (
  <div className={`app-layout ${viewRole === 'super_admin' ? 'is-super-admin' : ''}`}>
    <Sidebar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogoutTrigger={() => setShowLogoutModal(true)}
      adminRole={adminRole}
      viewRole={viewRole}
      setViewRole={setViewRole}
    />

    <main className="main-container">
      <TopNav
        adminName={userName}
        adminEmail={userEmail}
        adminPhone={adminPhone}
        adminId={adminId}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        setActiveTab={setActiveTab}
        onLogoutTrigger={() => setShowLogoutModal(true)}
        role={viewRole === 'super_admin' ? 'Super Admin' : viewRole === 'admin' ? 'Administrator' : 'Staff'}
        notifications={notifications}
        setNotifications={setNotifications}
        loginRole={loginRole}
        onViewLog={handleViewActivityLog}
        adminRole={adminRole}
        viewRole={viewRole}
      />

      <div className="content-area">
        {children}
      </div>

      {/* Floating Role Switcher - Always available for simulation */}
      <button
        onClick={() => {
          const nextRoles = { 'super_admin': 'admin', 'admin': 'staff', 'staff': 'super_admin' };
          const newRole = nextRoles[viewRole] || 'admin';
          setViewRole(newRole);
          setActiveTab('dashboard');
        }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'var(--primary-color, #0a1128)',
          color: 'var(--brand-yellow, #fdb813)',
          border: '2px solid var(--brand-yellow, #fdb813)',
          padding: '10px 15px',
          borderRadius: '25px',
          cursor: 'pointer',
          zIndex: 1000,
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Zap size={16} />
        Switch to {viewRole === 'super_admin' ? 'Admin' : viewRole === 'admin' ? 'Staff' : 'Super Admin'} View
      </button>

    </main>
  </div>
);

function App() {
  const simulatedAuthenticated = true;
  const { login, logout, isAuthenticated: originalIsAuthenticated } = useAuth();
  const isAuthenticated = simulatedAuthenticated || originalIsAuthenticated;

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-load user data from localStorage for synchronous initialization
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

  const loginRole = viewRole === 'super_admin' ? 'admin' : viewRole;

  useEffect(() => {
    // setActiveTab('dashboard'); // Optional: reset tab on role switch
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

  // Restore session
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken && !isAuthenticated) {
      const savedAdmin = JSON.parse(localStorage.getItem('admin_user'));
      if (savedAdmin) {
        setUserName(savedAdmin.firstName || 'User');
        setUserEmail(savedAdmin.email || '');
        setAdminRole(savedAdmin.role || 'admin');
      }
    }
  }, [isAuthenticated]);

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

  const handleSelectRole = (role) => {
    navigate('/login');
  };

  const handleLogin = (data) => {
    setUserName(data.firstName || 'User');
    setUserEmail(data.email);
    setAdminRole(data.role || 'staff');
    setViewRole(data.role || 'staff');
    setActiveTab('dashboard');
    login(data, data.token);
    navigate('/dashboard');
  };

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
    navigate,
    setShowLogoutModal,
    adminRole: viewRole, // DRIVE SIDEBAR WITH SIMULATED ROLE
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
    handleViewActivityLog,
    handleLogoutTrigger: () => setShowLogoutModal(true)
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
      setActiveTab
    };

    const targetRole = viewRole;

    if (targetRole === 'super_admin') {
      switch (activeTab) {
        case 'dashboard': return (
          <UnifiedDashboard
            userRole={viewRole}
            adminName={props.userName}
            stats={props.stats}
            recentInventory={props.inventoryData}
            dismantleRequests={props.dismantleRequests}
            setDismantleRequests={props.setDismantleRequests}
            refreshInventory={props.refreshInventory}
            setActiveTab={setActiveTab}
          />
        );
        case 'admins': return <Administrators />;
        case 'managers': return <Managers userRole={viewRole} />;
        case 'locations': return <Locations />;
        case 'activity-logs': return <ActivityLogs onViewLog={props.handleViewActivityLog} />;
        case 'settings': return <SuperAdminSettings adminName={props.userName} setAdminName={props.setUserName} />;
        default: return (
          <UnifiedDashboard
            userRole={viewRole}
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
    } else if (targetRole === 'admin') {
      switch (activeTab) {
        case 'dashboard': return (
          <UnifiedDashboard
            userRole={viewRole}
            adminName={props.userName}
            stats={props.stats}
            recentInventory={props.inventoryData}
            dismantleRequests={props.dismantleRequests}
            setDismantleRequests={props.setDismantleRequests}
            refreshInventory={props.refreshInventory}
            setActiveTab={setActiveTab}
          />
        );
        case 'staff': return <StaffManagement userRole={viewRole} />;
        case 'locations': return <BranchManagement />;
        case 'inventory': return <InventoryManagement inventoryData={props.inventoryData} />;
        case 'members': return <MembersManagement />;
        case 'payments': return <PaymentManagement />;
        case 'reports': return <Reports />;
        default: return (
          <UnifiedDashboard
            userRole={viewRole}
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
    } else {
      switch (activeTab) {
        case 'dashboard': return (
          <UnifiedDashboard
            userRole={viewRole}
            adminName={props.userName}
            stats={props.stats}
            recentInventory={props.inventoryData}
            dismantleRequests={props.dismantleRequests}
            setDismantleRequests={props.setDismantleRequests}
            refreshInventory={props.refreshInventory}
            setActiveTab={setActiveTab}
          />
        );
        case 'members': return <Members />;
        case 'payments': return <Payments />;
        case 'inventory': return <StaffInventory inventoryData={props.inventoryData} />;
        default: return (
          <UnifiedDashboard
            userRole={viewRole}
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
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Navigate to="/dashboard" />} />

        {/* Dashboards and Management */}
        <Route path="/dashboard" element={
          <AdminLayout {...layoutProps}>
            {renderDynamicTabContent()}
          </AdminLayout>
        } />

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      <LogoutModal isOpen={showLogoutModal} onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
      <ActivityDetailModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} log={selectedLog} />
    </>
  );
}

export default App;
