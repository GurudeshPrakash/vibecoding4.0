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
<<<<<<< HEAD
=======
import AdminLogs from './components/admin/AdminLogs';
>>>>>>> main
import ActivityLogs from './components/admin/ActivityLogs';
import LogoutModal from './components/shared/LogoutModal';
import ActivityDetailModal from './components/shared/ActivityDetailModal';
import ForgotPassword from './components/admin/ForgotPassword';
import ResetPassword from './components/admin/ResetPassword';
import SuperAdminDashboard from './components/super-admin/SuperAdminDashboard';
import SuperAdminLogin from './components/super-admin/SuperAdminLogin';
<<<<<<< HEAD
import SuperAdminSettings from './components/super-admin/SuperAdminSettings';
import StaffDashboard from './components/staff/StaffDashboard';
import CheckIns from './components/staff/CheckIns';
import Payments from './components/staff/Payments';
import Members from './components/staff/Members';

import { useEquipmentData } from './hooks/useEquipmentData';
import { useNotifications } from './hooks/useNotifications';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
=======

import { useEquipmentData } from './hooks/useEquipmentData';
import { useNotifications } from './hooks/useNotifications';
>>>>>>> main

const AdminLayout = ({
  children,
  activeTab,
<<<<<<< HEAD
  setActiveTab,
=======
>>>>>>> main
  navigate,
  setShowLogoutModal,
  adminRole,
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
<<<<<<< HEAD
  <div className={`app-layout ${adminRole === 'super_admin' ? 'is-super-admin' : ''}`}>
    <Sidebar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogoutTrigger={() => setShowLogoutModal(true)}
      adminRole={adminRole}
    />
=======
  <div className="app-layout">
    <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
      const prefix = adminRole === 'super_admin' ? '/super-admin' : '/admin';
      navigate(`${prefix}/${tab}`);
    }} onLogoutTrigger={() => setShowLogoutModal(true)} adminRole={adminRole} />
>>>>>>> main

    <main className="main-container">
      <TopNav
        adminName={userName}
        adminEmail={userEmail}
        adminPhone={adminPhone}
        adminId={adminId}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
<<<<<<< HEAD
        setActiveTab={setActiveTab}
        onLogoutTrigger={() => setShowLogoutModal(true)}
        role={adminRole === 'super_admin' ? 'Super Admin' : adminRole === 'admin' ? 'Administrator' : 'Staff'}
=======
        setActiveTab={(tab) => {
          const prefix = adminRole === 'super_admin' ? '/super-admin' : '/admin';
          navigate(`${prefix}/${tab}`);
        }}
        onLogoutTrigger={() => setShowLogoutModal(true)}
        role="Administrator"
>>>>>>> main
        notifications={notifications}
        setNotifications={setNotifications}
        loginRole={loginRole}
        onViewLog={handleViewActivityLog}
<<<<<<< HEAD
        adminRole={adminRole}
=======
>>>>>>> main
      />

      <div className="content-area">
        {children}
      </div>
    </main>
  </div>
);

function App() {
<<<<<<< HEAD
  const { login, logout, isAuthenticated } = useAuth();
=======
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('admin_token'));
  const loginRole = 'admin'; // Hardcoded for Admin app
>>>>>>> main
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

<<<<<<< HEAD
  const loginRole = 'admin'; // Static for this app
=======
  // Extract active path section for sidebar
  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[1] === 'super-admin'
    ? (pathParts[2] || 'dashboard')
    : (pathParts[2] || 'dashboard');
>>>>>>> main

  // Pre-load user data from localStorage for synchronous initialization
  const savedAdminData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user')) || {};
    } catch {
      return {};
    }
  }, []);

<<<<<<< HEAD
  const [adminRole, setAdminRole] = useState(savedAdminData.role || 'admin');
  const [userName, setUserName] = useState(savedAdminData.firstName || savedAdminData.name || (isAuthenticated ? 'Shahana Kuganesan' : 'User'));
  const [userEmail, setUserEmail] = useState(savedAdminData.email || '');
=======
  const [userName, setUserName] = useState(savedAdminData.firstName || (isAuthenticated ? 'Admin' : 'Vibe Master'));
  const [userEmail, setUserEmail] = useState(savedAdminData.email || (isAuthenticated ? '' : 'master@vibecoding.com'));
  const [adminRole, setAdminRole] = useState(savedAdminData.role || 'admin');
>>>>>>> main
  const [adminPhone, setAdminPhone] = useState('+94 77 999 8888');
  const [adminId, setAdminId] = useState('ADM-2026-001');
  const [profileImage, setProfileImage] = useState(null);

