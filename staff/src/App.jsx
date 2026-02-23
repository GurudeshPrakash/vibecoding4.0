import React, { useState, useEffect, useMemo } from 'react';
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
  const [currentView, setCurrentView] = useState('landing');
  const loginRole = 'staff'; // Hardcoded for Staff app
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [staffTab, setStaffTab] = useState(window.history.state?.tab || 'dashboard');
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

  // Restore session on refresh
  useEffect(() => {
    const staffToken = localStorage.getItem('staff_token');
    if (staffToken) {
      setIsAuthenticated(true);
      // We no longer auto-set currentView to 'dashboard' here 
      // so users always see the landing page first as requested.
      const savedStaff = JSON.parse(localStorage.getItem('staff_user_info'));
      if (savedStaff) {
        setUserName(savedStaff.firstName);
        setUserEmail(savedStaff.email);
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
        setCurrentView('dashboard');
      } else {
        setCurrentView('login');
      }
    } else {
      alert("This is the Staff portal. Please use the Admin portal for admin access.");
    }
  };

  const handleLogin = (data) => {
    setUserName(data.firstName);
    setUserEmail(data.email);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
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
    setCurrentView('landing');
  };

  if (!isAuthenticated || currentView !== 'dashboard') {
    if (currentView === 'landing') return <Landing onSelectRole={handleSelectRole} />;

    // If not authenticated, force routing to auth views
    if (!isAuthenticated) {
      if (currentView === 'login') {
        return (
          <StaffLogin onLogin={handleLogin} onBack={() => setCurrentView('landing')} />
        );
      }
      return <Landing onSelectRole={handleSelectRole} />;
    }

    // If authenticated but currentView is login, redirect back to dashboard
    if (isAuthenticated && currentView === 'login') {
      setCurrentView('dashboard');
    }
  }

  return (
    <div className="app-layout">
      <StaffSidebar activeTab={staffTab} setActiveTab={setStaffTab} onLogoutTrigger={() => setShowLogoutModal(true)} />

      <main className="main-container">
        <TopNav
          adminName={userName}
          adminEmail={userEmail}
          theme={theme}
          toggleTheme={toggleTheme}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          setActiveTab={setStaffTab}
          onLogoutTrigger={() => setShowLogoutModal(true)}
          role="Manager"
          notifications={notifications}
          setNotifications={setNotifications}
          loginRole={loginRole}
        />

        <div className="content-area">
          {staffTab === 'dashboard' && (
            <StaffDashboard
              staffName={userName}
              stats={stats}
              allInventory={inventoryData}
              dismantledHistory={dismantledHistory}
              onFinalizeDismantle={finalizeDismantle}
            />
          )}
          {staffTab === 'inventory' && (
            <StaffInventory inventoryData={inventoryData} setInventoryData={setInventoryData} addNotification={addNotification} />
          )}
          {staffTab === 'profile' && (
            <StaffProfile
              staffInfo={{ firstName: userName, email: userEmail, phone: adminPhone }}
              setProfileImage={setProfileImage}
            />
          )}
        </div>
      </main>

      <LogoutModal isOpen={showLogoutModal} onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </div>
  );
}

export default App;

