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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loginRole = 'staff'; // Hardcoded for Staff app
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract active path section for sidebar
  const staffTab = location.pathname.split('/')[2] || 'dashboard';

  const [userName, setUserName] = useState('Staff member');
  const [userEmail, setUserEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const {
    inventoryData,
    dismantledHistory,
    isLoading: isInventoryLoading,
    finalizeDismantle,
    setInventoryData,
  } = useEquipmentData(isAuthenticated, loginRole);

  const { notifications, setNotifications } = useNotifications(isAuthenticated, loginRole);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      const urlUser = JSON.parse(decodeURIComponent(urlParams.get('user') || '{}'));
      const urlLogId = urlParams.get('logId');

      localStorage.setItem('staff_token', urlToken);
      if (urlLogId) localStorage.setItem('staff_current_log', urlLogId);
      localStorage.setItem('staff_user_info', JSON.stringify(urlUser));

      setIsAuthenticated(true);
      setUserName(urlUser.firstName || 'Staff');
      setUserEmail(urlUser.email || '');

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const staffToken = localStorage.getItem('staff_token');
      if (staffToken) {
        setIsAuthenticated(true);
        const savedStaff = JSON.parse(localStorage.getItem('staff_user_info'));
        if (savedStaff) {
          setUserName(savedStaff.firstName || 'Staff');
          setUserEmail(savedStaff.email || '');
        }
      }
    }
  }, []);

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
      if (isAuthenticated) {
        navigate('/staff/dashboard');
      } else {
        navigate('/staff/login');
      }
    } else {
      alert("This is the Staff portal. Please use the Admin portal for admin access.");
    }
  };

  const handleLogin = (data) => {
    setUserName(data.firstName);
    setUserEmail(data.email);
    setIsAuthenticated(true);
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
    localStorage.removeItem('staff_token');
    localStorage.removeItem('staff_current_log');
    localStorage.removeItem('staff_user_info');

    setIsAuthenticated(false);
    setShowLogoutModal(false);
    navigate('/');
  };

  const Layout = ({ children }) => (
    <div className="app-layout">
      <StaffSidebar activeTab={staffTab} setActiveTab={(tab) => navigate(`/staff/${tab}`)} onLogoutTrigger={() => setShowLogoutModal(true)} />

      <main className="main-container">
        <TopNav
          adminName={userName}
          adminEmail={userEmail}
          theme={theme}
          toggleTheme={toggleTheme}
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

      <LogoutModal isOpen={showLogoutModal} onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Landing onSelectRole={handleSelectRole} />} />
      <Route path="/staff/login" element={!isAuthenticated ? <StaffLogin onLogin={handleLogin} onBack={() => navigate('/')} /> : <Navigate to="/staff/dashboard" />} />

      {/* Protected Routes */}
      <Route path="/staff/dashboard" element={isAuthenticated ? <Layout><StaffDashboard staffName={userName} stats={stats} allInventory={inventoryData} dismantledHistory={dismantledHistory} onFinalizeDismantle={finalizeDismantle} /></Layout> : <Navigate to="/staff/login" />} />
      <Route path="/staff/inventory" element={isAuthenticated ? <Layout><StaffInventory inventoryData={inventoryData} setInventoryData={setInventoryData} addNotification={addNotification} /></Layout> : <Navigate to="/staff/login" />} />
      <Route path="/staff/profile" element={isAuthenticated ? <Layout><StaffProfile staffInfo={{ firstName: userName, email: userEmail, phone: adminPhone }} setProfileImage={setProfileImage} /></Layout> : <Navigate to="/staff/login" />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

