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
    ChevronLeft,
    ChevronDown,
    Zap,
    Briefcase,
    Loader2,
    Calendar,
    ClipboardList
} from 'lucide-react';
import * as Recharts from 'recharts';

import '../styles/SuperAdminDashboard.css';

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

const SuperAdminDashboard = ({ adminName = "Super Admin", setActiveTab, userRole = 'super_admin' }) => {
    const isSuperAdmin = userRole === 'super_admin';
    const isLocked = !isSuperAdmin;
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
            totalBranches: 24,
            totalAdmins: 4,
            totalStaff: 156,
            totalMembers: 4850,
            totalTrainers: 82,
            totalRevenue: 12.5,
            activeMemberships: 4200,
            revenueTrend: [
                { month: 'Jan', revenue: 8.5 },
                { month: 'Feb', revenue: 9.2 },
                { month: 'Mar', revenue: 10.8 },
                { month: 'Apr', revenue: 11.5 },
                { month: 'May', revenue: 12.1 },
                { month: 'Jun', revenue: 12.5 },
            ],
            memberGrowth: [
                { name: 'Jan', members: 3200 },
                { name: 'Feb', members: 3500 },
                { name: 'Mar', members: 3850 },
                { name: 'Apr', members: 4100 },
                { name: 'May', members: 4450 },
                { name: 'Jun', members: 4850 },
            ],
            branchPerformance: [
                { name: 'Colombo 07', performance: 95 },
                { name: 'Kandy Central', performance: 88 },
                { name: 'Galle Fort', performance: 82 },
                { name: 'Negombo Beach', performance: 75 },
                { name: 'Jaffna Town', performance: 70 },
            ],
            recentActivities: [
                { id: 1, user: 'John Doe', action: 'registered as a new member', time: '2 mins ago', type: 'member' },
                { id: 2, user: 'Branch Admin', action: 'completed a payment', time: '15 mins ago', type: 'payment' },
                { id: 3, user: 'Super Admin', action: 'added a new staff member', time: '1 hour ago', type: 'staff' },
                { id: 4, user: 'System', action: 'created a new branch: Kalutara', time: '3 hours ago', type: 'branch' },
            ]
        };
    });
    const [isLoading, setIsLoading] = useState(false);

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

    const filteredActivities = useMemo(() => {
        if (!searchQuery.trim()) return recentActivities;
        const q = searchQuery.toLowerCase();
        return recentActivities.filter(act =>
            act.user.toLowerCase().includes(q) ||
            act.action.toLowerCase().includes(q)
        );
    }, [recentActivities, searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/super-admin/owners', { state: { initialSearch: searchQuery } });
        }
    };

    if (isLoading && !statsState) {
        return (
            <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <Loader2 className="animate-spin" size={48} color="var(--color-red)" />
                <span style={{ fontWeight: 800, color: 'var(--color-text-dim)', letterSpacing: '0.1em' }}>INITIALIZING LIVE COMMAND CENTER...</span>
            </div>
        );
    }

    return (
        <div className="super-admin-dashboard" style={{ opacity: isLocked ? 0.95 : 1 }}>
            <header className="sa-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div className="sa-welcome" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1>Dashboard</h1>
                    <p>View the overall performance of all gym branches, manage admins, track staff activity, and monitor system operations.</p>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="sa-stat-card primary" onClick={() => { if (!isLocked) { setActiveTab('locations'); navigate('/dashboard'); } }} style={{ cursor: isLocked ? 'default' : 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000', margin: 0 }}>
                            <Building2 size={24} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Total Branches</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{statsState?.totalBranches || '24'}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card" onClick={() => { if (!isLocked) { setActiveTab('admins'); navigate('/dashboard'); } }} style={{ cursor: isLocked ? 'default' : 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', margin: 0 }}>
                            <ShieldCheck size={24} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Total Admins</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{statsState?.totalAdmins || '4'}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card" onClick={() => { if (!isLocked) { setActiveTab('staff'); navigate('/dashboard'); } }} style={{ cursor: isLocked ? 'default' : 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', margin: 0 }}>
                            <Users size={24} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Total Staff</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{statsState?.totalStaff || '0'}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card" onClick={() => { if (!isLocked) { setActiveTab('members'); navigate('/dashboard'); } }} style={{ cursor: isLocked ? 'default' : 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', margin: 0 }}>
                            <Users size={24} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Total Members</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{statsState?.totalMembers?.toLocaleString() || '0'}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', margin: 0 }}>
                            <Zap size={24} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Total Trainers</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{statsState?.totalTrainers || '0'}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', margin: 0 }}>
                            <DollarSign size={24} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Total Revenue</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>LKR {(statsState?.totalRevenue || 0).toFixed(1)}M</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000', margin: 0 }}>
                            <CreditCard size={24} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Active Members</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{statsState?.activeMemberships || '0'}</h2>
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
                                <h3>Membership Growth</h3>
                            </div>
                        </div>
                        <div style={{ height: '240px', minHeight: '240px', width: '100%', marginTop: '10px' }}>
                            <Recharts.ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
                                    <Recharts.Tooltip
                                        contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#FF0000', fontWeight: 800 }}
                                    />
                                    <Recharts.Area type="monotone" dataKey="members" stroke="#FF0000" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" animationDuration={1800} />
                                </Recharts.AreaChart >
                            </Recharts.ResponsiveContainer >
                        </div >
                    </div >

                    {/* Branch Performance Table - Sync with Admin Dashboard */}
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Branch Performance</h3>
                        </div>
                        <div className="sa-table-container">
                            <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#F9FAFB' }}>
                                        <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Branch Name</th>
                                        <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Total Members</th>
                                        <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Today Check-ins</th>
                                        <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Revenue (LKR)</th>
                                        <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase', textAlign: 'center' }}>Equipment Issues</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { branch: 'Colombo City Gym', members: 450, checkins: 120, revenue: '1.2M', issues: 3 },
                                        { branch: 'Kandy Fitness Center', members: 320, checkins: 85, revenue: '850K', issues: 1 },
                                        { branch: 'Galle Power Hub', members: 210, checkins: 45, revenue: '450K', issues: 0 },
                                        { branch: 'Negombo Fitness', members: 180, checkins: 30, revenue: '380K', issues: 2 },
                                    ].map((row, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)' }}>{row.branch}</td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600 }}>{row.members}</td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600 }}>{row.checkins}</td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: '#10B981' }}>{row.revenue}</td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: row.issues > 0 ? '#EF4444' : '#10B981', textAlign: 'center' }}>{row.issues}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        <div className="sa-card">
                            <div className="sa-card-header">
                                <h3>Monthly Revenue</h3>
                            </div>
                            <div style={{ height: '220px', width: '100%' }}>
                                <Recharts.ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <Recharts.BarChart data={revenueData}>
                                        <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <Recharts.XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-dim)', fontSize: 10, fontWeight: 700 }} />
                                        <Recharts.YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-dim)', fontSize: 10, fontWeight: 700 }} tickFormatter={(val) => `LKR ${val}M`} />
                                        <Recharts.Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px' }} />
                                        <Recharts.Bar dataKey="revenue" fill="#FF0000" radius={[4, 4, 0, 0]} />
                                    </Recharts.BarChart>
                                </Recharts.ResponsiveContainer>
                            </div>
                        </div>

                        <div className="sa-card">
                            <div className="sa-card-header">
                                <h3>Branch Performance</h3>
                            </div>
                            <div style={{ height: '220px', width: '100%' }}>
                                <Recharts.ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <Recharts.RadarChart cx="50%" cy="50%" outerRadius="80%" data={statsState.branchPerformance}>
                                        <Recharts.PolarGrid stroke="rgba(0,0,0,0.05)" />
                                        <Recharts.PolarAngleAxis dataKey="name" tick={{ fill: 'var(--color-text-dim)', fontSize: 10, fontWeight: 700 }} />
                                        <Recharts.Radar name="Performance" dataKey="performance" stroke="#FF0000" fill="#FF0000" fillOpacity={0.6} />
                                        <Recharts.Tooltip contentStyle={{ borderRadius: '12px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }} />
                                    </Recharts.RadarChart>
                                </Recharts.ResponsiveContainer>
                            </div>
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
                        <div className="alerts-stack" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="alert-item-branch" style={{ padding: '14px', background: '#FFF5F5', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '4px solid #EF4444' }}>
                                <AlertCircle size={20} color="#EF4444" />
                                <div>
                                    <span style={{ fontWeight: 800, fontSize: '0.78rem', display: 'block' }}>3 Assets Need Repair</span>
                                    <p style={{ margin: 0, fontSize: '0.62rem', color: '#64748B' }}>Dismantle requests pending</p>
                                </div>
                            </div>
                            <div className="alert-item-branch warning" style={{ padding: '14px', background: '#FFFBEB', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '4px solid #F59E0B' }}>
                                <Clock size={20} color="#F59E0B" />
                                <div>
                                    <span style={{ fontWeight: 800, fontSize: '0.78rem', display: 'block' }}>14 Fees Overdue</span>
                                    <p style={{ margin: 0, fontSize: '0.62rem', color: '#64748B' }}>Follow up required</p>
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
                    <button className="sa-view-more-btn" style={{ background: 'var(--color-red)', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => { setActiveTab('activity-logs'); navigate('/dashboard'); }}>View More</button>
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
