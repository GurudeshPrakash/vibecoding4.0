import { useState, useEffect } from 'react';

/**
 * Custom hook to manage Super Admin dashboard specific statistics and live data.
 */
export const useSuperAdminStats = () => {
    const [statsState, setStatsState] = useState(() => {
        const raw = localStorage.getItem('sa_live_mock_database');
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch (e) { }
        }
        return {
            totalMembers: 0,
            activeMembers: 0,
            newMembersToday: 0,
            activeGyms: 0,
            acGyms: 0,
            nonAcGyms: 0,
            monthlyRevenue: 0,
            pendingPayments: 0,
            revenueTrend: [
                { month: 'Jan', revenue: 0 },
                { month: 'Feb', revenue: 0 },
                { month: 'Mar', revenue: 0 },
                { month: 'Apr', revenue: 0 },
                { month: 'May', revenue: 0 },
                { month: 'Jun', revenue: 0 },
            ],
            memberGrowth: [
                { name: 'Jan', members: 85000 },
                { name: 'Feb', members: 160000 },
                { name: 'Mar', members: 245000 },
                { name: 'Apr', members: 190000 },
                { name: 'May', members: 320000 },
                { name: 'Jun', members: 280000 },
                { name: 'Jul', members: 450000 },
                { name: 'Aug', members: 410000 },
                { name: 'Sep', members: 580000 },
                { name: 'Oct', members: 520000 },
                { name: 'Nov', members: 710000 },
                { name: 'Dec', members: 850000 },
            ],
            recentActivities: []
        };
    });

    useEffect(() => {
        const fetchLiveStats = () => {
            const raw = localStorage.getItem('sa_live_mock_database');
            const staffDb = JSON.parse(localStorage.getItem('admin_staff_db') || '[]');
            const adminsDb = JSON.parse(localStorage.getItem('mock_admins_db') || '[]');

            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    // Update dynamic counts from actual databases
                    parsed.totalStaff = staffDb.length;
                    parsed.activeStaff = staffDb.filter(s => s.status === 'Active').length;
                    parsed.totalAdmins = adminsDb.length;

                    setStatsState(parsed);
                } catch (e) { }
            } else {
                localStorage.setItem('sa_live_mock_database', JSON.stringify(statsState));
            }
        };
        fetchLiveStats();

        const LIVE_INTERVAL = setInterval(fetchLiveStats, 300);
        const FLUCTUATION_INTERVAL = setInterval(() => {
            setStatsState(prev => {
                if (!prev.memberGrowth) return prev;
                const newGrowth = [...prev.memberGrowth];
                const lastIdx = newGrowth.length - 1;
                const currentVal = newGrowth[lastIdx].members;
                const fluctuation = currentVal * (0.005 * (Math.random() - 0.5));
                newGrowth[lastIdx] = { ...newGrowth[lastIdx], members: Math.max(0, currentVal + fluctuation) };
                return { ...prev, memberGrowth: newGrowth };
            });
        }, 2500);

        return () => {
            clearInterval(LIVE_INTERVAL);
            clearInterval(FLUCTUATION_INTERVAL);
        };
    }, []);

    return statsState;
};
