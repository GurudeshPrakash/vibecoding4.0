import React, { useState, useMemo, useEffect } from 'react';
import {
    Package,
    CheckCircle,
    Wrench,
    Trash2,
    Calendar,
    Activity,
    ChevronDown,
    ChevronRight,
    TrendingUp,
    FileText,
    Download
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import { generateDismantleReport } from '../../utils/reportGenerator';
import '../../style/AdminDashboard.css';

const StaffDashboard = ({ staffName, stats, allInventory = [], dismantledHistory = [], onFinalizeDismantle }) => {
    const [visibleLines, setVisibleLines] = useState({
        Good: true,
        Maintenance: true,
        Dismantled: true
    });

    const [selectedMonth, setSelectedMonth] = useState('October');
    const [showDailyView, setShowDailyView] = useState(false);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Generate monthly data based on real inventory createdAt
    const monthlyData = useMemo(() => {
        const combinedInventory = [
            ...allInventory,
            ...dismantledHistory.map(h => ({ ...h, status: 'Dismantled', createdAt: h.createdAt }))
        ];

        if (combinedInventory.length === 0) {
            return months.map(m => ({ name: m, Good: 0, Maintenance: 0, Dismantled: 0 }));
        }

        const currentYear = new Date().getFullYear();

        return months.map((month, index) => {
            const monthEnd = new Date(currentYear, index + 1, 0, 23, 59, 59);

            const itemsUntilMonth = combinedInventory.filter(item => {
                const createdDate = item.createdAt ? new Date(item.createdAt) : new Date(0);
                return createdDate <= monthEnd;
            });

            return {
                name: month,
                Good: itemsUntilMonth.filter(i => i.status === 'Good').length,
                Maintenance: itemsUntilMonth.filter(i => i.status === 'Maintenance').length,
                Dismantled: itemsUntilMonth.filter(i => i.status === 'Dismantled').length
            };
        });
    }, [allInventory, dismantledHistory, stats]);

    // Simple daily data for the selected month based on real inventory
    const dailyData = useMemo(() => {
        if (!allInventory) return [];
        const monthIndex = months.indexOf(selectedMonth);
        const currentYear = new Date().getFullYear();

        const itemsInMonth = allInventory.filter(item => {
            if (!item.createdAt) return false;
            const d = new Date(item.createdAt);
            return d.getMonth() === monthIndex && d.getFullYear() === currentYear;
        });

        if (itemsInMonth.length === 0) return [];

        return itemsInMonth.map(item => ({
            day: new Date(item.createdAt).getDate(),
            changes: 1,
            type: 'New Equipment Added', // We can only track creation for now
            details: item.name
        })).sort((a, b) => b.day - a.day);
    }, [selectedMonth, allInventory]);

    const toggleLine = (line) => {
        setVisibleLines(prev => ({ ...prev, [line]: !prev[line] }));
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p style={{ color: 'var(--color-text)', fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color, fontSize: '0.9rem', margin: '4px 0' }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header-flex">
                <div className="header-left">
                    <h1 className="welcome-admin">Staff <span className="highlight-red">Panel</span></h1>
                    <p className="subtitle">Real-time inventory tracking for Power World gyms</p>
                </div>
                <div className="header-right-actions">
                    <div className="date-time-display">
                        <Calendar size={18} />
                        <span>Today: {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                </div>
            </header>

            {/* 4 Cards in a Single Row */}
            <div className="live-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="live-card card total">
                    <div className="card-inner">
                        <div className="icon-box">
                            <Package size={24} />
                        </div>
                        <div className="card-data">
                            <span className="label">Total Equipment</span>
                            <h2 className="value">{stats.total}</h2>
                        </div>
                    </div>
                </div>

                <div className="live-card card good">
                    <div className="card-inner">
                        <div className="icon-box">
                            <CheckCircle size={24} />
                        </div>
                        <div className="card-data">
                            <span className="label">Good Condition</span>
                            <h2 className="value">{stats.good}</h2>
                        </div>
                    </div>
                </div>

                <div className="live-card card maintenance">
                    <div className="card-inner">
                        <div className="icon-box">
                            <Wrench size={24} />
                        </div>
                        <div className="card-data">
                            <span className="label">Under Maintenance</span>
                            <h2 className="value">{stats.maintenance}</h2>
                        </div>
                    </div>
                </div>

                <div className="live-card card dismantled">
                    <div className="card-inner">
                        <div className="icon-box">
                            <Trash2 size={24} />
                        </div>
                        <div className="card-data">
                            <span className="label">Dismantled</span>
                            <h2 className="value">{stats.dismantled}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-main-area" style={{ gridTemplateColumns: '1fr' }}>
                <div className="card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h3 style={{ color: 'var(--color-text)', fontSize: '1.25rem' }}>Inventory vs Month</h3>
                            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>Comprehensive monitoring of equipment lifespan</p>
                        </div>

                        {/* Interactive Legend */}
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div
                                onClick={() => toggleLine('Good')}
                                className={`legend-btn ${!visibleLines.Good ? 'hidden' : ''}`}
                            >
                                <div className="dot" style={{ background: '#4caf50' }}></div>
                                <span>Good Condition</span>
                            </div>
                            <div
                                onClick={() => toggleLine('Maintenance')}
                                className={`legend-btn ${!visibleLines.Maintenance ? 'hidden' : ''}`}
                            >
                                <div className="dot" style={{ background: '#ffeb3b' }}></div>
                                <span>Maintenance</span>
                            </div>
                            <div
                                onClick={() => toggleLine('Dismantled')}
                                className={`legend-btn ${!visibleLines.Dismantled ? 'hidden' : ''}`}
                            >
                                <div className="dot" style={{ background: '#e63946' }}></div>
                                <span>Dismantled</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
                        <ResponsiveContainer width="99.9%" height="100%" minWidth={0} minHeight={0}>
                            <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="var(--color-text-dim)"
                                    fontSize={12}
                                    axisLine={false}
                                    tickLine={false}
                                    padding={{ left: 20, right: 20 }}
                                />
                                <YAxis
                                    stroke="var(--color-text-dim)"
                                    fontSize={12}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                {visibleLines.Good && (
                                    <Line type="monotone" dataKey="Good" stroke="#4caf50" strokeWidth={3} dot={{ r: 4, fill: '#4caf50' }} activeDot={{ r: 6 }} animationDuration={1000} />
                                )}
                                {visibleLines.Maintenance && (
                                    <Line type="monotone" dataKey="Maintenance" stroke="#ffeb3b" strokeWidth={3} dot={{ r: 4, fill: '#ffeb3b' }} activeDot={{ r: 6 }} animationDuration={1000} />
                                )}
                                {visibleLines.Dismantled && (
                                    <Line type="monotone" dataKey="Dismantled" stroke="#e63946" strokeWidth={3} dot={{ r: 4, fill: '#e63946' }} activeDot={{ r: 6 }} animationDuration={1000} />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Simple Daily View Toggle */}
                    <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <TrendingUp size={20} color="var(--color-red)" />
                                <h4 style={{ color: 'var(--color-text)' }}>Daily Inventory Insights</h4>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="dashboard-select"
                                >
                                    {months.map(m => <option key={m} value={m}>{m} 2024</option>)}
                                </select>
                                <button
                                    onClick={() => setShowDailyView(!showDailyView)}
                                    className="btn-primary"
                                    style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                                >
                                    {showDailyView ? 'Hide Details' : 'View Daily Data'}
                                </button>
                            </div>
                        </div>

                        {showDailyView && (
                            <div className="equipment-table" style={{ maxHeight: '300px', overflowY: 'auto', background: 'var(--color-surface-muted)', borderRadius: '12px', padding: '10px', marginBottom: '30px' }}>
                                <div className="table-header" style={{ gridTemplateColumns: '1fr 2fr 2fr', padding: '12px 20px' }}>
                                    <span>Day</span>
                                    <span>Equipment Name</span>
                                    <span>Action</span>
                                </div>
                                {dailyData.length === 0 ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-dim)' }}>
                                        No new equipment added this month.
                                    </div>
                                ) : (
                                    dailyData.map((d, i) => (
                                        <div key={i} className="table-row" style={{ gridTemplateColumns: '1fr 2fr 2fr', padding: '12px 20px' }}>
                                            <span style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>{selectedMonth} {d.day}</span>
                                            <span style={{ color: 'var(--color-text-dim)' }}>{d.details}</span>
                                            <span style={{ color: '#4caf50' }}>{d.type}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Dismantled History Section */}
                        <div style={{ marginTop: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                <Trash2 size={20} color="var(--color-red)" />
                                <h4 style={{ color: 'var(--color-text)' }}>Dismantled Equipment History</h4>
                            </div>
                            <div className="equipment-table" style={{ background: 'var(--color-surface-muted)', borderRadius: '12px', padding: '10px' }}>
                                <div className="table-header" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr', padding: '12px 20px' }}>
                                    <span>Equipment Name</span>
                                    <span>ID</span>
                                    <span>Approved On</span>
                                    <span style={{ textAlign: 'right' }}>Actions</span>
                                </div>
                                {dismantledHistory.length === 0 ? (
                                    <div style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-dim)' }}>
                                        No equipment pending physical dismantling.
                                    </div>
                                ) : (
                                    dismantledHistory.map((item, i) => (
                                        <div key={i} className="table-row" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr', padding: '12px 20px', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>{item.equipmentName}</span>
                                            <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>{item.equipmentCustomId || 'N/A'}</span>
                                            <span style={{ color: 'var(--color-text-dim)' }}>{new Date(item.updatedAt).toLocaleDateString()}</span>
                                            <div style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => generateDismantleReport(item)}
                                                    className="btn-icon-success"
                                                    title="Download Dismantle Report"
                                                    style={{
                                                        background: 'rgba(76, 175, 80, 0.1)',
                                                        border: '1px solid rgba(76, 175, 80, 0.3)',
                                                        color: '#4caf50',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        outline: 'none'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.background = '#4caf50';
                                                        e.currentTarget.style.color = 'white';
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.2)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.background = 'rgba(76, 175, 80, 0.1)';
                                                        e.currentTarget.style.color = '#4caf50';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0) scale(0.95)';
                                                    }}
                                                    onMouseUp={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
                                                    }}
                                                >
                                                    <FileText size={16} />
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Report</span>
                                                </button>
                                                <button
                                                    onClick={() => onFinalizeDismantle(item._id || item.id)}
                                                    className="btn-icon-danger"
                                                    title="Finalize Removal"
                                                    style={{
                                                        background: 'rgba(230, 57, 70, 0.1)',
                                                        border: '1px solid rgba(230, 57, 70, 0.3)',
                                                        color: 'var(--color-red)',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.background = 'var(--color-red)';
                                                        e.currentTarget.style.color = 'white';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.background = 'rgba(230, 57, 70, 0.1)';
                                                        e.currentTarget.style.color = 'var(--color-red)';
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Finalize</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
