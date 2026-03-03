import React, { useMemo, useState, useEffect } from 'react'; // v1.0.1 force fresh reload
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Users,
    UserPlus,
    DollarSign,
    CreditCard,
    TrendingUp,
    AlertCircle,
    Plus,
    Bell,
    Search,
    ShieldCheck,
    Clock,
    Activity,
    ArrowUpRight,
    Building2,
    ChevronRight,
    Zap,
    Briefcase,
    Loader2,
    Calendar
} from 'lucide-react';
import * as Recharts from 'recharts';

import '../../style/SuperAdminDashboard.css';

const MiniCalendar = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const today = now.getDate();

    const monthName = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="mini-calendar">
            <div className="cal-header">
                <span className="cal-month">{monthName} {year}</span>
                <Calendar size={18} color="var(--color-red)" />
            </div>
            <div className="cal-grid">
                {days.map(d => <div key={d} className="cal-day-label">{d}</div>)}
                {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                    const d = i + 1;
                    return (
                        <div
                            key={d}
                            className={`cal-date ${d === today ? 'active' : ''}`}
                        >
                            {d}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SuperAdminDashboard = ({ adminName = "Super Admin" }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState(location.state?.initialSearch || '');
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const response = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
        // Refresh stats every 30 seconds for "live" feel
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const memberGrowthData = useMemo(() => stats?.memberGrowth || [
        { name: 'Feb 01', members: 400 },
        { name: 'Feb 07', members: 600 },
        { name: 'Feb 14', members: 800 },
        { name: 'Feb 21', members: 1250 },
        { name: 'Feb 28', members: 1540 },
    ], [stats]);

    const revenueData = useMemo(() => stats?.revenueTrend || [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 48000 },
        { month: 'Apr', revenue: 61000 },
        { month: 'May', revenue: 55000 },
        { month: 'Jun', revenue: 67000 },
    ], [stats]);

    const gymRatioData = useMemo(() => [
        { name: 'AC Gyms', value: stats?.acGyms || 45 },
        { name: 'Non-AC Gyms', value: stats?.nonAcGyms || 30 },
    ], [stats]);

    const COLORS = ['#FF0000', '#374151'];

    const recentActivities = useMemo(() => {
        if (!stats?.recentActivities) return [
            { id: 1, user: 'Harshana Perera', action: 'Registered at High Level Road Gym', time: '10 mins ago', icon: <UserPlus size={18} /> },
            { id: 2, user: 'Nimal Sirisena', action: 'Renewed Platinum Membership', time: '25 mins ago', icon: <Zap size={18} /> },
            { id: 3, user: 'Gym #04', action: 'Monthly maintenance payment completed', time: '1 hr ago', icon: <CreditCard size={18} /> },
            { id: 4, user: 'System', action: 'New Gym Partnership Proposal: Kandy Central', time: '3 hrs ago', icon: <Building2 size={18} /> },
            { id: 5, user: 'Sanduni Fernando', action: 'Joined via Mobile App', time: '5 hrs ago', icon: <UserPlus size={18} /> },
        ];
        return stats.recentActivities.map((act, idx) => ({
            ...act,
            icon: act.action.includes('session') ? <Activity size={18} /> : <Zap size={18} />,
            time: new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
    }, [stats]);

    const alerts = [
        { id: 1, title: '12 Memberships Expiring', type: 'warning', desc: 'Action required within 48 hours' },
        { id: 2, title: 'Failed Payment (Gym #08)', type: 'error', desc: 'Automatic retry in progress' },
        { id: 3, title: 'Inactive Gym: Rathnapura', type: 'warning', desc: 'No activity for 5 consecutive days' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/super-admin/owners', { state: { initialSearch: searchQuery } });
        }
    };

    const filteredActivities = useMemo(() => {
        if (!searchQuery.trim()) return recentActivities;
        const q = searchQuery.toLowerCase();
        return recentActivities.filter(act =>
            act.user.toLowerCase().includes(q) ||
            act.action.toLowerCase().includes(q)
        );
    }, [recentActivities, searchQuery]);

    if (isLoading && !stats) {
        return (
            <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <Loader2 className="animate-spin" size={48} color="var(--color-red)" />
                <span style={{ fontWeight: 800, color: 'var(--color-text-dim)', letterSpacing: '0.1em' }}>INITIALIZING LIVE COMMAND CENTER...</span>
            </div>
        );
    }

    return (
        <div className="super-admin-dashboard">
            <header className="sa-header">
                <div className="sa-welcome">
                    <h1><span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>Admin</span> Dashboard</h1>
                    <p>Hello, <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>{adminName}</span></p>
                </div>

                <div className="sa-actions">
                    <div className="sa-header-btns">
                        <button className="sa-primary-red-btn" onClick={() => navigate('/super-admin/owners', { state: { openModal: true } })}>
                            <UserPlus size={24} />
                            <div className="sa-btn-text-stack">
                                <span className="sa-btn-sub">Add New</span>
                                <span className="sa-btn-main">Manager</span>
                            </div>
                        </button>
                        <button className="sa-secondary-btn" onClick={() => navigate('/super-admin/locations', { state: { openModal: true } })}>
                            <Building2 size={24} color="var(--color-red)" />
                            <div className="sa-btn-text-stack">
                                <span className="sa-btn-sub" style={{ color: 'var(--color-text-dim)' }}>Add New</span>
                                <span className="sa-btn-main" style={{ color: 'var(--color-text)' }}>Branch</span>
                            </div>
                        </button>
                    </div>
                    <div className="sa-search-bar">
                        <Search className="sa-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search Members, Managers, Branches..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <section className="sa-summary-grid">
                <div className="sa-stat-card primary">
                    <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000' }}>
                        <Users />
                    </div>
                    <div>
                        <span className="label">Total Members</span>
                        <h2 className="value">{stats?.totalMembers?.toLocaleString() || '0'}</h2>
                    </div>
                    <span className="trend up"><ArrowUpRight size={14} /> +12% growth</span>
                </div>

                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                        <ShieldCheck />
                    </div>
                    <div>
                        <span className="label">Active Members</span>
                        <h2 className="value">{stats?.activeMembers?.toLocaleString() || '0'}</h2>
                    </div>
                    <span className="trend up"><ArrowUpRight size={14} /> {((stats?.activeMembers / stats?.totalMembers) * 100).toFixed(1)}% active</span>
                </div>

                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        <UserPlus />
                    </div>
                    <div>
                        <span className="label">New Members</span>
                        <h2 className="value">{stats?.newMembersToday || '0'}</h2>
                    </div>
                    <span className="trend up"><ArrowUpRight size={14} /> Daily Peak Hit</span>
                </div>

                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                        <Building2 />
                    </div>
                    <div>
                        <span className="label">Active Gyms</span>
                        <h2 className="value">{stats?.activeGyms || '0'}</h2>
                    </div>
                    <span className="trend" style={{ color: 'var(--color-text-dim)' }}>{stats?.acGyms} AC • {stats?.nonAcGyms} NAC</span>
                </div>

                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
                        <DollarSign />
                    </div>
                    <div>
                        <span className="label">Monthly Revenue</span>
                        <h2 className="value">LKR {(stats?.monthlyRevenue / 1000000).toFixed(1)}M</h2>
                    </div>
                    <span className="trend up"><ArrowUpRight size={14} /> Target: 105%</span>
                </div>

                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000' }}>
                        <CreditCard />
                    </div>
                    <div>
                        <span className="label">Pending Payments</span>
                        <h2 className="value">LKR {(stats?.pendingPayments / 1000).toFixed(0)}K</h2>
                    </div>
                    <span className="trend down">Overdue: 04</span>
                </div>
            </section>

            <div className="sa-dashboard-layout">
                <main className="sa-analytics-col">
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <TrendingUp size={22} color="#FF0000" />
                                <h3>Network Expansion</h3>
                            </div>
                            <div className="sa-card-meta">
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-red)' }}>LIVE TRACKING</span>
                            </div>
                        </div>
                        <div style={{ height: '300px', width: '100%' }}>
                            <Recharts.ResponsiveContainer width="100%" height="100%">
                                <Recharts.AreaChart data={memberGrowthData}>
                                    <defs>
                                        <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF0000" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <Recharts.XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-dim)', fontSize: 10, fontWeight: 700 }} dy={10} />
                                    <Recharts.YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-dim)', fontSize: 10, fontWeight: 700 }} dx={-10} />
                                    <Recharts.Tooltip
                                        contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#FF0000', fontWeight: 800 }}
                                    />
                                    <Recharts.Area type="monotone" dataKey="members" stroke="#FF0000" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" animationDuration={1800} />
                                </Recharts.AreaChart>
                            </Recharts.ResponsiveContainer>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        <div className="sa-card">
                            <div className="sa-card-header">
                                <h3>Revenue Stream</h3>
                            </div>
                            <div style={{ height: '200px', width: '100%' }}>
                                <Recharts.ResponsiveContainer width="100%" height="100%">
                                    <Recharts.BarChart data={revenueData}>
                                        <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <Recharts.XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-dim)', fontSize: 10, fontWeight: 700 }} />
                                        <Recharts.Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px' }} />
                                        <Recharts.Bar dataKey="revenue" fill="#FF0000" radius={[4, 4, 0, 0]} />
                                    </Recharts.BarChart>
                                </Recharts.ResponsiveContainer>
                            </div>
                        </div>

                        <div className="sa-card">
                            <div className="sa-card-header">
                                <h3>Gym Distribution</h3>
                            </div>
                            <div style={{ height: '200px', width: '100%' }}>
                                <Recharts.ResponsiveContainer width="100%" height="100%">
                                    <Recharts.PieChart>
                                        <Recharts.Pie
                                            data={gymRatioData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {gymRatioData.map((entry, index) => (
                                                <Recharts.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Recharts.Pie>
                                        <Recharts.Tooltip contentStyle={{ borderRadius: '12px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }} />
                                    </Recharts.PieChart>
                                </Recharts.ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </main>

                <aside className="sa-sidebar-col">
                    <MiniCalendar />

                    <div className="sa-card">
                        <div className="sa-card-header" style={{ marginBottom: '20px' }}>
                            <h3>Quick Terminal</h3>
                        </div>
                        <div className="sa-quick-actions">
                            <button className="sa-action-btn" onClick={() => navigate('/super-admin/owners')}><UserPlus /> Add Staff</button>
                            <button className="sa-action-btn" onClick={() => navigate('/super-admin/locations')}><Building2 /> Add Branch</button>
                            <button className="sa-action-btn"><Briefcase /> Plans</button>
                            <button className="sa-action-btn"><Bell /> Notify</button>
                        </div>
                    </div>

                    <div className="sa-card">
                        <div className="sa-card-header" style={{ marginBottom: '20px' }}>
                            <h3>System Alerts</h3>
                        </div>
                        <div className="sa-alerts-list">
                            {alerts.map(alert => (
                                <div key={alert.id} className={`sa-alert-item ${alert.type}`}>
                                    <AlertCircle size={20} color={alert.type === 'error' ? '#FF0000' : '#F59E0B'} />
                                    <div className="sa-alert-content">
                                        <span className="sa-alert-text">{alert.title}</span>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{alert.desc}</p>
                                    </div>
                                    <ChevronRight size={14} color="var(--color-text-dim)" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sa-system-status">
                        <div className="status-indicator">
                            <div className="status-dot"></div>
                            <span>Engine: Synchronized</span>
                        </div>
                    </div>
                </aside>
            </div>

            <section className="sa-card" style={{ marginTop: '32px' }}>
                <div className="sa-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Activity size={24} color="#FF0000" />
                        <h3>Real-time Event Log</h3>
                    </div>
                    <button className="view-all-link-top" onClick={() => navigate('/super-admin/activity-logs')}>Deep Audit</button>
                </div>

                <div className="sa-activity-feed">
                    {filteredActivities.length > 0 ? (
                        filteredActivities.map(activity => (
                            <div key={activity.id} className="sa-activity-item">
                                <div className="sa-activity-icon">
                                    {activity.icon}
                                </div>
                                <div className="sa-activity-info">
                                    <p><strong>{activity.user}</strong> {activity.action}</p>
                                    <span>{activity.time}</span>
                                </div>
                                <div className="activity-status-chip">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-dim)', fontWeight: 600 }}>
                            No events found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SuperAdminDashboard;
