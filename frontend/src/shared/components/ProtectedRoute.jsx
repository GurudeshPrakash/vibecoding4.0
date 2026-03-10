import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth.jsx';

/**
 * ProtectedRoute Component
 * Restricts access based on authentication status and user role.
 * 
 * @param {Array} allowedRoles - List of roles permitted to access the route
 */
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();

    // Define the hierarchy: lower index = higher power
    const roleHierarchy = ['super_admin', 'admin', 'staff'];

    const hasRequiredRole = () => {
        if (!allowedRoles) return true;

        const userLevel = roleHierarchy.indexOf(user?.role?.toLowerCase());

        // A user has access if their level is equal to or higher (lower index) 
        // than ANY of the allowed roles
        return allowedRoles.some(role => {
            const requiredLevel = roleHierarchy.indexOf(role.toLowerCase());
            return userLevel !== -1 && userLevel <= requiredLevel;
        });
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div className="loader">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!hasRequiredRole()) {
        const dashboardMap = {
            'super_admin': '/super-admin/dashboard',
            'admin': '/admin/dashboard',
            'staff': '/staff/dashboard'
        };
        return <Navigate to={dashboardMap[user.role] || '/login'} replace />;
    }

    return <Outlet />;
};


export default ProtectedRoute;
