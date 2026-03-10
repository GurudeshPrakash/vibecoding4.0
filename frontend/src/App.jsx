import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Layouts
import AdminLayout from './admin/layouts/AdminLayout';
import SuperAdminLayout from './super-admin/layouts/SuperAdminLayout';
import StaffLayout from './staff/layouts/StaffLayout';

// Shared Components
import LoginPage from './shared/pages/LoginPage';
import UnifiedDashboard from './shared/components/UnifiedDashboard';
import LogoutModal from './shared/components/LogoutModal';
import ActivityDetailModal from './shared/components/ActivityDetailModal';
import { apiRequest } from './shared/api/apiService';
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
  const { login, logout, isAuthenticated, user, loading: authLoading } = useAuth();

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
  }, [user, isAuthenticated]);

  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [adminRole, setAdminRole] = useState('admin');
  const [viewRole, setViewRole] = useState('admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSection, setActiveSection] = useState('admin');

  const normalizeRole = (role) => {
    if (!role) return 'admin';
    const r = role.toUpperCase();
    if (r === 'SUPER_ADMIN') return 'super_admin';
    if (r === 'ADMIN') return 'admin';
    if (r === 'STAFF') return 'staff';
    return role.toLowerCase(); // fallback for other roles
  };

  const loginRole = viewRole === 'super_admin' ? 'admin' : viewRole;



  const [adminPhone, setAdminPhone] = useState('+94 00 000 0000');
  const [adminId, setAdminId] = useState('ID-TEMP');
  const [profileImage, setProfileImage] = useState(null);

  // Sync state with local storage data on login/change
  useEffect(() => {
    if (isAuthenticated && savedAdminData && savedAdminData.email) {
      setUserName(`${savedAdminData.firstName || ''} ${savedAdminData.lastName || ''}`.trim() || 'User');
      setUserEmail(savedAdminData.email || '');
      setAdminPhone(savedAdminData.phone || '+94 00 000 0000');
      setAdminId(savedAdminData._id || 'ID-TEMP');

      const technicalRole = normalizeRole(savedAdminData.role);
      setAdminRole(technicalRole);
      setViewRole(technicalRole);
      setActiveSection(technicalRole === 'super_admin' ? 'super_admin' : (technicalRole === 'staff' ? 'staff' : 'admin'));
    }
  }, [savedAdminData, isAuthenticated]);

  // Route Protection & Auto-Redirect: Prevent unauthorized access and ensure correct URL
  useEffect(() => {
    if (isAuthenticated && adminRole) {
      const role = normalizeRole(adminRole);
      const path = location.pathname;

      // 1. Handle Redirect from /dashboard to specific role path
      if (path === '/dashboard' || path === '/') {
        if (role === 'super_admin') navigate('/super-admin/dashboard');
        else if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'staff') navigate('/staff/dashboard');
        return;
      }

      // 2. Sync activeSection with Path and Protect
      if (path.startsWith('/super-admin')) {
        if (role !== 'super_admin') {
          navigate('/dashboard');
        } else {
          setActiveSection('super_admin');
        }
      } else if (path.startsWith('/admin')) {
        if (role !== 'admin' && role !== 'super_admin') {
          navigate('/dashboard');
        } else {
          setActiveSection('admin');
        }
      } else if (path.startsWith('/staff')) {
        setActiveSection('staff');
      }
    }
  }, [adminRole, location.pathname, isAuthenticated, navigate]);

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
    } catch (e) {
      console.error('Failed to fetch activity log', e);
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

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const seenNotifs = React.useRef(new Set());

  // Notification "Pop" Logic for Staff
  useEffect(() => {
    if (isAuthenticated && loginRole === 'staff' && notifications.length > 0) {
      const pendingPoppable = notifications.find(n => 
        n.unread && 
        n.recipientEmail === 'staff@gym.com' && 
        (n.status === 'Approved' || n.status === 'Rejected') &&
        !seenNotifs.current.has(n.id)
      );

      if (pendingPoppable) {
        setToast({
          show: true,
          message: pendingPoppable.action || 'Report status updated',
          type: pendingPoppable.status === 'Approved' ? 'success' : 'rejected'
        });
        seenNotifs.current.add(pendingPoppable.id);
        
        // Auto-hide toast
        setTimeout(() => setToast(t => ({ ...t, show: false })), 5000);
      }
    }
  }, [notifications, isAuthenticated, loginRole]);

  const handleLogout = async () => {
    const logId = localStorage.getItem('admin_current_log');
    if (logId) {
      try {
        const token = localStorage.getItem('admin_token');
        await fetch(`http://localhost:5000/api/admin/staff-logs/${logId}/end`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
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
        // Essential: Save to localStorage first so it persists through reload
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          phone: data.phone,
          _id: data._id
        }));

        // Also update context for immediate (pre-reload) state if needed
        login(data, data.token);

        // Use a full page reload to clear ALL hook states, intervals, and cache
        // and force a fresh fetch with the new token.
        window.location.href = '/dashboard';
      } else {
        alert('Quick Switch failed: ' + (data.message || 'Check backend connection'));
      }
    } catch (err) {
      console.error('Quick switch failed', err);
      alert('Network error - Is the backend running?');
    }
  };

  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
        <Loader2 className="animate-spin" size={48} color="#ff0000" />
        <p style={{ marginTop: '20px', fontWeight: 600, letterSpacing: '1px' }}>INITIALIZING SECURE TERMINAL...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={(userData) => {
      login(userData, userData.token);
      const role = normalizeRole(userData.role);
      if (role === 'super_admin') navigate('/super-admin/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'staff') navigate('/staff/dashboard');
      else navigate('/dashboard');
    }} />;
  }

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
        return <StaffRoutes activeTab={activeTab} props={props} viewRole={viewRole} adminRole={adminRole} />;
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
        <Route path="/super-admin/dashboard" element={renderContentWithLayout()} />
        <Route path="/admin/dashboard" element={renderContentWithLayout()} />
        <Route path="/staff/dashboard" element={renderContentWithLayout()} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      
      {toast.show && (
        <div className="toast-container">
          <div className={`toast-box ${toast.type}`}>
            <div className="toast-msg">{toast.message}</div>
          </div>
        </div>
      )}

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
