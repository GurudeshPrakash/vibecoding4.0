import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import TopNav from './components/shared/TopNav';
import Landing from './components/shared/Landing';
import StaffLogin from './components/staff/Login';
import StaffDashboard from './components/staff/Dashboard';
import StaffSidebar from './components/staff/Sidebar';
import StaffInventory from './components/staff/Inventory';
import StaffProfile from './components/staff/Profile';
import LogoutModal from './components/shared/LogoutModal';

import { useEquipmentData } from './hooks/useEquipmentData';
import { useNotifications } from './hooks/useNotifications';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const StaffLayout = ({
  children,
  staffTab,
  navigate,
  setShowLogoutModal,
  userName,
  userEmail,
  profileImage,
  setProfileImage,
  notifications,
  setNotifications,
  loginRole
}) => (
  <div className="app-layout">
    <StaffSidebar activeTab={staffTab} setActiveTab={(tab) => navigate(`/staff/${tab}`)} onLogoutTrigger={() => setShowLogoutModal(true)} />

    <main className="main-container">
      <TopNav
        adminName={userName}
        adminEmail={userEmail}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        setActiveTab={(tab) => navigate(`/staff/${tab}`)}
        onLogoutTrigger={() => setShowLogoutModal(true)}
        role="Manager"
        notifications={notifications}
        setNotifications={setNotifications}
        loginRole={loginRole}
      />

      <div className="content-area">
        {children}
      </div>
    </main>
  </div>
);

function App() {
  const { login, logout, isAuthenticated } = useAuth();
  const loginRole = 'staff'; // Hardcoded for Staff app
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract active path section for sidebar
  const staffTab = location.pathname.split('/')[2] || 'dashboard';

  // Pre-load user data from localStorage for synchronous initialization
  const savedStaffData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('staff_user_info')) || {};
    } catch {
      return {};
    }
  }, []);

  const [userName, setUserName] = useState(savedStaffData.firstName || (isAuthenticated ? 'Staff' : 'Staff member'));
  const [userEmail, setUserEmail] = useState(savedStaffData.email || '');
  const [adminPhone, setAdminPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const {
    inventoryData,
    dismantledHistory,
    finalizeDismantle,
    setInventoryData,
  } = useEquipmentData(isAuthenticated, loginRole);

  const { notifications, setNotifications } = useNotifications(isAuthenticated, loginRole);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      try {
        const urlUser = JSON.parse(decodeURIComponent(urlParams.get('user') || '{}'));
        const urlLogId = urlParams.get('logId');

        localStorage.setItem('staff_token', urlToken);
        if (urlLogId) localStorage.setItem('staff_current_log', urlLogId);
        localStorage.setItem('staff_user_info', JSON.stringify(urlUser));

        setUserName(urlUser.firstName || 'Staff');
        setUserEmail(urlUser.email || '');

        login(urlUser, urlToken);

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error("SSO Login failed", e);
      }
    } else {
      const staffToken = localStorage.getItem('staff_token');
      if (staffToken && !isAuthenticated) {
        const savedStaff = JSON.parse(localStorage.getItem('staff_user_info'));
        if (savedStaff) {
          setUserName(savedStaff.firstName || 'Staff');
          setUserEmail(savedStaff.email || '');
        }
      }
    }
  }, [login, isAuthenticated]);



  const stats = useMemo(() => {
    return {
      total: inventoryData.length,
      good: inventoryData.filter(i => i.status === 'Good').length,
      maintenance: inventoryData.filter(i => i.status === 'Maintenance').length,
      dismantled: dismantledHistory.filter(i => i.status === 'Approved').length
    };
  }, [inventoryData, dismantledHistory]);

  const addNotification = (actionType, equipment) => {
    const newNotif = {
      id: Date.now(),
      equipmentName: equipment.name,
      equipmentImage: equipment.photo,
      action: actionType,
      status: equipment.status,
      staffName: userName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      equipmentId: equipment.id,
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleSelectRole = (role) => {
    if (role === 'staff') {
      // Force navigation to login page to ensure security checkpoint
      navigate('/staff/login');
    } else {
      alert("This is the Staff portal. Please use the Admin portal for admin access.");
    }
  };

  const handleLogin = (data) => {
    setUserName(data.firstName);
    setUserEmail(data.email);

    login(data, data.token);
    navigate('/staff/dashboard');
  };

  const handleLogout = async () => {
    const logId = localStorage.getItem('staff_current_log');
    if (logId) {
      try {
        await fetch('http://localhost:5000/api/staff/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logId })
        });
      } catch (e) {
        console.error('Logout logging failed', e);
      }
    }
    logout();
    setUserName('Staff member'); // Reset local state
    setShowLogoutModal(false);
    navigate('/');
  };

  const layoutProps = {
    staffTab,
    navigate,
    setShowLogoutModal,
    userName,
    userEmail,
    profileImage,
    setProfileImage,
    notifications,
    setNotifications,
    loginRole
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing onSelectRole={handleSelectRole} />} />
        <Route path="/staff/login" element={!isAuthenticated ? <StaffLogin onLogin={handleLogin} onBack={() => navigate('/')} /> : <Navigate to="/staff/dashboard" />} />

        {/* Protected Routes */}
        <Route path="/staff/dashboard" element={<ProtectedRoute allowedRoles={['manager', 'admin', 'superadmin']}><StaffLayout {...layoutProps}><StaffDashboard staffName={userName} stats={stats} allInventory={inventoryData} dismantledHistory={dismantledHistory} onFinalizeDismantle={finalizeDismantle} /></StaffLayout></ProtectedRoute>} />
        <Route path="/staff/inventory" element={<ProtectedRoute allowedRoles={['manager', 'admin', 'superadmin']}><StaffLayout {...layoutProps}><StaffInventory inventoryData={inventoryData} setInventoryData={setInventoryData} addNotification={addNotification} /></StaffLayout></ProtectedRoute>} />
        <Route path="/staff/profile" element={<ProtectedRoute allowedRoles={['manager', 'admin', 'superadmin']}><StaffLayout {...layoutProps}><StaffProfile staffInfo={{ firstName: userName, email: userEmail, phone: adminPhone }} setProfileImage={setProfileImage} /></StaffLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <LogoutModal isOpen={showLogoutModal} onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </>
  );
}

export default App;
