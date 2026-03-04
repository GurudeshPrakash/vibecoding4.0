import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../utils/apiService';

/**
 * Custom hook for managing system notifications.
 */
export const useNotifications = (isAuthenticated, loginRole) => {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated || !loginRole) return;

        const apiBase = loginRole === 'admin' ? '/admin' : '/staff';
        const token = localStorage.getItem(`${loginRole}_token`);
        const result = await apiRequest(`${apiBase}/notifications`, 'GET', null, token);

        if (result.ok) {
            setNotifications(result.data.map(n => ({
                id: n._id,
                staffName: n.staffName,
                staffEmail: n.staffEmail,
                action: n.message || (n.type === 'Login' ? 'logged in' : 'logged out'),
                status: n.type === 'Login' ? 'Active' : (n.type === 'Inventory' ? 'New' : 'Ended'),
                time: new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: n.timestamp ? new Date(n.timestamp).toLocaleDateString() : '',
                branch: n.branch,
                type: n.type,
                unread: !n.isRead,
                isAuthNotif: true,
                activityLogId: n.activityLogId
            })));
        }
    }, [isAuthenticated, loginRole]);

    useEffect(() => {
        if (isAuthenticated && loginRole) {
            fetchNotifications();
            // Slow down background polling to 60s to reduce server load and jitter
            const interval = setInterval(() => {
                fetchNotifications().catch(err => console.log('Background sync skipped:', err.message));
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, loginRole, fetchNotifications]);

    return { notifications, setNotifications, refreshNotifications: fetchNotifications };
};
