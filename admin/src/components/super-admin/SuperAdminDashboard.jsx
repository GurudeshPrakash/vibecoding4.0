import React, { useMemo, useState, useEffect } from 'react';
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
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Zap,
    Briefcase,
    Loader2,
    Calendar,
    ClipboardList
} from 'lucide-react';
import * as Recharts from 'recharts';

import '../../style/SuperAdminDashboard.css';

const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '0.05em' }}>
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
        const clickedDate = new Date(year, monthNum, d);
        alert(`Add Reminder for ${clickedDate.toDateString()}`);
    };

    return (
        <div className="mini-calendar" onClick={() => setIsMonthDropdownOpen(false)}>
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
                        onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(year, monthNum - 1, 1)); }}
                    />
                    <div
                        className="cal-month-box"
                        onClick={(e) => { e.stopPropagation(); setIsMonthDropdownOpen(!isMonthDropdownOpen); }}
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
                        <span style={{ fontWeight: 800, fontSize: '0.65rem', color: '#FFFFFF', textTransform: 'uppercase' }}>
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
                                            padding: '10px 16px', fontSize: '0.72rem', cursor: 'pointer',
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
                        onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(year, monthNum + 1, 1)); }}
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
                        onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(year - 1, monthNum, 1)); }}
                    />
                    <div
                        className="cal-year-box"
                        onDoubleClick={(e) => { e.stopPropagation(); handleYearDoubleClick(); }}
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
                                style={{ width: '40px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.7rem', fontWeight: 800, color: '#FFFFFF', padding: 0, textAlign: 'center' }}
                            />
                        ) : (
                            <span style={{ fontWeight: 800, fontSize: '0.7rem', color: '#FFFFFF' }}>{year}</span>
                        )}
                    </div>
                    <ChevronRight
                        size={16}
                        color={activeArrow === 'year-next' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer' }}
                        onMouseDown={() => setActiveArrow('year-next')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(year + 1, monthNum, 1)); }}
                    />
                </div>
            </div>
            <div className="cal-grid">
                {days.map((d, i) => <div key={`day-${i}`} className="cal-day-label">{d}</div>)}
                {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                    const d = i + 1;
                    const today = new Date();
                    const isToday = today.getDate() === d && today.getMonth() === monthNum && today.getFullYear() === year;
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

const CustomChartTooltip = ({ active, payload, label, color = '#FF0000', prefix = '' }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: color,
                color: '#FFFFFF',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '800',
                boxShadow: `0 8px 20px ${color}88`,
                border: 'none',
                textAlign: 'center',
                lineHeight: '1.3'
            }}>
                <div style={{ fontSize: '0.65rem', opacity: 0.9, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ letterSpacing: '0.02em' }}>{prefix}{payload[0].value.toLocaleString()}</div>
            </div>
        );
    }
    return null;
};

