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
    ArrowRight,
    Building2,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    Zap,
    Briefcase,
    Loader2,
    Calendar,
    ClipboardList,
    Download,
    RefreshCcw
} from 'lucide-react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    PieChart,
    Pie
} from 'recharts';

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

    // Reminder System State
    const [reminders, setReminders] = useState(() => {
        const saved = localStorage.getItem('sa_calendar_reminders');
        return saved ? JSON.parse(saved) : {};
    });
    const [reminderModal, setReminderModal] = useState({ isOpen: false, date: null, data: null });
    const [reminderForm, setReminderForm] = useState({ title: '', description: '', time: '12:00' });

    // Notification Check
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
            const timeKey = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            if (reminders[dateKey]) {
                const dueReminders = reminders[dateKey].filter(r => r.time === timeKey && !r.notified);
                if (dueReminders.length > 0) {
                    dueReminders.forEach(r => {
                        alert(`🔔 Reminder: ${r.title}\n${r.description || ''}\n\nYou set a reminder for this task.`);
                        r.notified = true;
                    });
                    const updated = { ...reminders, [dateKey]: [...reminders[dateKey]] };
                    setReminders(updated);
                    localStorage.setItem('sa_calendar_reminders', JSON.stringify(updated));
                }
            }
        }, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, [reminders]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthNum = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const handleDateDoubleClick = (d) => {
        const selectedDate = new Date(year, monthNum, d);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert("You can only set reminders for future date and time.");
            return;
        }

        const dateKey = `${year}-${monthNum}-${d}`;
        const existing = reminders[dateKey] ? reminders[dateKey][0] : null;

        setReminderModal({ isOpen: true, date: d, data: existing });
        setReminderForm({
            title: existing ? existing.title : '',
            description: existing ? existing.description : '',
            time: existing ? existing.time : '12:00'
        });
    };

    const handleSaveReminder = (e) => {
        e.preventDefault();
        const d = reminderModal.date;
        const selectedDate = new Date(year, monthNum, d);
        const now = new Date();

        // Time validation for today
        if (selectedDate.toDateString() === now.toDateString()) {
            const [h, m] = reminderForm.time.split(':');
            const reminderDateTime = new Date();
            reminderDateTime.setHours(parseInt(h), parseInt(m), 0, 0);

            if (reminderDateTime <= now) {
                alert("You can only set reminders for future date and time.");
                return;
            }
        }

        const dateKey = `${year}-${monthNum}-${d}`;
        const newReminder = { ...reminderForm, id: Date.now(), notified: false };

        const updatedReminders = { ...reminders, [dateKey]: [newReminder] };
        setReminders(updatedReminders);
        localStorage.setItem('sa_calendar_reminders', JSON.stringify(updatedReminders));
        setReminderModal({ isOpen: false, date: null, data: null });
    };

    const handleRemoveReminder = () => {
        const dateKey = `${year}-${monthNum}-${reminderModal.date}`;
        const updated = { ...reminders };
        delete updated[dateKey];
        setReminders(updated);
        localStorage.setItem('sa_calendar_reminders', JSON.stringify(updated));
        setReminderModal({ isOpen: false, date: null, data: null });
    };

    return (
        <div className="mini-calendar" style={{ position: 'relative' }}>
            <div className="cal-header">
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <ChevronLeft size={16} onClick={() => setCurrentDate(new Date(year, monthNum - 1, 1))} style={{ cursor: 'pointer' }} />
                    <div className="cal-month-box" onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}>
                        <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#FFFFFF' }}>{monthNames[monthNum].slice(0, 3)}</span>
                        <ChevronDown size={14} color="#FFFFFF" />
                        {isMonthDropdownOpen && (
                            <div className="cal-dropdown">
                                {monthNames.map((m, idx) => (
                                    <div key={m} onClick={() => { setCurrentDate(new Date(year, idx, 1)); setIsMonthDropdownOpen(false); }}>{m}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <ChevronRight size={16} onClick={() => setCurrentDate(new Date(year, monthNum + 1, 1))} style={{ cursor: 'pointer' }} />
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <ChevronLeft size={16} onClick={() => setCurrentDate(new Date(year - 1, monthNum, 1))} style={{ cursor: 'pointer' }} />
                    <div className="cal-year-box"><span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#FFFFFF' }}>{year}</span></div>
                    <ChevronRight size={16} onClick={() => setCurrentDate(new Date(year + 1, monthNum, 1))} style={{ cursor: 'pointer' }} />
                </div>
            </div>

            <div className="cal-grid">
                {days.map((d, i) => <div key={`day-${i}`} className="cal-day-label">{d}</div>)}
                {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                    const d = i + 1;
                    const dateKey = `${year}-${monthNum}-${d}`;
                    const hasReminder = reminders[dateKey] && reminders[dateKey].length > 0;
                    const today = new Date();
                    const isToday = today.getDate() === d && today.getMonth() === monthNum && today.getFullYear() === year;

                    return (
                        <div
                            key={d}
                            className={`cal-date ${isToday ? 'active' : ''} ${hasReminder ? 'has-reminder' : ''}`}
                            onDoubleClick={() => handleDateDoubleClick(d)}
                            style={{
                                cursor: 'pointer',
                                position: 'relative',
                                background: hasReminder ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                                border: hasReminder ? '1px dashed var(--color-red)' : 'none',
                                borderRadius: '50%'
                            }}
                        >
                            {d}
                            {hasReminder && <div style={{ position: 'absolute', bottom: '4px', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-red)' }} />}
                        </div>
                    );
                })}
            </div>

            {/* Reminder Modal */}
            {reminderModal.isOpen && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10002, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="sa-card" style={{ width: '400px', padding: '24px', background: 'white' }}>
                        <h3 style={{ marginBottom: '20px' }}>{reminderModal.data ? 'Edit Reminder' : 'Set Reminder'} - {monthNames[monthNum]} {reminderModal.date}</h3>
                        <form onSubmit={handleSaveReminder}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '6px' }}>Reminder Title *</label>
                                <input
                                    type="text"
                                    required
                                    className="sa-input"
                                    value={reminderForm.title}
                                    onChange={e => setReminderForm({ ...reminderForm, title: e.target.value })}
                                    placeholder="Reason for reminder..."
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '6px' }}>Description</label>
                                <textarea
                                    className="sa-input"
                                    value={reminderForm.description}
                                    onChange={e => setReminderForm({ ...reminderForm, description: e.target.value })}
                                    style={{ minHeight: '80px', resize: 'none' }}
                                />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '6px' }}>Time *</label>
                                <input
                                    type="time"
                                    required
                                    className="sa-input"
                                    value={reminderForm.time}
                                    onChange={e => setReminderForm({ ...reminderForm, time: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setReminderModal({ isOpen: false })} className="sa-secondary-btn" style={{ flex: 1, minWidth: 'auto', justifyContent: 'center' }}>Cancel</button>
                                {reminderModal.data && (
                                    <button type="button" onClick={handleRemoveReminder} className="sa-secondary-btn" style={{ flex: 1, minWidth: 'auto', justifyContent: 'center', color: 'var(--color-red)', borderColor: 'var(--color-red)' }}>Remove</button>
                                )}
                                <button type="submit" className="sa-primary-red-btn" style={{ flex: 2, minWidth: 'auto', justifyContent: 'center' }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
            } catch (e) { }
        }
        return {
            totalBranches: 24,
            totalAdmins: 4,
            totalStaff: 156,
            totalMembers: 4850,
            activeMembers: 4200,
            todayRevenue: 125000,
            newMembersToday: 12,
            acGyms: 16,
            nonAcGyms: 8,
            revenueTrend: [
                { month: 'Jan', revenue: 8.5 },
                { month: 'Feb', revenue: 9.2 },
                { month: 'Mar', revenue: 1.2 }, // Current month, will be updated to 'up to today'
                { month: 'Apr', revenue: 0 },
                { month: 'May', revenue: 0 },
                { month: 'Jun', revenue: 0 },
                { month: 'Jul', revenue: 0 },
                { month: 'Aug', revenue: 0 },
                { month: 'Sep', revenue: 0 },
                { month: 'Oct', revenue: 0 },
                { month: 'Nov', revenue: 0 },
                { month: 'Dec', revenue: 0 },
            ],
            memberGrowth: [
                { name: 'Jan', members: 420 },
                { name: 'Feb', members: 380 },
                { name: 'Mar', members: 110 }, // New members in March so far
                { name: 'Apr', members: 0 },
                { name: 'May', members: 0 },
                { name: 'Jun', members: 0 },
                { name: 'Jul', members: 0 },
                { name: 'Aug', members: 0 },
                { name: 'Sep', members: 0 },
                { name: 'Oct', members: 0 },
                { name: 'Nov', members: 0 },
                { name: 'Dec', members: 0 },
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
            const staffDb = JSON.parse(localStorage.getItem('admin_staff_db') || '[]');
            const adminsDb = JSON.parse(localStorage.getItem('mock_admins_db') || '[]');
            const branchesDb = JSON.parse(localStorage.getItem('mock_branches_db') || '[]');
            const membersDb = JSON.parse(localStorage.getItem('mock_members_db') || '[]');
            const paymentsDb = JSON.parse(localStorage.getItem('mock_payments_db') || '[]');

            setStatsState(prev => {
                const now = new Date();
                const currentMonthIdx = now.getMonth();
                const todayStr = now.toISOString().split('T')[0];

                // Calculate today's revenue from payments
                const todayRevenueCount = paymentsDb
                    .filter(p => p.date === todayStr || (p.timestamp && p.timestamp.startsWith(todayStr)))
                    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

                // Calculate new members today
                const newMembersTodayCount = membersDb
                    .filter(m => m.joinedDate === todayStr || (m.createdAt && m.createdAt.startsWith(todayStr)))
                    .length;

                // Update current month growth in trends
                const updatedRevenueTrend = [...prev.revenueTrend];
                // For demonstration, we simulate current month revenue as partial
                // In a real app, this would be an aggregation of payments for the month
                const marchBaseRevenue = 1.2; // Mock base
                updatedRevenueTrend[currentMonthIdx] = {
                    ...updatedRevenueTrend[currentMonthIdx],
                    revenue: marchBaseRevenue + (todayRevenueCount / 1000000)
                };

                const updatedMemberGrowth = [...prev.memberGrowth];
                const marchBaseMembers = 110; // Mock base
                updatedMemberGrowth[currentMonthIdx] = {
                    ...updatedMemberGrowth[currentMonthIdx],
                    members: marchBaseMembers + newMembersTodayCount
                };

                return {
                    ...prev,
                    totalBranches: branchesDb.length || 24,
                    totalAdmins: adminsDb.length || 4,
                    totalStaff: staffDb.length || 156,
                    totalMembers: membersDb.length || 4850,
                    activeMembers: membersDb.filter(m => m.status === 'Active').length || 4200,
                    todayRevenue: todayRevenueCount || 125000,
                    newMembersToday: newMembersTodayCount || 12,
                    acGyms: branchesDb.filter(b => b.type === 'AC').length || 16,
                    nonAcGyms: branchesDb.filter(b => b.type === 'Non-AC').length || 8,
                    revenueTrend: updatedRevenueTrend,
                    memberGrowth: updatedMemberGrowth
                };
            });
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


    const COLORS = ['#FF0000', '#374151'];

    const recentActivities = statsState.recentActivities.map((act) => ({
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
                            placeholder="Search Members, Managers, Branches..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', fontWeight: 500, color: '#333' }}
                        />
                    </form>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                {/* Row 1: Core System Entities */}
                <div className="sa-stat-card primary" onClick={() => { if (!isLocked) { setActiveTab('locations'); navigate('/dashboard'); } }} style={{ cursor: isLocked ? 'default' : 'pointer' }}>
                    <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000' }}>
                        <Building2 size={24} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="label">Total Branches</span>
                        <h2 className="value">{statsState?.totalBranches}</h2>
                    </div>
                </div>

                <div className="sa-stat-card" onClick={() => { if (!isLocked) { setActiveTab('admins'); navigate('/dashboard'); } }} style={{ cursor: isLocked ? 'default' : 'pointer' }}>
                    <div className="icon-circle" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        <ShieldCheck size={24} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="label">Total Admins</span>
                        <h2 className="value">{statsState?.totalAdmins}</h2>
                    </div>
                </div>

                <div className="sa-stat-card" onClick={() => { if (!isLocked) { setActiveTab('staff'); navigate('/dashboard'); } }} style={{ cursor: isLocked ? 'default' : 'pointer' }}>
                    <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                        <Users size={24} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="label">Total Staff</span>
                        <h2 className="value">{statsState?.totalStaff}</h2>
                    </div>
                </div>

                {/* Row 2: Live Performance Metrics */}
                <div className="sa-stat-card" onClick={() => { if (!isLocked) { setActiveTab('members'); navigate('/dashboard'); } }} style={{ cursor: isLocked ? 'default' : 'pointer' }}>
                    <div className="icon-circle" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                        <Users size={24} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="label">Active Members</span>
                        <h2 className="value">{statsState?.activeMembers?.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                        <DollarSign size={24} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="label">Today Revenue</span>
                        <h2 className="value">LKR {(statsState?.todayRevenue / 1000).toFixed(0)}K</h2>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
                        <UserPlus size={24} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="label">New Members Today</span>
                        <h2 className="value">{statsState?.newMembersToday}</h2>
                    </div>
                </div>
            </section>

            <div className="sa-dashboard-layout">
                <main className="sa-analytics-col">
                    {/* Membership Growth */}
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <div>
                                <h3>Membership Registration Growth</h3>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Monthly user onboarding trends</p>
                            </div>
                            <div className="sa-header-btns">
                                <button className="icon-btn" title="Download Report"><Download size={18} /></button>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <LineChart data={statsState.memberGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ fontWeight: 800, color: 'var(--color-red)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="members"
                                        stroke="#FF0000"
                                        strokeWidth={4}
                                        dot={{ r: 4, fill: '#FF0000', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                        animationDuration={1500}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Revenue Trend */}
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <div>
                                <h3>Monthly Revenue Trend</h3>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>LKR Revenue across all branches</p>
                            </div>
                            <div className="sa-header-btns">
                                <select className="sa-select-minimal">
                                    <option>Year 2024</option>
                                    <option>Year 2023</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <BarChart data={statsState.revenueTrend.map((d, idx) => {
                                    const now = new Date();
                                    const currentMonthIdx = now.getMonth();
                                    if (idx === currentMonthIdx) {
                                        const dayOfMonth = now.getDate();
                                        const totalDays = new Date(now.getFullYear(), currentMonthIdx + 1, 0).getDate();
                                        return { ...d, revenue: Math.round(d.revenue * (dayOfMonth / totalDays)) };
                                    }
                                    return d;
                                })}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} dx={-10} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,0,0,0.02)' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                        formatter={(val) => [`LKR ${val.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Bar dataKey="revenue" fill="var(--color-red)" radius={[6, 6, 0, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </main>

                <aside className="sa-sidebar-col">
                    {/* Branch Performance */}
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Branch Performance</h3>
                            <button className="sa-view-more-btn" onClick={() => setActiveTab('locations')} style={{ background: 'transparent', border: 'none', color: 'var(--color-red)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                More <ArrowRight size={14} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { name: 'Colombo City Gym', members: 1240, revenue: '1.2M', active: 850 },
                                { name: 'Kandy Premier', members: 890, revenue: '0.8M', active: 620 },
                                { name: 'Galle Coastal', members: 560, revenue: '0.4M', active: 410 }
                            ].map((branch, i) => (
                                <div key={i} style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', background: '#F9FAFB' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{branch.name}</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-red)' }}>TOP {i + 1}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Members</span>
                                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{branch.members.toLocaleString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Revenue</span>
                                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>LKR {branch.revenue}</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '12px', width: '100%', height: '4px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{ width: `${(branch.active / branch.members) * 100}%`, height: '100%', background: 'var(--color-red)' }} />
                                    </div>
                                    <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>
                                        <span>Active: {branch.active}</span>
                                        <span>{Math.round((branch.active / branch.members) * 100)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Calendar */}
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Event Calendar</h3>
                            <button className="icon-btn"><Plus size={18} /></button>
                        </div>
                        <MiniCalendar />
                    </div>

                    <div className="sa-system-status">
                        <div className="status-indicator">
                            <div className="status-dot"></div>
                            <span>SYSTEM LIVE: {new Date().toLocaleTimeString()}</span>
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
