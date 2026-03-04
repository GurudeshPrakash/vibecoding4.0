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
<<<<<<< HEAD
    ChevronLeft,
    ChevronDown,
    Zap,
    Briefcase,
    Loader2,
    Calendar,
    ClipboardList
=======
    Zap,
    Briefcase,
    Loader2,
    Calendar
>>>>>>> main
} from 'lucide-react';
import * as Recharts from 'recharts';

import '../../style/SuperAdminDashboard.css';

<<<<<<< HEAD
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
=======
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
>>>>>>> main
                        >
                            {d}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

<<<<<<< HEAD
const SuperAdminDashboard = ({ adminName = "Super Admin", setActiveTab }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState(location.state?.initialSearch || '');
    const [statsState, setStatsState] = useState(() => {
        const raw = localStorage.getItem('sa_live_mock_database');
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch (e) {
                // Ignore
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
                        parsed.memberGrowth = statsState.memberGrowth;
                    }
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

    const memberGrowthData = statsState.memberGrowth;
    const revenueData = statsState.revenueTrend;
    const gymRatioData = [
        { name: 'AC Gyms', value: statsState.acGyms },
        { name: 'Non-AC Gyms', value: statsState.nonAcGyms },
    ];
    const COLORS = ['#FF0000', '#374151'];

    const recentActivities = statsState.recentActivities.map((act, idx) => ({
        ...act,
        icon: act.action && act.action.includes('session') ? <Activity size={18} /> : <Zap size={18} />,
        time: act.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
=======
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
>>>>>>> main

    const filteredActivities = useMemo(() => {
        if (!searchQuery.trim()) return recentActivities;
        const q = searchQuery.toLowerCase();
        return recentActivities.filter(act =>
            act.user.toLowerCase().includes(q) ||
            act.action.toLowerCase().includes(q)
        );
    }, [recentActivities, searchQuery]);

<<<<<<< HEAD
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/super-admin/owners', { state: { initialSearch: searchQuery } });
        }
    };

    if (isLoading && !statsState) {
=======
    if (isLoading && !stats) {
>>>>>>> main
        return (
            <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <Loader2 className="animate-spin" size={48} color="var(--color-red)" />
                <span style={{ fontWeight: 800, color: 'var(--color-text-dim)', letterSpacing: '0.1em' }}>INITIALIZING LIVE COMMAND CENTER...</span>
            </div>
        );
    }

    return (
        <div className="super-admin-dashboard">
<<<<<<< HEAD
            <header className="sa-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div className="sa-welcome" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="admin-greeting-inline" style={{ marginBottom: '6px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ef4444' }}>Hello, </span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a' }}>{adminName}</span>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Admin Dashboard</h1>
                </div>

                <div className="sa-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        className="add-admin-btn"
                        onClick={() => navigate('/super-admin/owners', { state: { openModal: true } })}
                        style={{ background: '#ff0000', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(255,0,0,0.25)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(255,0,0,0.35)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,0,0,0.25)'; }}
                    >
                        <UserPlus size={24} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '0.8rem', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <span style={{ opacity: 0.85 }}>Add New</span>
                            <span>Manager</span>
                        </div>
                    </button>

                    <button
                        className="add-branch-btn"
                        onClick={() => navigate('/super-admin/locations', { state: { openModal: true } })}
                        style={{ background: '#fff', color: '#ff0000', border: '2px solid #ff0000', padding: '10px 28px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.12)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
                    >
                        <Building2 size={24} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '0.8rem', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <span style={{ color: '#666', opacity: 0.7 }}>Add New</span>
                            <span>Branch</span>
                        </div>
                    </button>

                    <form className="sa-search-bar" onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: '16px', padding: '0 20px', border: '1px solid #E5E7EB', height: '54px', width: '340px', transition: 'all 0.3s ease' }}>
                        <Search className="sa-search-icon" size={22} color="#9CA3AF" style={{ marginRight: '14px' }} />
                        <div style={{ height: '28px', width: '1px', background: '#D1D5DB', marginRight: '18px' }}></div>
=======
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
>>>>>>> main
                        <input
                            type="text"
                            placeholder="Search Members, Managers, Branches..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
<<<<<<< HEAD
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '1rem', fontWeight: 700, color: '#111827' }}
                        />
                    </form>
=======
                        />
                    </div>
>>>>>>> main
                </div>
            </header>

            <section className="sa-summary-grid">
<<<<<<< HEAD
                <div className="sa-stat-card primary" onClick={() => { setActiveTab('managers'); navigate('/dashboard'); }} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000', margin: 0 }}>
                            <Users />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Total Members</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{statsState?.totalMembers?.toLocaleString() || '1,240'}</h2>
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
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{statsState?.activeMembers?.toLocaleString() || '1,192'}</h2>
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
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{statsState?.activeGyms || '12'}</h2>
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
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>LKR {(statsState?.monthlyRevenue / 1000000).toFixed(1)}M</h2>
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
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>LKR {(statsState?.pendingPayments / 1000).toFixed(0)}K</h2>
                        </div>
                    </div>
=======
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
>>>>>>> main
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
<<<<<<< HEAD
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-red)' }}>LIVE TRACKING</span>
                            </div>
                        </div>
                        <div style={{ height: '240px', minHeight: '240px', width: '100%', marginTop: '10px' }}>
                            <Recharts.ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
=======
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-red)' }}>LIVE TRACKING</span>
                            </div>
                        </div>
                        <div style={{ height: '300px', width: '100%' }}>
                            <Recharts.ResponsiveContainer width="100%" height="100%">
>>>>>>> main
                                <Recharts.AreaChart data={memberGrowthData}>
                                    <defs>
                                        <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF0000" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
<<<<<<< HEAD
                                    <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                    <Recharts.XAxis
                                        dataKey="name"
                                        axisLine={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
                                        tickLine={false}
                                        tick={{ fill: 'var(--color-text-dim)', fontSize: 9, fontWeight: 700 }}
                                        dy={10}
                                        interval={0}
                                    />
                                    <Recharts.YAxis
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
=======
                                    <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <Recharts.XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-dim)', fontSize: 10, fontWeight: 700 }} dy={10} />
                                    <Recharts.YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-dim)', fontSize: 10, fontWeight: 700 }} dx={-10} />
>>>>>>> main
                                    <Recharts.Tooltip
                                        contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#FF0000', fontWeight: 800 }}
                                    />
                                    <Recharts.Area type="monotone" dataKey="members" stroke="#FF0000" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" animationDuration={1800} />
<<<<<<< HEAD
                                </Recharts.AreaChart >
                            </Recharts.ResponsiveContainer >
                        </div >
                    </div >
=======
                                </Recharts.AreaChart>
                            </Recharts.ResponsiveContainer>
                        </div>
                    </div>
>>>>>>> main

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

<<<<<<< HEAD
                    <div className="sa-card" style={{ background: '#111827', color: '#fff', padding: '0', overflow: 'hidden' }}>
                        <div className="sa-card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Zap size={20} color="#FF0000" />
                                <h3 style={{ fontSize: '1rem' }}>Quick Terminal</h3>
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
            </div >
=======
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
>>>>>>> main

            <section className="sa-card" style={{ marginTop: '32px' }}>
                <div className="sa-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Activity size={24} color="#FF0000" />
                        <h3>Real-time Event Log</h3>
                    </div>
<<<<<<< HEAD
                    <button className="sa-view-more-btn" style={{ background: 'var(--color-red)', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => { setActiveTab('activity-logs'); navigate('/dashboard'); }}>View More</button>
                </div>

                <div className="sa-activity-feed" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '8px' }}>
=======
                    <button className="view-all-link-top" onClick={() => navigate('/super-admin/activity-logs')}>Deep Audit</button>
                </div>

                <div className="sa-activity-feed">
>>>>>>> main
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
