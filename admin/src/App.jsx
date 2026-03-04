import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/shared/Sidebar';
import TopNav from './components/shared/TopNav';
import AdminDashboard from './components/admin/Dashboard';
import Locations from './components/admin/Locations';
import GymOwners from './components/admin/GymOwners';
import Settings from './components/admin/Settings';
import Landing from './components/shared/Landing';
import AdminLogin from './components/admin/Login';
import Admins from './components/admin/Admins';
import AdminLogs from './components/admin/AdminLogs';
import ActivityLogs from './components/admin/ActivityLogs';
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

import { useEquipmentData } from './hooks/useEquipmentData';
import { useNotifications } from './hooks/useNotifications';

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

      {/* Floating Role Switcher */}
      <button
        onClick={() => {
          const newRole = adminRole === 'super_admin' ? 'admin' : 'super_admin';
          setAdminRole(newRole);
          navigate(newRole === 'super_admin' ? '/super-admin/dashboard' : '/admin/dashboard');
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
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}
      >
        Switch to {adminRole === 'super_admin' ? 'Admin' : 'Super Admin'} View
      </button>

    </main>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const loginRole = 'admin'; // Hardcoded for Admin app
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

  const [userName, setUserName] = useState(savedAdminData.firstName || savedAdminData.name || (isAuthenticated ? 'Shahana Kuganesan' : 'Vibe Master'));
  const [userEmail, setUserEmail] = useState(savedAdminData.email || (isAuthenticated ? '' : 'master@vibecoding.com'));
  const savedRole = savedAdminData.role || 'super_admin';
  const [adminRole, setAdminRole] = useState(savedRole);
  const [viewRole, setViewRole] = useState(savedRole);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    setViewRole(adminRole);
    setActiveTab('dashboard');
  }, [adminRole]);
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

  // Restore session handles any edge cases not caught by sync init
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken && !isAuthenticated) {
      setIsAuthenticated(true);
      const savedAdmin = JSON.parse(localStorage.getItem('admin_user'));
      if (savedAdmin) {
        setUserName(savedAdmin.firstName || 'Shahana Kuganesan');
        setUserEmail(savedAdmin.email || 'admin@gymsys.com');
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
    if (role === 'admin') {
      // Navigate straight to admin dashboard instead of login
      navigate('/admin/dashboard');
    } else if (role === 'super_admin') {
      // Navigate straight to super admin dashboard instead of login
      navigate('/super-admin/dashboard');
    } else {
      // Manager path
      window.location.href = `http://localhost:5174/staff/dashboard`;
    }
  };

  const handleLogin = (data) => {
    setUserName(data.firstName || 'User');
    setUserEmail(data.email);
    setAdminRole(data.role || 'staff');
    setViewRole(data.role || 'staff');
    setActiveTab('dashboard');
    setIsAuthenticated(true);
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
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_current_log');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleToggleRole = () => { };

  const layoutProps = {
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
  };

  const renderDynamicTabContent = () => {
    const props = {
      userName,
      setUserName,
      stats,
      inventoryData,
      dismantleRequests,
      setDismantleRequests,
      refreshInventory,
      dismantledHistory,
      handleViewActivityLog
    };

    if (viewRole === 'super_admin') {
      switch (activeTab) {
        case 'dashboard': return <SuperAdminDashboard adminName={props.userName} setActiveTab={setActiveTab} />;
        case 'admins': return <Admins />;
        case 'managers': return <GymOwners />;
        case 'locations': return <Locations />;
        case 'activity-logs': return <ActivityLogs onViewLog={props.handleViewActivityLog} />;
        case 'settings': return <SuperAdminSettings adminName={props.userName} setAdminName={props.setUserName} />;
        default: return <SuperAdminDashboard adminName={props.userName} setActiveTab={setActiveTab} />;
      }
    } else if (viewRole === 'admin') {
      switch (activeTab) {
        case 'dashboard': return <AdminDashboard stats={props.stats} adminName={props.userName} recentInventory={props.inventoryData.slice(0, 4)} allInventory={props.inventoryData} dismantleRequests={props.dismantleRequests} setDismantleRequests={props.setDismantleRequests} refreshInventory={props.refreshInventory} dismantledHistory={props.dismantledHistory} />;
        case 'managers': return <GymOwners />;
        case 'members': return <Members />;
        case 'locations': return <Locations />;
        case 'reports': return <ActivityLogs onViewLog={props.handleViewActivityLog} />;
        default: return <AdminDashboard stats={props.stats} adminName={props.userName} recentInventory={props.inventoryData} dismantleRequests={props.dismantleRequests} setDismantleRequests={props.setDismantleRequests} refreshInventory={props.refreshInventory} dismantledHistory={props.dismantledHistory} />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <StaffDashboard />;
        case 'members': return <Members />;
        case 'check-ins': return <CheckIns />;
        case 'payments': return <Payments />;
        case 'inventory': return <StaffInventory inventoryData={props.inventoryData} />;
        default: return <StaffDashboard />;
      }
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing onSelectRole={handleSelectRole} />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AdminLogin onLogin={handleLogin} onBack={() => navigate('/')} onGoToSignUp={(view) => navigate(`/admin/${view}`)} />} />

        {/* Redirect old paths for compatibility */}
        <Route path="/admin/login" element={<Navigate to="/login" />} />
        <Route path="/super-admin/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SuperAdminLogin onLogin={handleLogin} onBack={() => navigate('/')} />} />
        <Route path="/admin/signup" element={<Navigate to="/login" />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword onBack={() => navigate('/login')} />} />
        <Route path="/reset-password/:token" element={<ResetPassword onComplete={() => navigate('/login')} />} />

        {/* Single Dashboard Route */}
        <Route path="/dashboard" element={
          isAuthenticated ? (
            <AdminLayout {...layoutProps}>
              {renderDynamicTabContent()}
            </AdminLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      <LogoutModal isOpen={showLogoutModal} onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
      <ActivityDetailModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} log={selectedLog} />
    </>
  );
}

export default App;
