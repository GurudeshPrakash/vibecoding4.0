import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#3b82f6' }}>Loading...</div>;
    }

    if (!isAuthenticated) {
        // If not logged in, redirect to login page but save the current location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If logged in but role not allowed, redirect to unauthorized or dashboard
        console.warn(`Access denied for role: ${user.role}. Required roles: ${allowedRoles}`);
        return <Navigate to={user.role === 'superadmin' ? '/super-admin/dashboard' : '/admin/dashboard'} replace />;
    }

    return children;
}
