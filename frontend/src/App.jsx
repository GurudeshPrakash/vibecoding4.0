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
import StaffLogin from './components/staff/Login';
import StaffDashboard from './components/staff/Dashboard';
import StaffSidebar from './components/staff/Sidebar';
import StaffInventory from './components/staff/Inventory';
import StaffProfile from './components/staff/Profile';
import ActivityLogs from './components/admin/ActivityLogs';
import LogoutModal from './components/shared/LogoutModal';
import ActivityDetailModal from './components/shared/ActivityDetailModal';
import ForgotPassword from './components/admin/ForgotPassword';
import ResetPassword from './components/admin/ResetPassword';

const initialInventoryData = [
  {
    id: 'TM-204-01',
    name: 'Pro-Series Treadmill G7',
    type: 'Treadmill',
    category: 'Cardio',
    status: 'Good',
    area: 'Cardio Zone',
    branch: 'Power World - Colombo 07',
    photo: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800',
    serial: 'SN-TM-2024-001X',
    brand: 'Life Fitness',
    model: '95T Elevation',
    mfgYear: '2024',
    origin: 'USA',
    power: '4.0 HP AC Motor',
    voltage: '220V / 50Hz',
    usageType: 'Heavy Commercial',
    lastMaintenance: '2026-01-15',
    nextMaintenance: '2026-04-15',
    totalUsageHours: '1,245 Hours',
    vendor: 'Global Fitness Solutions',
    warranty: '3 Years Comprehensive',
  },
  {
    id: 'EB-102-05',
    name: 'Matrix Upright Bike U50',
    type: 'Exercise Bike',
    category: 'Cardio',
    status: 'Maintenance',
    area: 'Cardio Zone',
    branch: 'Power World - Colombo 07',
    photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    serial: 'SN-EB-2023-112B',
    brand: 'Matrix',
    model: 'U50 V2',
    mfgYear: '2023',
    origin: 'Taiwan',
    power: 'Self-Generating',
    voltage: 'N/A',
    usageType: 'Commercial',
    lastMaintenance: '2025-12-01',
    nextMaintenance: '2026-02-28',
    totalUsageHours: '890 Hours',
    vendor: 'SportTech Imports',
    warranty: '1 Year Remaining',
  },
  {
    id: 'LP-305-12',
    name: 'Plate-Loaded Leg Press',
    type: 'Leg Press Machine',
    category: 'Weight Machine',
    status: 'Good',
    area: 'Leg Zone',
    branch: 'Power World - Colombo 07',
    photo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    serial: 'SN-LP-2022-998C',
    brand: 'Hammer Strength',
    model: 'MTS Leg Press',
    mfgYear: '2022',
    origin: 'USA',
    power: 'Mechanical',
    voltage: 'N/A',
    usageType: 'Commercial',
    lastMaintenance: '2026-02-01',
    nextMaintenance: '2026-08-01',
    totalUsageHours: '12,000+ Sets',
    vendor: 'Life Fitness Direct',
    warranty: '5 Years Frame',
  }
];

