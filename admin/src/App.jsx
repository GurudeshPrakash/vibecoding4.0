import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/shared/Sidebar';
import TopNav from './components/shared/TopNav';
import AdminDashboard from './components/admin/Dashboard';
import Locations from './components/admin/Locations';
import GymOwners from './components/admin/GymOwners';
import Settings from './components/admin/Settings';
import Landing from './components/shared/Landing';
import AdminLogin from './components/admin/Login';
import AdminSignUp from './components/admin/SignUp';
import ActivityLogs from './components/admin/ActivityLogs';
import LogoutModal from './components/shared/LogoutModal';
import ActivityDetailModal from './components/shared/ActivityDetailModal';
import ForgotPassword from './components/admin/ForgotPassword';
import ResetPassword from './components/admin/ResetPassword';

import { useEquipmentData } from './hooks/useEquipmentData';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('landing');
  const loginRole = 'admin'; // Hardcoded for Admin app
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [activeTab, setActiveTab] = useState(window.history.state?.tab || 'dashboard');
  const [userName, setUserName] = useState('Vibe Master');
  const [userEmail, setUserEmail] = useState('master@vibecoding.com');
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
      // We no longer auto-set currentView to 'dashboard' here 
      // so users always see the landing page first as requested.
      const savedAdmin = JSON.parse(localStorage.getItem('admin_user'));
      if (savedAdmin) {
        setUserName(savedAdmin.firstName || 'Admin');
        setUserEmail(savedAdmin.email || 'admin@gymsys.com');
      }
    }
  }, []);

  // Handle Reset Password URL check
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/reset-password/')) {
      const token = path.split('/').pop();
      setResetToken(token);
      setCurrentView('reset-password');
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
    // In Admin app, we only care about admin role
    if (role === 'admin') {
      if (isAuthenticated) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('login');
      }
    } else {
      alert("This is the Admin portal. Please use the Staff portal for staff access.");
    }
  };

  const handleLogin = (data) => {
    setUserName(data.firstName || 'Admin');
    setUserEmail(data.email);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setShowLogoutModal(false);
    setCurrentView('landing');
  };

  if (!isAuthenticated || currentView !== 'dashboard') {
    if (currentView === 'landing') return <Landing onSelectRole={handleSelectRole} />;
    
    // If not authenticated, force routing to auth views
    if (!isAuthenticated) {
      if (currentView === 'login') {
        return (
          <AdminLogin onLogin={handleLogin} onBack={() => setCurrentView('landing')} onGoToSignUp={(view) => setCurrentView(typeof view === 'string' ? view : 'signup')} />
        );
      }
      if (currentView === 'signup') {
        return (
          <AdminSignUp onSignUpSuccess={() => setCurrentView('login')} onBack={() => setCurrentView('login')} onGoToLogin={() => setCurrentView('login')} />
        );
      }
      if (currentView === 'forgot-password') {
        return <ForgotPassword onBack={() => setCurrentView('login')} />;
      }
      if (currentView === 'reset-password') {
        return <ResetPassword token={resetToken} onComplete={() => { window.history.pushState({}, '', '/'); setCurrentView('login'); }} />;
      }
      return <Landing onSelectRole={handleSelectRole} />;
    }
    
    // If authenticated but currentView is not dashboard (e.g. landing), it will be caught by the first if or falling through.
    // In this case, if they are authenticated and somehow on an auth view other than landing, redirect them.
    if (isAuthenticated && (currentView === 'login' || currentView === 'signup')) {
      setCurrentView('dashboard');
    }
  }

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogoutTrigger={() => setShowLogoutModal(true)} />

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
          setActiveTab={setActiveTab}
          onLogoutTrigger={() => setShowLogoutModal(true)}
          role="Administrator"
          notifications={notifications}
          setNotifications={setNotifications}
          loginRole={loginRole}
          onViewLog={handleViewActivityLog}
        />

        <div className="content-area">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              stats={stats}
              adminName={userName}
              recentInventory={inventoryData.slice(0, 4)}
              allInventory={inventoryData}
              dismantleRequests={dismantleRequests}
              setDismantleRequests={setDismantleRequests}
              refreshInventory={refreshInventory}
              dismantledHistory={dismantledHistory}
            />
          )}
          {activeTab === 'owners' && <GymOwners />}
          {activeTab === 'locations' && <Locations />}
          {activeTab === 'activity-logs' && <ActivityLogs onViewLog={handleViewActivityLog} />}
          {activeTab === 'settings' && (
            <Settings adminName={userName} setAdminName={setUserName} theme={theme} toggleTheme={toggleTheme} />
          )}
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
}

export default App;

