import React, { useState, useMemo, useEffect } from 'react';
import {
    LayoutDashboard,
    CheckCircle2,
    Clock,
    Wrench,
    Activity,
    Calendar,
    ArrowUpRight,
    Package,
    ShieldAlert,
    ChevronDown,
    ChevronRight,
    Trophy,
    Plus,
    AlertTriangle,
    MoreHorizontal
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

import '../../style/AdminDashboard.css';

const AdminDashboard = ({ stats, adminName, realTimeEnabled, recentInventory = [], allInventory = [], dismantleRequests = [], setDismantleRequests, refreshInventory, dismantledHistory = [] }) => {
    const [visibleLines, setVisibleLines] = useState({
        good: true,
        maintenance: true,
        dismantled: true
    });

    const handleAction = async (requestId, action) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://localhost:5000/api/equipment/requests/${requestId}/${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: action === 'approve' ? 'Approved by Admin' : 'Rejected by Admin' })
            });

            if (response.ok) {
                alert(`Successfully ${action}d dismantle request.`);
                setDismantleRequests(prev => prev.filter(r => r._id !== requestId));
                if (action === 'approve' && refreshInventory) {
                    refreshInventory();
                }
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Action error:', error);
        }
    };

    // ... (monthlyData, getStatusColor, CustomTooltip remain the same) ...
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Generate historical data based on real inventory createdAt
    const monthlyData = useMemo(() => {
        const combinedInventory = [
            ...allInventory,
            ...dismantledHistory.map(h => ({ ...h, status: 'Dismantled', createdAt: h.createdAt }))
        ];

        if (combinedInventory.length === 0) {
            return months.map(m => ({ name: m, good: 0, maintenance: 0, dismantled: 0 }));
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
                good: itemsUntilMonth.filter(i => i.status === 'Good').length,
                maintenance: itemsUntilMonth.filter(i => i.status === 'Maintenance').length,
                dismantled: itemsUntilMonth.filter(i => i.status === 'Dismantled').length
            };
        });
    }, [allInventory, dismantledHistory, stats]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Good': return '#4caf50';
            case 'Maintenance': return '#ffeb3b';
            case 'Dismantled': return '#FF0000';
            default: return '#fff';
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value}`}
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
                    <h1 className="welcome-admin">Admin <span className="highlight-red">Dashboard</span></h1>
                    <div className="date-time-display">
                        <Calendar size={16} />
                        <span>Running Since</span>
                        <div className="time-divider"></div>
                        <Clock size={16} />
                        <span>Oct 2024</span>
                    </div>
                </div>
                <div className="header-right-actions">
                    <div className="user-badge-mini card">
                        <Trophy size={18} color="#FF0000" />
                        <span>{adminName}</span>
                    </div>
                </div>
            </header>

            {/* 4 Cards in a Single Row */}
            <div className="live-stats-row">
                <div className="live-card card total">
                    <div className="card-inner">
                        <div className="icon-box"><Package size={24} /></div>
                        <div className="card-data">
                            <span className="label">Total Inventory</span>
                            <h2 className="value">{stats.total}</h2>
                        </div>
                    </div>
                </div>

                <div className="live-card card good">
                    <div className="card-inner">
                        <div className="icon-box"><CheckCircle2 size={24} /></div>
                        <div className="card-data">
                            <span className="label">Good Condition</span>
                            <h2 className="value">{stats.good}</h2>
                        </div>
                    </div>
                </div>

                <div className="live-card card maintenance">
                    <div className="card-inner">
                        <div className="icon-box"><Wrench size={24} /></div>
                        <div className="card-data">
                            <span className="label">Under Maintenance</span>
                            <h2 className="value">{stats.maintenance}</h2>
                        </div>
                    </div>
                </div>

                <div className="live-card card dismantled">
                    <div className="card-inner">
                        <div className="icon-box"><ShieldAlert size={24} /></div>
                        <div className="card-data">
                            <span className="label">Dismantled</span>
                            <h2 className="value">{stats.dismantled}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dismantle Requests Banner */}
            {dismantleRequests.length > 0 && (
                <div className="card" style={{ marginBottom: '32px', border: '1px solid var(--color-red)', background: 'rgba(230, 57, 70, 0.05)' }}>
                    <div className="card-header-v2" style={{ padding: '20px 24px', borderBottom: '1px solid rgba(230, 57, 70, 0.2)' }}>
                        <div className="header-tag">
                            <AlertTriangle size={20} color="var(--color-red)" />
                            <h3>Approval Required: Dismantle Requests</h3>
                        </div>
                        <span className="count-badge-v2" style={{ background: 'var(--color-red)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{dismantleRequests.length} Pending</span>
                    </div>
                    <div className="requests-stack" style={{ padding: '16px 24px' }}>
                        {dismantleRequests.map(req => (
                            <div key={req._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: req !== dismantleRequests[dismantleRequests.length - 1] ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                <div>
                                    <h4 style={{ color: 'var(--color-text)', marginBottom: '4px' }}>{req.equipmentName} <span style={{ color: 'var(--color-text-dim)', fontWeight: 'normal', fontSize: '0.9rem' }}>({req.equipmentCustomId})</span></h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>Branch: <strong>{req.branch}</strong> • Manager: {req.staffName}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => handleAction(req._id, 'reject')}
                                        className="btn-minimal"
                                        style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}
                                    >Reject</button>
                                    <button
                                        onClick={() => handleAction(req._id, 'approve')}
                                        className="btn-primary"
                                        style={{ fontSize: '0.85rem', padding: '6px 16px', borderRadius: '6px' }}
                                    >Approve Dismantle</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="dashboard-main-area">
                <div className="graph-container-v2 card">
                    <div className="graph-header-top">
                        <div>
                            <h3>Inventory Overview</h3>
                            <p className="subtitle">Cumulative equipment status throughout the year</p>
                        </div>
                        <div className="time-range-selector">
                            <select className="dashboard-select">
                                {months.map(month => (
                                    <option key={month} value={month}>{month} 2024</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="graph-viewport-container">
                        <div style={{ width: '100%', height: '400px', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={monthlyData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="var(--color-ash)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="var(--color-ash)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: 'Gym Equipment Inventory', angle: -90, position: 'insideLeft', style: { fill: 'var(--color-ash)', fontWeight: 700, fontSize: 13 } }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        layout="vertical"
                                        align="right"
                                        verticalAlign="middle"
                                        iconType="circle"
                                        wrapperStyle={{ paddingLeft: '20px' }}
                                    />
                                    {visibleLines.good && (
                                        <Line
                                            type="monotone"
                                            dataKey="good"
                                            stroke="#4caf50"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#4caf50' }}
                                            activeDot={{ r: 8 }}
                                            name="Good Condition"
                                            animationDuration={1500}
                                        />
                                    )}
                                    {visibleLines.maintenance && (
                                        <Line
                                            type="monotone"
                                            dataKey="maintenance"
                                            stroke="#ffeb3b"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#ffeb3b' }}
                                            activeDot={{ r: 8 }}
                                            name="Maintenance"
                                            animationDuration={1500}
                                        />
                                    )}
                                    {visibleLines.dismantled && (
                                        <Line
                                            type="monotone"
                                            dataKey="dismantled"
                                            stroke="#FF0000"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#FF0000' }}
                                            activeDot={{ r: 8 }}
                                            name="Dismantled"
                                            animationDuration={1500}
                                        />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="recent-inventory-v2 card">
                    <div className="card-header-v2">
                        <div className="header-tag">
                            <Activity size={18} color="#FF0000" />
                            <h3>Recent Inventory</h3>
                        </div>
                        <button className="icon-btn-minimal"><MoreHorizontal size={20} /></button>
                    </div>

                    <div className="equipment-stack">
                        {recentInventory.length === 0 ? (
                            <div className="empty-recent-notif">No recent activity recorded</div>
                        ) : (
                            recentInventory.map((item) => (
                                <div key={item.id} className="inventory-row-v2">
                                    <div className="item-meta">
                                        <span className="name">{item.name}</span>
                                        <span className="loc">{item.area}</span>
                                    </div>
                                    <div className="status-badge-v2" style={{ color: getStatusColor(item.status) }}>
                                        <div className="dot" style={{ background: getStatusColor(item.status) }} />
                                        {item.status}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <button className="view-all-link">View All Network Inventory</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
