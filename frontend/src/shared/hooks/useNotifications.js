import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../api/apiService';

/**
 * Custom hook for managing system notifications.
 */
export const useNotifications = (isAuthenticated, loginRole) => {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated || !loginRole) return;

        // Determine API endpoint based on role
        const isAdminType = loginRole === 'admin' || loginRole === 'super_admin';
        const apiBase = isAdminType ? '/admin' : '/staff';
        const token = sessionStorage.getItem('admin_token');

        // Prepare development/local notifications
        const devNotifsRaw = JSON.parse(localStorage.getItem('dev_notifications') || '[]');
        const devNotifs = devNotifsRaw.map(n => ({
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

        try {
            const result = await apiRequest(`${apiBase}/notifications`, 'GET', null, token);

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

                // Combine Dev and API notifications
                setNotifications([...devNotifs, ...apiNotifs]);
            } else {
                // If API fails, show dev + local mocks
                const localMocks = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
                setNotifications([...devNotifs, ...localMocks]);
            }
        } catch (e) {
            console.error('Notification fetch failed', e);
            const localMocks = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
            setNotifications([...devNotifs, ...localMocks]);
        }
    }, [isAuthenticated, loginRole]);

    useEffect(() => {
        if (isAuthenticated && loginRole) {
            fetchNotifications();
            // Polling for simulation responsiveness
            const interval = setInterval(() => {
                fetchNotifications().catch(err => console.log('Background sync skipped:', err.message));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, loginRole, fetchNotifications]);

    return { notifications, setNotifications, refreshNotifications: fetchNotifications };
};

