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
import { TEST_USERS } from './shared/constants/testUsers';

// Icons for Dev Switcher
import { Shield, UserCog, Briefcase, RefreshCw } from 'lucide-react';


// Role-based Routes (Internal Page Mapping)
import AdminRoutes from './admin/routes/AdminRoutes';
import SuperAdminRoutes from './super-admin/routes/SuperAdminRoutes';
import StaffRoutes from './staff/routes/StaffRoutes';

function App() {
  const simulatedAuthenticated = true;
  const { login, logout, isAuthenticated: originalIsAuthenticated, user } = useAuth();
  const isAuthenticated = simulatedAuthenticated || originalIsAuthenticated;

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-load user data from context or localStorage
  const savedAdminData = useMemo(() => {
    if (user) return user;
    try {
      return JSON.parse(localStorage.getItem('admin_user')) || {};
    } catch {
      return {};
    }
  }, [user, originalIsAuthenticated]);

  const [userName, setUserName] = useState(
    savedAdminData.firstName
      ? `${savedAdminData.firstName} ${savedAdminData.lastName || ''}`.trim()
      : 'User'
  );
  const [userEmail, setUserEmail] = useState(savedAdminData.email || 'user@powerworld.com');
  const [adminRole, setAdminRole] = useState('super_admin');
  const [viewRole, setViewRole] = useState('super_admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSection, setActiveSection] = useState('super_admin');

  const loginRole = viewRole === 'super_admin' ? 'admin' : viewRole;

  useEffect(() => {
    setActiveSection(viewRole);
  }, [viewRole]);

  const [adminPhone, setAdminPhone] = useState(savedAdminData.phone || '+94 00 000 0000');
  const [adminId, setAdminId] = useState(savedAdminData._id || 'ID-TEMP');
  const [profileImage, setProfileImage] = useState(null);

  // Sync state with local storage data on login/change
  useEffect(() => {
    if (savedAdminData && savedAdminData.firstName) {
      setUserName(`${savedAdminData.firstName} ${savedAdminData.lastName || ''}`.trim());
      setUserEmail(savedAdminData.email || '');
      setAdminPhone(savedAdminData.phone || '+94 00 000 0000');
      setAdminId(savedAdminData._id || 'ID-TEMP');
      setAdminRole(savedAdminData.role || 'admin');

      // Initially, also set viewRole to their actual role
      if (savedAdminData.role) {
        setViewRole(savedAdminData.role);
        setActiveSection(savedAdminData.role === 'super_admin' ? 'super_admin' : (savedAdminData.role === 'staff' ? 'staff' : 'admin'));
      }
    }
  }, [savedAdminData, isAuthenticated]);

  const [selectedLog, setSelectedLog] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  // Apply TEST_USERS data based on viewRole
  useEffect(() => {
    const activeTestUser = TEST_USERS[viewRole] || TEST_USERS.super_admin;
    setUserName(activeTestUser.name);
    setUserEmail(activeTestUser.email);
    setAdminRole(activeTestUser.role);
    setAdminPhone(activeTestUser.phone);
    setAdminId(activeTestUser.id);
    setActiveSection(viewRole);

    // Auto-navigate to dashboard on switch to prevent being stuck on sub-tabs
    setActiveTab('dashboard');
  }, [viewRole]);

  const toggleRole = () => {
    const roles = ['super_admin', 'admin', 'staff'];
    const currentIndex = roles.indexOf(viewRole);
    const nextIndex = (currentIndex + 1) % roles.length;
    setViewRole(roles[nextIndex]);
  };

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

  const handleQuickSwitch = async (email, password) => {
    try {
      const { ok, data } = await apiRequest('/shared/login', 'POST', { email, password });

      if (ok) {
        // Update localStorage
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          phone: data.phone,
          _id: data._id
        }));

        // Update context and trigger re-render
        login(data, data.token);

        // Update local state directly for immediate feedback
        setAdminRole(data.role);
        setViewRole(data.role);
        setActiveSection(data.role === 'super_admin' ? 'super_admin' : (data.role === 'staff' ? 'staff' : 'admin'));
        setUserName(`${data.firstName} ${data.lastName || ''}`.trim());
        setUserEmail(data.email);

        // Force navigation
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        console.error('Login failed during switch:', data.message);
      }
    } catch (err) {
      console.error('Quick switch failed', err);
    }
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
    setUserName,
    userEmail,
    setUserEmail,
    adminId,
    adminPhone,
    setAdminPhone,
    profileImage,
    setProfileImage,
    notifications,
    setNotifications,
    loginRole,
    handleViewActivityLog,
    selectedProfileId,
    setSelectedProfileId,
    handleQuickSwitch
  };

  const renderDynamicTabContent = () => {
    const props = {
      userName,
      setUserName,
      userEmail,
      setUserEmail,
      adminPhone,
      setAdminPhone,
      stats,
      inventoryData,
      dismantleRequests,
      setDismantleRequests,
      refreshInventory,
      handleViewActivityLog,
      dismantledHistory,
      setActiveTab,
      selectedProfileId,
      setSelectedProfileId
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

      {/* 🚀 Dev Role Switcher - Permanent Test Setup */}
      <div className="dev-role-switcher" style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(8px)',
          padding: '10px 16px',
          borderRadius: '16px',
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: '800',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: viewRole === 'super_admin' ? '#10B981' : (viewRole === 'admin' ? '#3B82F6' : '#EF4444'),
              boxShadow: `0 0 10px ${viewRole === 'super_admin' ? '#10B981' : (viewRole === 'admin' ? '#3B82F6' : '#EF4444')}`
            }} />
            <span>TESTING AS: <span style={{ color: '#94A3B8' }}>{viewRole.toUpperCase().replace('_', ' ')}</span></span>
          </div>
          <button
            onClick={toggleRole}
            style={{
              background: 'var(--color-red)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
          >
            <RefreshCw size={12} /> SWITCH ROLE
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