<<<<<<< HEAD
  // Extract active track/tab from URL
  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[2] || 'dashboard';

=======
>>>>>>> main
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

<<<<<<< HEAD
  // Restore session
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken && !isAuthenticated) {
      const savedAdmin = JSON.parse(localStorage.getItem('admin_user'));
      if (savedAdmin) {
        setUserName(savedAdmin.firstName || 'User');
        setUserEmail(savedAdmin.email || '');
=======
  // Restore session handles any edge cases not caught by sync init
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken && !isAuthenticated) {
      setIsAuthenticated(true);
      const savedAdmin = JSON.parse(localStorage.getItem('admin_user'));
      if (savedAdmin) {
        setUserName(savedAdmin.firstName || 'Admin');
        setUserEmail(savedAdmin.email || 'admin@gymsys.com');
>>>>>>> main
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

<<<<<<< HEAD
=======


>>>>>>> main
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
<<<<<<< HEAD
      navigate('/login');
    } else if (role === 'super_admin') {
      navigate('/super-admin/login');
    } else {
=======
      // Force navigation to login page to ensure security checkpoint
      navigate('/login');
    } else if (role === 'super_admin') {
      // Force navigation to super-admin login
      navigate('/super-admin/login');
    } else {
      // Manager path - Force navigation to staff login for security
>>>>>>> main
      window.location.href = `http://localhost:5174/staff/login`;
    }
  };

  const handleLogin = (data) => {
    setUserName(data.firstName || 'User');
    setUserEmail(data.email);
<<<<<<< HEAD
    setAdminRole(data.role || 'admin');

    login(data, data.token);

    if (data.role === 'super_admin' || data.role === 'superadmin') {
=======
    setAdminRole(data.role || 'staff');
    setIsAuthenticated(true);

    if (data.role === 'super_admin') {
>>>>>>> main
      navigate('/super-admin/dashboard');
    } else if (data.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      const userParam = encodeURIComponent(JSON.stringify({ firstName: data.firstName, email: data.email, role: data.role }));
      window.location.href = `http://localhost:5174/staff/dashboard?token=${data.token}&user=${userParam}&logId=${data.logId}`;
    }
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
<<<<<<< HEAD
    logout();
    setAdminRole('admin');
=======
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_current_log');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
>>>>>>> main
    setShowLogoutModal(false);
    navigate('/');
  };

  const layoutProps = {
    activeTab,
<<<<<<< HEAD
    setActiveTab: (tab) => navigate(`/${adminRole === 'super_admin' ? 'super-admin' : 'admin'}/${tab}`),
=======
>>>>>>> main
    navigate,
    setShowLogoutModal,
    adminRole,
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

  return (
    <>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={isAuthenticated ? <Navigate to={`/${adminRole === 'super_admin' ? 'super-admin' : 'admin'}/dashboard`} /> : <Landing onSelectRole={handleSelectRole} />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={`/${adminRole === 'super_admin' ? 'super-admin' : 'admin'}/dashboard`} /> : <AdminLogin onLogin={handleLogin} onBack={() => navigate('/')} />} />

        {/* Redirect old paths */}
        <Route path="/admin/login" element={<Navigate to="/login" />} />
        <Route path="/super-admin/login" element={isAuthenticated ? <Navigate to="/super-admin/dashboard" /> : <SuperAdminLogin onLogin={handleLogin} onBack={() => navigate('/')} />} />

        <Route path="/admin/forgot-password" element={<ForgotPassword onBack={() => navigate('/login')} />} />
        <Route path="/reset-password/:token" element={<ResetPassword onComplete={() => navigate('/login')} />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminLayout {...layoutProps}><AdminDashboard stats={stats} adminName={userName} recentInventory={inventoryData.slice(0, 4)} allInventory={inventoryData} dismantleRequests={dismantleRequests} setDismantleRequests={setDismantleRequests} refreshInventory={refreshInventory} dismantledHistory={dismantledHistory} /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/owners" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminLayout {...layoutProps}><GymOwners /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/locations" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminLayout {...layoutProps}><Locations /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/activity-logs" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminLayout {...layoutProps}><ActivityLogs onViewLog={handleViewActivityLog} /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminLayout {...layoutProps}><Settings adminName={userName} setAdminName={setUserName} /></AdminLayout></ProtectedRoute>} />

        {/* Protected Super Admin Routes */}
        <Route path="/super-admin/dashboard" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminLayout {...layoutProps}><SuperAdminDashboard adminName={userName} /></AdminLayout></ProtectedRoute>} />
        <Route path="/super-admin/owners" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminLayout {...layoutProps}><GymOwners /></AdminLayout></ProtectedRoute>} />
        <Route path="/super-admin/locations" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminLayout {...layoutProps}><Locations /></AdminLayout></ProtectedRoute>} />
        <Route path="/super-admin/activity-logs" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminLayout {...layoutProps}><ActivityLogs onViewLog={handleViewActivityLog} /></AdminLayout></ProtectedRoute>} />
        <Route path="/super-admin/settings" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminLayout {...layoutProps}><SuperAdminSettings adminName={userName} setAdminName={setUserName} /></AdminLayout></ProtectedRoute>} />
        <Route path="/super-admin/admins" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminLayout {...layoutProps}><Admins /></AdminLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={`/${adminRole === 'super_admin' ? 'super-admin' : 'admin'}/dashboard`} />} />
