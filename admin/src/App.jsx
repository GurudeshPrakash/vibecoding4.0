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

import { useEquipmentData } from './hooks/useEquipmentData';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loginRole = 'admin'; // Hardcoded for Admin app
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract active path section for sidebar
  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[1] === 'super-admin'
    ? (pathParts[2] === 'admins' ? 'admins' : 'dashboard')
    : (pathParts[2] || 'dashboard');
  const [userName, setUserName] = useState('Vibe Master');
  const [userEmail, setUserEmail] = useState('master@vibecoding.com');
  const [adminRole, setAdminRole] = useState('admin');
  const [adminPhone, setAdminPhone] = useState('+94 77 999 8888');
  const [adminId, setAdminId] = useState('ADM-2026-001');
  const [profileImage, setProfileImage] = useState(null);

  const [resetToken, setResetToken] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const {
    inventoryData,
    dismantleRequests,
    dismantledHistory,
    isLoading: isInventoryLoading,
    refreshInventory,
    finalizeDismantle,
    setInventoryData,
    setDismantleRequests
  } = useEquipmentData(isAuthenticated, loginRole);

  const { notifications, setNotifications } = useNotifications(isAuthenticated, loginRole);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Restore session on refresh
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
      const savedAdmin = JSON.parse(localStorage.getItem('admin_user'));
      if (savedAdmin) {
        setUserName(savedAdmin.firstName || 'Admin');
        setUserEmail(savedAdmin.email || 'admin@gymsys.com');
        setAdminRole(savedAdmin.role || 'admin');
      }
    }
  }, []);

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

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
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
    if (isAuthenticated) {
      if (adminRole === 'super_admin') {
        navigate('/super-admin/dashboard');
      } else if (adminRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        // Staff/Manager dashboard is on another port
        const savedToken = localStorage.getItem('admin_token');
        const tokenStr = savedToken ? `?token=${savedToken}` : '';
        window.location.href = `http://localhost:5174/staff/dashboard${tokenStr}`;
      }
    } else {
      navigate('/login'); // Universal login page handles all
    }
  };

  const handleLogin = (data, loginPath) => {
    setUserName(data.firstName || 'User');
    setUserEmail(data.email);
    setAdminRole(data.role || 'staff');
    setIsAuthenticated(true);

    // Redirect based on role
    if (data.role === 'super_admin') {
      navigate('/super-admin/dashboard');
    } else if (data.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      // It's a manager or staff. Since this is the admin portal which only supports admin routes, 
      // we redirect them to the staff portal app with their credentials
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
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_current_log');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setShowLogoutModal(false);
    navigate('/');
  };

  const renderLayout = (children) => (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
        if (tab === 'admins') {
          navigate(`/super-admin/admins`);
        } else {
          navigate(`/admin/${tab}`);
        }
      }} onLogoutTrigger={() => setShowLogoutModal(true)} adminRole={adminRole} />

      <main className="main-container">
        <TopNav
          adminName={userName}
          adminEmail={userEmail}
          adminPhone={adminPhone}
          adminId={adminId}
          theme={theme}
          toggleTheme={toggleTheme}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          setActiveTab={(tab) => {
            if (tab === 'admins') {
              navigate(`/super-admin/admins`);
            } else {
              navigate(`/admin/${tab}`);
            }
          }}
          onLogoutTrigger={() => setShowLogoutModal(true)}
          role="Administrator"
          notifications={notifications}
          setNotifications={setNotifications}
          loginRole={loginRole}
          onViewLog={handleViewActivityLog}
        />

        <div className="content-area">
          {children}
        </div>
      </main>

      <LogoutModal isOpen={showLogoutModal} onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
      <ActivityDetailModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        log={selectedLog}
      />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Landing onSelectRole={handleSelectRole} />} />

      {/* Universal Login - No auto-redirect on authenticated to allow credential testing */}
      <Route path="/login" element={<AdminLogin onLogin={(data) => handleLogin(data, '/login')} onBack={() => navigate('/')} onGoToSignUp={(view) => navigate(`/admin/${view}`)} />} />
      <Route path="/admin/login" element={<Navigate to="/login" />} />
      <Route path="/super-admin/login" element={<Navigate to="/login" />} />

      <Route path="/admin/signup" element={<Navigate to="/login" />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword onBack={() => navigate('/login')} />} />
      <Route path="/reset-password/:token" element={<ResetPassword onComplete={() => navigate('/login')} />} />

      {/* Admin Protected Routes */}
      <Route path="/admin/dashboard" element={isAuthenticated ? renderLayout(<AdminDashboard stats={stats} adminName={userName} recentInventory={inventoryData.slice(0, 4)} allInventory={inventoryData} dismantleRequests={dismantleRequests} setDismantleRequests={setDismantleRequests} refreshInventory={refreshInventory} dismantledHistory={dismantledHistory} />) : <Navigate to="/admin/login" />} />
      <Route path="/admin/owners" element={isAuthenticated ? renderLayout(<GymOwners />) : <Navigate to="/admin/login" />} />
      <Route path="/admin/locations" element={isAuthenticated ? renderLayout(<Locations />) : <Navigate to="/admin/login" />} />
      <Route path="/admin/activity-logs" element={isAuthenticated ? renderLayout(<ActivityLogs onViewLog={handleViewActivityLog} />) : <Navigate to="/admin/login" />} />
      <Route path="/admin/settings" element={isAuthenticated ? renderLayout(<Settings adminName={userName} setAdminName={setUserName} theme={theme} toggleTheme={toggleTheme} />) : <Navigate to="/admin/login" />} />

      {/* Super Admin Protected Routes */}
      <Route path="/super-admin/dashboard" element={isAuthenticated && adminRole === 'super_admin' ? renderLayout(<AdminDashboard stats={stats} adminName={userName} recentInventory={inventoryData.slice(0, 4)} allInventory={inventoryData} dismantleRequests={dismantleRequests} setDismantleRequests={setDismantleRequests} refreshInventory={refreshInventory} dismantledHistory={dismantledHistory} />) : <Navigate to="/super-admin/login" />} />
      <Route path="/super-admin/owners" element={isAuthenticated && adminRole === 'super_admin' ? renderLayout(<GymOwners />) : <Navigate to="/super-admin/login" />} />
      <Route path="/super-admin/locations" element={isAuthenticated && adminRole === 'super_admin' ? renderLayout(<Locations />) : <Navigate to="/super-admin/login" />} />
      <Route path="/super-admin/activity-logs" element={isAuthenticated && adminRole === 'super_admin' ? renderLayout(<ActivityLogs onViewLog={handleViewActivityLog} />) : <Navigate to="/super-admin/login" />} />
      <Route path="/super-admin/settings" element={isAuthenticated && adminRole === 'super_admin' ? renderLayout(<Settings adminName={userName} setAdminName={setUserName} theme={theme} toggleTheme={toggleTheme} />) : <Navigate to="/super-admin/login" />} />

      {/* Super Admin Specialized Routes - Blocked from standard Admin role */}
      <Route path="/super-admin/admins" element={isAuthenticated && adminRole === 'super_admin' ? renderLayout(<Admins />) : <Navigate to={isAuthenticated ? "/admin/dashboard" : "/login"} />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

