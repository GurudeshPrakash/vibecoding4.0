import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Users, DollarSign, CreditCard, TrendingUp, AlertCircle,
    Activity, ShieldCheck, Building2, Zap
} from 'lucide-react';
import * as Recharts from 'recharts';

// Feature Components
import StatCard from '../components/StatCard';
import MiniCalendar from '../components/MiniCalendar';
import ActivityLog from '../components/ActivityLog';

// Hooks
import { useSuperAdminStats } from '../hooks/useSuperAdminStats';

// Styles
import '../../styles/SuperAdminDashboard.css';

const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '0.05em' }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
    );
};

const SuperAdminDashboard = ({ adminName = "Super Admin", setActiveTab, userRole = 'super_admin' }) => {
    const isSuperAdmin = userRole === 'super_admin';
    const isLocked = !isSuperAdmin;
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery] = useState(location.state?.initialSearch || '');

    // Using the custom hook for state and live updates
    const statsState = useSuperAdminStats();

    const COLORS = ['#FF0000', '#374151'];

    const mappedActivities = statsState.recentActivities.map((act) => ({
        ...act,
        icon: act.action && act.action.includes('session') ? <Activity size={18} /> : <Zap size={18} />,
        time: act.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    const filteredActivities = useMemo(() => {
        if (!searchQuery.trim()) return mappedActivities;
        const q = searchQuery.toLowerCase();
        return mappedActivities.filter(act =>
            act.user.toLowerCase().includes(q) ||
            act.action.toLowerCase().includes(q)
        );
    }, [mappedActivities, searchQuery]);

    const gymRatioData = [
        { name: 'AC Gyms', value: statsState.acGyms },
        { name: 'Non-AC Gyms', value: statsState.nonAcGyms },
    ];

    return (
        <div className="super-admin-dashboard" style={{ opacity: isLocked ? 0.95 : 1 }}>
            <header className="sa-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div className="sa-welcome" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1>Dashboard</h1>
                    <p>View the overall performance of all gym branches, manage admins, track staff activity, and monitor system operations.</p>
                </div>
                <div className="sa-actions">
                    <LiveClock />
                </div>
            </header>

            <section className="sa-summary-grid">
                <StatCard
                    label="Total Branches"
                    value={statsState?.totalStaff || '05'}
                    icon={<Users />}
                    iconBg="rgba(239, 68, 68, 0.1)"
                    iconColor="#FF0000"
                    onClick={() => { if (!isLocked) { setActiveTab('staff'); navigate('/dashboard'); } }}
                />
                <StatCard
                    label="Total Admins"
                    value={statsState?.activeMembers?.toLocaleString() || '0'}
                    icon={<Activity />}
                    iconBg="rgba(16, 185, 129, 0.1)"
                    iconColor="#10B981"
                    onClick={() => { if (!isLocked) { setActiveTab('staff'); navigate('/dashboard'); } }}
                />
                <StatCard
                    label="Total Staffs"
                    value={String(statsState?.totalAdmins || 3).padStart(2, '0')}
                    icon={<ShieldCheck />}
                    iconBg="rgba(59, 130, 246, 0.1)"
                    iconColor="#3B82F6"
                    onClick={() => { if (!isLocked) { setActiveTab('admins'); navigate('/dashboard'); } }}
                />
                <StatCard
                    label="ACTIVE BRANCHES"
                    value={statsState?.activeGyms || '12'}
                    icon={<Building2 />}
                    iconBg="rgba(245, 158, 11, 0.1)"
                    iconColor="#F59E0B"
                    onClick={() => { if (!isLocked) { setActiveTab('locations'); navigate('/dashboard'); } }}
                />
                <StatCard
                    label="MONTHLY REVENUE"
                    value={`LKR ${(statsState?.monthlyRevenue || 0).toFixed(1)}M`}
                    icon={<DollarSign />}
                    iconBg="rgba(139, 92, 246, 0.1)"
                    iconColor="#8B5CF6"
                />
                <StatCard
                    label="PENDING PAYMENTS"
                    value="LKR OK"
                    icon={<CreditCard />}
                    iconBg="rgba(239, 68, 68, 0.1)"
                    iconColor="#FF0000"
                />
            </section>

            <div className="sa-dashboard-layout">
                <main className="sa-analytics-col">
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <TrendingUp size={22} color="#FF0000" />
                                <h3>Network Expansion</h3>
                            </div>
                        </div>
                        <div style={{ height: '240px', minHeight: '240px', width: '100%', marginTop: '10px' }}>
                            <Recharts.ResponsiveContainer width="100%" height="100%">
                                <Recharts.AreaChart data={statsState.memberGrowth}>
                                    <defs>
                                        <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF0000" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                    <Recharts.XAxis dataKey="name" tick={{ fill: 'var(--color-text-dim)', fontSize: 9, fontWeight: 700 }} />
                                    <Recharts.YAxis tick={{ fill: 'var(--color-text-dim)', fontSize: 9, fontWeight: 700 }} tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val} />
                                    <Recharts.Tooltip />
                                    <Recharts.Area type="monotone" dataKey="members" stroke="#FF0000" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" />
                                </Recharts.AreaChart >
                            </Recharts.ResponsiveContainer >
                        </div >
                    </div >

                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Branch Performance</h3>
                        </div>
                        <div className="sa-table-container">
                            <table className="sa-table">
                                <thead>
                                    <tr>
                                        <th>Branch Name</th>
                                        <th>Total Members</th>
                                        <th>Today Check-ins</th>
                                        <th>Revenue (LKR)</th>
                                        <th style={{ textAlign: 'center' }}>Equipment Issues</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { branch: 'Colombo City Gym', members: 450, checkins: 120, revenue: '1.2M', issues: 3 },
                                        { branch: 'Kandy Fitness Center', members: 320, checkins: 85, revenue: '850K', issues: 1 },
                                        { branch: 'Galle Power Hub', members: 210, checkins: 45, revenue: '450K', issues: 0 },
                                        { branch: 'Negombo Fitness', members: 180, checkins: 30, revenue: '380K', issues: 2 },
                                    ].map((row, idx) => (
                                        <tr key={idx}>
                                            <td style={{ fontWeight: 700 }}>{row.branch}</td>
                                            <td>{row.members}</td>
                                            <td>{row.checkins}</td>
                                            <td style={{ color: '#10B981', fontWeight: 600 }}>{row.revenue}</td>
                                            <td style={{ color: row.issues > 0 ? '#EF4444' : '#10B981', textAlign: 'center', fontWeight: 600 }}>{row.issues}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                <aside className="sa-sidebar-col">
                    <MiniCalendar />
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertCircle size={20} color="var(--color-red)" />
                                <h3>Branch Alerts</h3>
                            </div>
                        </div>
                        <div className="alerts-stack">
                            <div className="alert-item-branch">
                                <AlertCircle size={20} color="#EF4444" />
                                <div>
                                    <span>3 Assets Need Repair</span>
                                    <p>Dismantle requests pending</p>
                                </div>
                            </div>
                            <div className="alert-item-branch warning">
                                <ShieldCheck size={20} color="#F59E0B" />
                                <div>
                                    <span>14 Fees Overdue</span>
                                    <p>Follow up required</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div >

            <section className="sa-card" style={{ marginTop: '32px' }}>
                <div className="sa-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Activity size={24} color="#FF0000" />
                        <h3>Real-time Event Log</h3>
                    </div>
                    <button className="sa-view-more-btn" onClick={() => { setActiveTab('activity-logs'); navigate('/dashboard'); }}>View More</button>
                </div>
                <ActivityLog activities={filteredActivities} searchQuery={searchQuery} />
            </section>
        </div>
    );
};

export default SuperAdminDashboard;