import { useEquipmentData } from './hooks/useEquipmentData';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loginRole, setLoginRole] = useState('admin');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [staffTab, setStaffTab] = useState('dashboard');
  const [userName, setUserName] = useState('Vibe Master');
  const [userEmail, setUserEmail] = useState('master@vibecoding.com');
  const [adminPhone, setAdminPhone] = useState('+94 77 999 8888');
  const [adminId, setAdminId] = useState('ADM-2026-001');
  const [profileImage, setProfileImage] = useState(null);

  const [resetToken, setResetToken] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Senior dev refactor: Business logic decoupled via custom hooks
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

  // Handle Reset Password URL check
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/reset-password/')) {
      const token = path.split('/').pop();
      setResetToken(token);
      setLoginRole('admin');
      setCurrentView('reset-password');
    }
  }, []);

  const handleViewActivityLog = async (logId) => {
    if (loginRole !== 'admin') return;
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

  const addNotification = (actionType, equipment, role = 'staff') => {
    // This is for local inventory changes, keeping it for now
    const newNotif = {
      id: Date.now(),
      equipmentName: equipment.name,
      equipmentImage: equipment.photo,
      action: actionType,
      status: equipment.status,
      staffName: role === 'staff' ? userName : 'System',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      equipmentId: equipment.id,
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleSelectRole = (role) => {
    setLoginRole(role);
    setCurrentView('login');
  };

  const handleLogin = (data) => {
    // Staff login returns an object from Login.jsx
    if (loginRole === 'staff') {
      setUserName(data.firstName);
      setUserEmail(data.email);
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    } else {
      // Admin login logic remains similar but should ideally use API too
      // For now, keeping original admin login path if data is email/pass dummy
      // (Assuming admin login handles itself or we extend it later)
      if (typeof data === 'string') {
        // Legacy handleLogin(email, pass) call
        return;
      }
      // If data is from a future Admin login API
      setUserName(data.firstName || 'Admin');
      setUserEmail(data.email);
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    }
  };

  const handleAdminLoginLegacy = (email, password) => {
    // Keeping mock for admin login as requested "Admin login and admin signup flows must remain separate"
    const savedUser = JSON.parse(localStorage.getItem('admin_user'));
    if ((savedUser && savedUser.email === email && savedUser.password === password) ||
      (email === 'master@vibecoding.com' && password === 'admin123')) {
      setUserName(savedUser?.firstName || 'Vibe Master');
      setUserEmail(email);
      localStorage.setItem('admin_token', 'mock-admin-token'); // Need a token for API calls
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    } else {
      alert("Invalid admin credentials!");
    }
  };

  const handleLogout = async () => {
    if (loginRole === 'staff') {
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
    } else {
      localStorage.removeItem('admin_token');
    }

    setIsAuthenticated(false);
    setShowLogoutModal(false);
    if (loginRole === 'staff') {
      setCurrentView('login');
    } else {
      setCurrentView('landing');
      setLoginRole(null);
    }
  };

  if (!isAuthenticated) {
    if (currentView === 'landing') return <Landing onSelectRole={handleSelectRole} />;
    if (currentView === 'login') {
      return loginRole === 'admin' ? (
        <AdminLogin onLogin={handleLogin} onBack={() => setCurrentView('landing')} onGoToSignUp={(view) => setCurrentView(typeof view === 'string' ? view : 'signup')} />
      ) : (
        <StaffLogin onLogin={handleLogin} onBack={() => setCurrentView('landing')} />
      );
    }
    if (currentView === 'signup') {
      return loginRole === 'admin' ? (
        <AdminSignUp onSignUpSuccess={() => setCurrentView('login')} onBack={() => setCurrentView('login')} onGoToLogin={() => setCurrentView('login')} />
      ) : null;
    }
    if (currentView === 'forgot-password') {
      return <ForgotPassword onBack={() => setCurrentView('login')} />;
    }
    if (currentView === 'reset-password') {
      return <ResetPassword token={resetToken} onComplete={() => { window.history.pushState({}, '', '/'); setCurrentView('login'); }} />;
    }
    return <Landing onSelectRole={handleSelectRole} />;
  }

  return (
    <div className="app-layout">
      {loginRole === 'admin' ? (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogoutTrigger={() => setShowLogoutModal(true)} />
      ) : (
        <StaffSidebar activeTab={staffTab} setActiveTab={setStaffTab} onLogoutTrigger={() => setShowLogoutModal(true)} />
      )}

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
          setActiveTab={loginRole === 'admin' ? setActiveTab : setStaffTab}
          onLogoutTrigger={() => setShowLogoutModal(true)}
          role={loginRole === 'admin' ? 'Administrator' : 'Manager'}
          notifications={notifications}
          setNotifications={setNotifications}
          loginRole={loginRole}
          onViewLog={handleViewActivityLog}
        />

        <div className="content-area">
          {loginRole === 'admin' && activeTab === 'dashboard' && (
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
          {loginRole === 'admin' && activeTab === 'owners' && <GymOwners />}
          {loginRole === 'admin' && activeTab === 'locations' && <Locations />}
          {loginRole === 'admin' && activeTab === 'activity-logs' && <ActivityLogs onViewLog={handleViewActivityLog} />}
          {loginRole === 'admin' && activeTab === 'settings' && (
            <Settings adminName={userName} setAdminName={setUserName} theme={theme} toggleTheme={toggleTheme} />
          )}

          {loginRole === 'staff' && staffTab === 'dashboard' && (
            <StaffDashboard
              staffName={userName}
              stats={stats}
              allInventory={inventoryData}
              dismantledHistory={dismantledHistory}
              onFinalizeDismantle={finalizeDismantle}
            />
          )}
          {loginRole === 'staff' && staffTab === 'inventory' && (
            <StaffInventory inventoryData={inventoryData} setInventoryData={setInventoryData} addNotification={addNotification} />
          )}
          {loginRole === 'staff' && staffTab === 'profile' && (
            <StaffProfile
              staffInfo={{ firstName: userName, email: userEmail, phone: adminPhone }}
              setProfileImage={setProfileImage}
            />
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
