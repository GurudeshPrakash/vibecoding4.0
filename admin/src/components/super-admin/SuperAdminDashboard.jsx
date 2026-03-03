import React, { useMemo, useState, useEffect } from 'react'; // v1.0.1 force fresh reload
import { useNavigate } from 'react-router-dom';
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
    ChevronLeft,
    ChevronDown,
    Zap,
    Briefcase,
    Loader2,
    Calendar,
    ClipboardList
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';

import '../../style/SuperAdminDashboard.css';

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

const MiniCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const [isYearEditable, setIsYearEditable] = useState(false);
    const [yearInput, setYearInput] = useState('');
    const [activeArrow, setActiveArrow] = useState(null);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNum = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleYearDoubleClick = () => {
        setYearInput(year.toString());
        setIsYearEditable(true);
    };

    const handleYearChange = (e) => {
        setYearInput(e.target.value);
    };

    const handleYearBlur = () => {
        setIsYearEditable(false);
        const parsedYear = parseInt(yearInput, 10);
        if (!isNaN(parsedYear)) {
            setCurrentDate(new Date(parsedYear, currentDate.getMonth(), 1));
        }
    };

    const handleYearKeyDown = (e) => {
        if (e.key === 'Enter') handleYearBlur();
    };

    const handleDateDoubleClick = (d) => {
        alert("Add Reminder interaction / UI opening for date: " + d);
    };

    return (
        <div className="mini-calendar">
            <div className="cal-header">
                {/* Month Group */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <ChevronLeft
                        size={16}
                        color={activeArrow === 'prev' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer', transition: 'color 0.1s' }}
                        onMouseDown={() => setActiveArrow('prev')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={() => setCurrentDate(new Date(year, monthNum - 1, 1))}
                    />
                    <div
                        className="cal-month-box"
                        onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'var(--color-red)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            minWidth: '70px',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(255, 0, 0, 0.15)'
                        }}
                    >
                        <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#FFFFFF', textTransform: 'uppercase' }}>
                            {monthNames[monthNum].slice(0, 3)}
                        </span>
                        <ChevronDown size={14} color="#FFFFFF" />

                        {isMonthDropdownOpen && (
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 5px)', left: 0,
                                background: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100,
                                maxHeight: '180px', overflowY: 'auto', minWidth: '120px',
                                padding: '6px 0'
                            }}>
                                {monthNames.map((m, idx) => (
                                    <div
                                        key={m}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentDate(new Date(year, idx, 1));
                                            setIsMonthDropdownOpen(false);
                                        }}
                                        style={{
                                            padding: '10px 16px', fontSize: '0.8rem', cursor: 'pointer',
                                            color: idx === monthNum ? 'var(--color-red)' : '#333',
                                            fontWeight: idx === monthNum ? 700 : 500
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        {m}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <ChevronRight
                        size={16}
                        color={activeArrow === 'next' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer', transition: 'color 0.1s' }}
                        onMouseDown={() => setActiveArrow('next')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={() => setCurrentDate(new Date(year, monthNum + 1, 1))}
                    />
                </div>

                {/* Year Group */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <ChevronLeft
                        size={16}
                        color={activeArrow === 'year-prev' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer' }}
                        onMouseDown={() => setActiveArrow('year-prev')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={() => setCurrentDate(new Date(year - 1, monthNum, 1))}
                    />
                    <div
                        className="cal-year-box"
                        onDoubleClick={handleYearDoubleClick}
                        style={{
                            background: 'var(--color-red)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            minWidth: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(255, 0, 0, 0.15)'
                        }}
                    >
                        {isYearEditable ? (
                            <input
                                type="text"
                                value={yearInput}
                                onChange={handleYearChange}
                                onBlur={handleYearBlur}
                                onKeyDown={handleYearKeyDown}
                                autoFocus
                                style={{ width: '40px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', padding: 0, textAlign: 'center' }}
                            />
                        ) : (
                            <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#FFFFFF' }}>{year}</span>
                        )}
                    </div>
                    <ChevronRight
                        size={16}
                        color={activeArrow === 'year-next' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer' }}
                        onMouseDown={() => setActiveArrow('year-next')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={() => setCurrentDate(new Date(year + 1, monthNum, 1))}
                    />
                </div>
            </div>
            <div className="cal-grid">
                {days.map((d, i) => <div key={`day-${i}`} className="cal-day-label">{d}</div>)}
                {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                    const d = i + 1;
                    const today = new Date();
                    const isToday = today.getDate() === d && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
                    return (
                        <div
                            key={d}
                            className={`cal-date ${isToday ? 'active' : ''}`}
                            onDoubleClick={() => handleDateDoubleClick(d)}
                            style={{ cursor: 'pointer' }}
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
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState(() => {
        const raw = localStorage.getItem('sa_live_mock_database');
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch (e) {
                return {
                    totalMembers: 0,
                    activeMembers: 0,
                    newMembersToday: 0,
                    activeGyms: 0,
                    acGyms: 0,
                    nonAcGyms: 0,
                    monthlyRevenue: 0,
                    pendingPayments: 0,
                    revenueTrend: [],
                    memberGrowth: [],
                    recentActivities: []
                };
            }
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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchLiveStats = () => {
            const raw = localStorage.getItem('sa_live_mock_database');
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    // Ensure we always have 12-month revenue-based format as requested
                    if (parsed.memberGrowth && parsed.memberGrowth.length !== 12) {
                        parsed.memberGrowth = stats.memberGrowth;
                    }
                    setStats(parsed);
                } catch (e) { }
            } else {
                localStorage.setItem('sa_live_mock_database', JSON.stringify(stats));
            }
        };
        fetchLiveStats();

        // Fast polling for instant true "LIVE" graph reflection across windows
        const LIVE_INTERVAL = setInterval(fetchLiveStats, 300);

        // Fluctuation effect for the "LIVE" look
        const FLUCTUATION_INTERVAL = setInterval(() => {
            setStats(prev => {
                if (!prev.memberGrowth) return prev;
                const newGrowth = [...prev.memberGrowth];
                const lastIdx = newGrowth.length - 1;
                // Add/subtract a small random amount (max 0.5%) to the last data point
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

    const memberGrowthData = stats.memberGrowth;
    const revenueData = stats.revenueTrend;
    const gymRatioData = [
        { name: 'AC Gyms', value: stats.acGyms },
        { name: 'Non-AC Gyms', value: stats.nonAcGyms },
    ];
    const COLORS = ['#FF0000', '#374151'];

    const recentActivities = stats.recentActivities.map((act, idx) => ({
        ...act,
        icon: act.action && act.action.includes('session') ? <Activity size={18} /> : <Zap size={18} />,
        time: act.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

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


    return (
        <div className="super-admin-dashboard">
            <header className="sa-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="sa-welcome" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                    <h1 style={{ margin: 0, padding: 0 }}>Admin Dashboard</h1>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>Monitor and manage your entire gym system.</p>
                </div>

                <div className="sa-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '100%' }}>
                    <button className="add-admin-btn" style={{ background: '#ff0000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(255,0,0,0.2)' }}>
                        <UserPlus size={20} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.2 }}>
                            <span>Add</span>
                            <span>Admin</span>
                        </div>
                    </button>

                    <button className="add-branch-btn" style={{ background: '#f8f9fa', color: '#000', border: '1px solid #e0e0e0', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <Building2 size={20} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.2 }}>
                            <span>Add</span>
                            <span>Branch</span>
                        </div>
                    </button>

                    <form className="sa-search-bar" onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', borderRadius: '12px', padding: '0 16px', border: '1px solid #e0e0e0', height: '44px', width: '280px' }}>
                        <Search className="sa-search-icon" size={18} color="#888" style={{ marginRight: '12px' }} />
                        <div style={{ height: '22px', width: '1px', background: '#d1d5db', marginRight: '12px' }}></div>
                        <input
                            type="text"
                            placeholder="Search Members or Gyms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', fontWeight: 500, color: '#333' }}
                        />
                    </form>
                </div>
            </header>

            <section className="sa-summary-grid">
                <div className="sa-stat-card primary" onClick={() => navigate('/super-admin/owners')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000', margin: 0 }}>
                            <Users />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Total Members</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{stats?.totalMembers?.toLocaleString() || '1,240'}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card" onClick={() => navigate('/super-admin/owners')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', margin: 0 }}>
                            <ShieldCheck />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Active Members</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{stats?.activeMembers?.toLocaleString() || '1,192'}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card" onClick={() => navigate('/super-admin/admins')} style={{ cursor: 'pointer', borderLeft: '3px solid var(--color-red)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', margin: 0 }}>
                            <ShieldCheck />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>System Admins</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>05</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card" onClick={() => navigate('/super-admin/locations')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', margin: 0 }}>
                            <Building2 />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Active Branches</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{stats?.activeGyms || '12'}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', margin: 0 }}>
                            <DollarSign />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Monthly Revenue</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>LKR {(stats?.monthlyRevenue / 1000000).toFixed(1)}M</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000', margin: 0 }}>
                            <CreditCard />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Pending Payments</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>LKR {(stats?.pendingPayments / 1000).toFixed(0)}K</h2>
                        </div>
                    </div>
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
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-red)' }}>LIVE TRACKING</span>
                            </div>
                        </div>
                        <div style={{ height: '240px', minHeight: '240px', width: '100%', marginTop: '10px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={memberGrowthData}>
                                    <defs>
                                        <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF0000" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
                                        tickLine={false}
                                        tick={{ fill: 'var(--color-text-dim)', fontSize: 9, fontWeight: 700 }}
                                        dy={10}
                                        interval={0}
                                    />
                                    <YAxis
                                        axisLine={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
                                        tickLine={false}
                                        tick={{ fill: 'var(--color-text-dim)', fontSize: 9, fontWeight: 700 }}
                                        dx={-10}
                                        domain={[0, 'auto']}
                                        allowDecimals={false}
                                        tickFormatter={(value) => {
                                            if (value >= 1000000) return `LKR ${(value / 1000000).toFixed(1)}M`;
                                            if (value >= 1000) return `LKR ${(value / 1000).toFixed(0)}K`;
                                            return `LKR ${value}`;
                                        }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#FF0000', fontWeight: 800 }}
                                    />
                                    <Area type="monotone" dataKey="members" stroke="#FF0000" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" animationDuration={1800} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Removed Revenue Stream and Gym Distribution */}
                </main>

                <aside className="sa-sidebar-col">
                    <MiniCalendar />

                    <div className="sa-card" style={{ height: 'auto', minHeight: 'unset' }}>
                        <div className="sa-card-header" style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Zap size={20} color="#FF0000" />
                                <h3 style={{ fontSize: '1rem' }}>Quick Terminal</h3>
                            </div>
                        </div>
                        <div className="sa-quick-actions">
                            <button className="sa-action-btn" onClick={() => navigate('/super-admin/admins')}>
                                <ShieldCheck />
                                <span>Admins</span>
                            </button>
                            <button className="sa-action-btn" onClick={() => navigate('/super-admin/owners')}>
                                <Users />
                                <span>Managers</span>
                            </button>
                            <button className="sa-action-btn" onClick={() => navigate('/super-admin/locations')}>
                                <Building2 />
                                <span>Locations</span>
                            </button>
                            <button className="sa-action-btn" onClick={() => navigate('/super-admin/activity-logs')}>
                                <ClipboardList />
                                <span>Logs</span>
                            </button>
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
                    <button className="sa-view-more-btn" style={{ background: 'var(--color-red)', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/super-admin/activity-logs')}>View More</button>
                </div>

                <div className="sa-activity-feed" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '8px' }}>
                    {recentActivities.map(activity => (
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
                    ))}
                </div>
            </section>
        </div>
    );
};

export default SuperAdminDashboard;