=======
        <Route path="/" element={<Landing onSelectRole={handleSelectRole} />} />
        <Route path="/login" element={<AdminLogin onLogin={handleLogin} onBack={() => navigate('/')} onGoToSignUp={(view) => navigate(`/admin/${view}`)} />} />
        <Route path="/admin/login" element={<Navigate to="/login" />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin onLogin={handleLogin} onBack={() => navigate('/')} />} />
        <Route path="/admin/signup" element={<Navigate to="/login" />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword onBack={() => navigate('/login')} />} />
        <Route path="/reset-password/:token" element={<ResetPassword onComplete={() => navigate('/login')} />} />

        {/* Protected Routes */}
        <Route path="/admin/dashboard" element={isAuthenticated ? <AdminLayout {...layoutProps}><AdminDashboard stats={stats} adminName={userName} recentInventory={inventoryData.slice(0, 4)} allInventory={inventoryData} dismantleRequests={dismantleRequests} setDismantleRequests={setDismantleRequests} refreshInventory={refreshInventory} dismantledHistory={dismantledHistory} /></AdminLayout> : <Navigate to="/admin/login" />} />
        <Route path="/admin/owners" element={isAuthenticated ? <AdminLayout {...layoutProps}><GymOwners /></AdminLayout> : <Navigate to="/admin/login" />} />
        <Route path="/admin/locations" element={isAuthenticated ? <AdminLayout {...layoutProps}><Locations /></AdminLayout> : <Navigate to="/admin/login" />} />
        <Route path="/admin/activity-logs" element={isAuthenticated ? <AdminLayout {...layoutProps}><ActivityLogs onViewLog={handleViewActivityLog} /></AdminLayout> : <Navigate to="/admin/login" />} />
        <Route path="/admin/settings" element={isAuthenticated ? <AdminLayout {...layoutProps}><Settings adminName={userName} setAdminName={setUserName} /></AdminLayout> : <Navigate to="/admin/login" />} />

        {/* Super Admin Routes */}
        <Route path="/super-admin/dashboard" element={isAuthenticated && adminRole === 'super_admin' ? <AdminLayout {...layoutProps}><SuperAdminDashboard adminName={userName} /></AdminLayout> : <Navigate to="/super-admin/login" />} />
        <Route path="/super-admin/owners" element={isAuthenticated && adminRole === 'super_admin' ? <AdminLayout {...layoutProps}><GymOwners /></AdminLayout> : <Navigate to="/super-admin/login" />} />
        <Route path="/super-admin/locations" element={isAuthenticated && adminRole === 'super_admin' ? <AdminLayout {...layoutProps}><Locations /></AdminLayout> : <Navigate to="/super-admin/login" />} />
        <Route path="/super-admin/activity-logs" element={isAuthenticated && adminRole === 'super_admin' ? <AdminLayout {...layoutProps}><ActivityLogs onViewLog={handleViewActivityLog} /></AdminLayout> : <Navigate to="/super-admin/login" />} />
        <Route path="/super-admin/settings" element={isAuthenticated && adminRole === 'super_admin' ? <AdminLayout {...layoutProps}><Settings adminName={userName} setAdminName={setUserName} /></AdminLayout> : <Navigate to="/super-admin/login" />} />
        <Route path="/super-admin/admins" element={isAuthenticated && adminRole === 'super_admin' ? <AdminLayout {...layoutProps}><Admins /></AdminLayout> : <Navigate to={isAuthenticated ? "/admin/dashboard" : "/login"} />} />

        <Route path="*" element={<Navigate to="/" />} />
>>>>>>> main
      </Routes>
      <LogoutModal isOpen={showLogoutModal} onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
      <ActivityDetailModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} log={selectedLog} />
    </>
  );
}

export default App;