const SuperAdminDashboard = ({ adminName = "Super Admin", setActiveTab }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState(location.state?.initialSearch || '');
    const [stats, setStats] = useState(() => {
        const raw = localStorage.getItem('sa_live_mock_database');
        if (raw) {
            try { return JSON.parse(raw); } catch (e) { }
        }
        return {
            totalMembers: 12450,
            activeMembers: 11920,
            newMembersToday: 48,
            activeGyms: 12,
            acGyms: 8,
            nonAcGyms: 4,
            monthlyRevenue: 2450000,
            pendingPayments: 45000,
            revenueTrend: [
                { month: 'Jan', revenue: 1800000 },
                { month: 'Feb', revenue: 2100000 },
                { month: 'Mar', revenue: 1950000 },
                { month: 'Apr', revenue: 2300000 },
                { month: 'May', revenue: 2450000 },
                { month: 'Jun', revenue: 2800000 },
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
            recentActivities: [
                { id: 1, user: 'Malith Perera', action: 'started a new workout session at Colombo 03', time: '10:45 AM' },
                { id: 2, user: 'System', action: 'auto-scaled database for peak hour traffic', time: '10:30 AM' },
                { id: 3, user: 'Gym #08', action: 'reported a maintenance request (AC Unit)', time: '10:15 AM' },
                { id: 4, user: 'Sarah J.', action: 'renewed Platinum Membership', time: '09:50 AM' },
                { id: 5, user: 'Kasun D.', action: 'completed payment for Personal Training', time: '09:30 AM' }
            ]
        };
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchLiveStats = () => {
            const raw = localStorage.getItem('sa_live_mock_database');
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    setStats(parsed);
                } catch (e) { }
            } else {
                localStorage.setItem('sa_live_mock_database', JSON.stringify(stats));
            }
        };
        fetchLiveStats();

        const LIVE_INTERVAL = setInterval(fetchLiveStats, 300);
        const FLUCTUATION_INTERVAL = setInterval(() => {
            setStats(prev => {
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

    const memberGrowthData = stats.memberGrowth;
    const revenueData = stats.revenueTrend;
    const COLORS = ['#FF0000', '#374151'];

    const recentActivities = stats.recentActivities.map((act, idx) => ({
        ...act,
        icon: act.action && act.action.includes('session') ? <Activity size={18} /> : <Zap size={18} />,
        time: act.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setActiveTab('managers');
            navigate('/dashboard', { state: { initialSearch: searchQuery } });
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

    return (
        <div className="super-admin-dashboard">
            <header className="sa-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="sa-welcome" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                    <h1 style={{ margin: 0, padding: 0, fontSize: '1.2rem' }}>Admin Dashboard</h1>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>Monitor and manage your entire gym system.</p>
                </div>

                <div className="sa-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '100%' }}>
                    <button className="add-admin-btn" style={{ background: '#ff0000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(255,0,0,0.2)' }} onClick={() => { setActiveTab('admins'); navigate('/dashboard', { state: { openModal: true } }); }}>
                        <UserPlus size={20} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '0.75rem', fontWeight: 800, lineHeight: 1.2 }}>
                            <span>Add</span>
                            <span>Admin</span>
                        </div>
                    </button>

                    <button className="add-branch-btn" style={{ background: '#f8f9fa', color: '#000', border: '1px solid #e0e0e0', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} onClick={() => { setActiveTab('locations'); navigate('/dashboard', { state: { openModal: true } }); }}>
                        <Building2 size={20} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '0.75rem', fontWeight: 800, lineHeight: 1.2 }}>
                            <span>Add</span>
                            <span>Branch</span>
                        </div>
                    </button>

                    <form className="sa-search-bar" onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', borderRadius: '12px', padding: '0 16px', border: '1px solid #e0e0e0', height: '44px', width: '280px' }}>
                        <Search className="sa-search-icon" size={18} color="#888" style={{ marginRight: '12px' }} />
                        <div style={{ height: '22px', width: '1px', background: '#d1d5db', marginRight: '12px' }}></div>
                        <input
                            type="text"
                            placeholder="Search Members, Managers, Branches..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.78rem', fontWeight: 500, color: '#333' }}
                        />
                    </form>
                </div>
            </header>

            <section className="sa-summary-grid">
                <div className="sa-stat-card primary" onClick={() => { setActiveTab('managers'); navigate('/dashboard'); }} style={{ cursor: 'pointer' }}>
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

                <div className="sa-stat-card" onClick={() => { setActiveTab('managers'); navigate('/dashboard'); }} style={{ cursor: 'pointer' }}>
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

                <div className="sa-stat-card" onClick={() => { setActiveTab('admins'); navigate('/dashboard'); }} style={{ cursor: 'pointer', borderLeft: '3px solid var(--color-red)' }}>
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

                <div className="sa-stat-card" onClick={() => { setActiveTab('locations'); navigate('/dashboard'); }} style={{ cursor: 'pointer' }}>
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
                </div >

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
                </div >
            </section >

            <div className="sa-dashboard-layout">
                <main className="sa-analytics-col">
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <DollarSign size={22} color="#FF0000" />
                                <h3>Member Growth Hub</h3>
                            </div>
                            <div className="sa-card-meta">
                                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--color-red)' }}>LIVE TRACKING</span>
                            </div>
                        </div>
                        <div style={{ height: '240px', minHeight: '240px', width: '100%', marginTop: '10px' }}>
                            <Recharts.ResponsiveContainer width="100%" height="100%">
                                <Recharts.AreaChart data={memberGrowthData}>
                                    <defs>
                                        <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF0000" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                    <Recharts.XAxis
                                        dataKey="name"
                                        axisLine={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
                                        tickLine={false}
                                        tick={{ fill: 'var(--color-text-dim)', fontSize: 8, fontWeight: 700 }}
                                        dy={10}
                                        interval={0}
                                    />
                                    <Recharts.YAxis
                                        axisLine={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
                                        tickLine={false}
                                        tick={{ fill: 'var(--color-text-dim)', fontSize: 8, fontWeight: 700 }}
                                        dx={-10}
                                        domain={[0, 'auto']}
                                        allowDecimals={false}
                                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                                    />
                                    <Recharts.Tooltip content={<CustomChartTooltip />} />
                                    <Recharts.Area type="monotone" dataKey="members" stroke="#FF0000" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" animationDuration={1800} />
                                </Recharts.AreaChart >
                            </Recharts.ResponsiveContainer >
                        </div >
                    </div >
                </main >

                <aside className="sa-sidebar-col">
                    <MiniCalendar />

                    <div className="sa-card" style={{ background: '#111827', color: '#fff', padding: '0', overflow: 'hidden', marginTop: '20px' }}>
                        <div className="sa-card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Zap size={20} color="#FF0000" />
                                <h3 style={{ fontSize: '0.88rem' }}>Quick Terminal</h3>
                            </div>
                        </div>
                        <div className="sa-quick-actions">
                            <button className="sa-action-btn" onClick={() => { setActiveTab('admins'); navigate('/dashboard'); }}>
                                <ShieldCheck />
                                <span>Admins</span>
                            </button>
                            <button className="sa-action-btn" onClick={() => { setActiveTab('managers'); navigate('/dashboard'); }}>
                                <Users />
                                <span>Managers</span>
                            </button>
                            <button className="sa-action-btn" onClick={() => { setActiveTab('locations'); navigate('/dashboard'); }}>
                                <Building2 />
                                <span>Locations</span>
                            </button>
                            <button className="sa-action-btn" onClick={() => { setActiveTab('activity-logs'); navigate('/dashboard'); }}>
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
                    <button className="sa-view-more-btn" style={{ background: 'var(--color-red)', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => { setActiveTab('activity-logs'); navigate('/dashboard'); }}>View More</button>
                </div>

                <div className="sa-activity-feed" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '8px' }}>
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
