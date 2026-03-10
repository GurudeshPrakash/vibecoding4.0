import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../api/apiService';

/**
 * Custom hook for managing system notifications.
 */
export const useNotifications = (isAuthenticated, loginRole) => {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated || !loginRole) return;

        const apiBase = loginRole === 'admin' ? '/admin' : '/staff';
        const token = localStorage.getItem('admin_token');
        let result = { ok: false };
        try {
            result = await apiRequest(`${apiBase}/notifications`, 'GET', null, token);
        } catch (e) {
            // Silently fail for dev
        }

        const devNotifs = JSON.parse(localStorage.getItem('dev_notifications') || '[]').map(n => ({
            id: n.id,
            staffName: n.staffName,
            action: n.action || n.message,
            status: n.type === 'Damaged' ? 'Pending' : 'New',
            time: new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(n.timestamp).toLocaleDateString(),
            branch: n.branch || 'Main Branch',
            type: n.type || 'System',
            unread: n.unread !== false,
            isAuthNotif: true,
            reportId: n.reportId,
            equipmentName: n.equipmentName,
            priority: n.priority,
            recipientEmail: n.recipientEmail
        }));

        if (result.ok) {
            const apiNotifs = result.data.map(n => ({
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
            }));

            // Prioritize dev notifications for immediate feedback
            setNotifications([...devNotifs, ...apiNotifs]);
        } else {
            // Fallback to dev notifications and local mocks if API fails
            const localMocks = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
            setNotifications([...devNotifs, ...localMocks]);
        }
    }, [isAuthenticated, loginRole]);

    useEffect(() => {
        if (isAuthenticated && loginRole) {
            fetchNotifications();
            // Slow down background polling to 60s to reduce server load and jitter
            const interval = setInterval(() => {
                fetchNotifications().catch(err => console.log('Background sync skipped:', err.message));
            }, 10000); // Polling every 10 seconds for more responsive feedback
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, loginRole, fetchNotifications]);

    return { notifications, setNotifications, refreshNotifications: fetchNotifications };
};
