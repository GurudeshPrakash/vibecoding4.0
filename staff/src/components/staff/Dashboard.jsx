import React, { useState, useMemo } from 'react';
import {
    Users,
    Activity,
    CreditCard,
    DollarSign,
    Package,
    Calendar,
    ChevronRight,
    Wrench,
    AlertTriangle,
    Clock,
    UserPlus,
    Bell,
    CheckCircle2,
    Zap
} from 'lucide-react';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from '../../assets/logo1.png';
import '../../style/StaffDashboard.css';

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

const StaffDashboard = ({ staffName, stats, allInventory = [], dismantledHistory = [], onFinalizeDismantle }) => {
    const navigate = useNavigate();

    const peakHoursData = [
        { hour: '6am', attendance: 45, revenue: 15000 },
        { hour: '9am', attendance: 120, revenue: 25000 },
        { hour: '12pm', attendance: 85, revenue: 18000 },
        { hour: '3pm', attendance: 95, revenue: 22000 },
        { hour: '6pm', attendance: 180, revenue: 45000 },
        { hour: '9pm', attendance: 110, revenue: 28000 },
    ];

    const handleGenerateReportAndFinalize = async (req) => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(30, 30, 30);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("ASSET DISMANTLE REPORT", 105, 25, { align: "center" });

        doc.setTextColor(33, 33, 33);
        doc.setFontSize(14);
        doc.text(`Equipment: ${req.equipmentName} (${req.equipmentCustomId || 'N/A'})`, 15, 60);
        doc.text(`Requested By: ${req.staffName}`, 15, 70);
        doc.text(`Branch: ${req.branch}`, 15, 80);
        doc.text(`Status: Physically Removed / Finalized`, 15, 90);

        doc.setFontSize(12);
        doc.text(`Reason for removal: ${req.reason || 'Not specified'}`, 15, 110);
        doc.text(`Original Cost: LKR ${req.price || 0}`, 15, 120);

        if (req.photo) {
            doc.text(`Reference Photo Attached`, 15, 140);
        }

        doc.save(`Dismantle_Report_${req.equipmentName}.pdf`);

        // Finalize (Delete from History)
        if (onFinalizeDismantle) {
            onFinalizeDismantle(req._id);
        }
    };

    const recentActivities = [
        { id: 1, type: 'registration', text: 'New member registered', meta: 'John Doe', time: '10 mins ago', icon: <UserPlus size={18} color="#10B981" /> },
        { id: 2, type: 'payment', text: 'Payment completed', meta: 'Monthly Renewal', time: '25 mins ago', icon: <DollarSign size={18} color="#3B82F6" /> },
        { id: 3, type: 'checkin', text: 'Member check-in', meta: 'Sarah Smith', time: '1 hour ago', icon: <CheckCircle2 size={18} color="#8B5CF6" /> },
        { id: 4, type: 'maintenance', text: 'Support issue logged', meta: 'Treadmill T-04', time: '3 hours ago', icon: <Wrench size={18} color="#F59E0B" /> },
        { id: 5, type: 'renewal', text: 'Membership renewed', meta: 'Mike Johnson', time: '5 hours ago', icon: <Activity size={18} color="#10B981" /> },
    ];

    return (
        <div className="staff-dashboard">
            <header className="dashboard-header-flex">
                <div className="welcome-text">
                    <h1>Branch <span className="highlight-red">Overview</span></h1>
                    <p className="subtitle-v5">Manager Control & Facility Monitoring</p>
                </div>
                <div className="header-right-actions">
                    <div className="date-time-display" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontWeight: 600 }}>
                        <Clock size={20} />
                        <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} Live Data</span>
                    </div>
                </div>
            </header>

            {/* Top Summary Cards */}
            <div className="live-stats-v5">
                <div className="stat-card-v5" style={{ gridColumn: 'span 1' }}>
                    <div className="card-icon-v5" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Users /></div>
                    <div className="card-info-v5">
                        <span className="label">Total Branch Members</span>
                        <h2 className="value">1,420</h2>
                    </div>
                </div>
                <div className="stat-card-v5" style={{ gridColumn: 'span 1' }}>
                    <div className="card-icon-v5" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><Activity /></div>
                    <div className="card-info-v5">
                        <span className="label">Active Branch Members</span>
                        <h2 className="value">985</h2>
                    </div>
                </div>
                <div className="stat-card-v5" style={{ gridColumn: 'span 1' }}>
                    <div className="card-icon-v5" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}><UserPlus /></div>
                    <div className="card-info-v5">
                        <span className="label">New Members (Today)</span>
                        <h2 className="value">12</h2>
                    </div>
                </div>
                <div className="stat-card-v5" style={{ gridColumn: 'span 1' }}>
                    <div className="card-icon-v5" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><CheckCircle2 /></div>
                    <div className="card-info-v5">
                        <span className="label">Daily Check-ins</span>
                        <h2 className="value">345</h2>
                    </div>
                </div>
                <div className="stat-card-v5" style={{ gridColumn: 'span 1' }}>
                    <div className="card-icon-v5" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><DollarSign /></div>
                    <div className="card-info-v5">
                        <span className="label">Monthly Revenue</span>
                        <h2 className="value">LKR 4.8M</h2>
                    </div>
                </div>
                <div className="stat-card-v5" style={{ gridColumn: 'span 1' }}>
                    <div className="card-icon-v5" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><CreditCard /></div>
                    <div className="card-info-v5">
                        <span className="label">Pending Payments</span>
                        <h2 className="value">28</h2>
                    </div>
                </div>
            </div>

            <div className="branch-grid">
                {/* Main Analytics & Activity */}
                <main className="sa-analytics-col">
                    <div className="premium-chart-card">
                        <div className="chart-header-v5">
                            <div>
                                <h3>Attendance vs Revenue Trend</h3>
                                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', fontWeight: 700, marginTop: '8px' }}>
                                    <span style={{ color: '#3B82F6' }}>● Peak Check-ins</span>
                                    <span style={{ color: '#10B981' }}>● Est. Income</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={peakHoursData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} />
                                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} />
                                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }} />
                                    <Bar yAxisId="left" dataKey="attendance" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Recent Activity Feed</h3>
                        </div>
                        <div className="sa-activity-feed" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {recentActivities.map(item => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #F1F5F9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 700, color: '#1E293B' }}>{item.text}</p>
                                            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{item.meta}</span>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Ready for Physical Removal</h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Approved by Admin • Action Required</p>
                        </div>
                        <div className="sa-activity-feed" style={{ padding: '0 16px' }}>
                            {dismantledHistory.filter(r => r.status === 'Approved').length === 0 ? (
                                <p style={{ color: '#64748B', fontSize: '0.9rem', padding: '16px 0' }}>No approved dismantled requests pending finalization.</p>
                            ) : (
                                dismantledHistory.filter(r => r.status === 'Approved').map(req => (
                                    <div key={req._id} style={{ borderBottom: '1px solid #E2E8F0', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h4 style={{ margin: 0, color: '#1E293B', fontSize: '1rem' }}>{req.equipmentName}</h4>
                                                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{req.equipmentCustomId || 'No ID'}</span>
                                                <p style={{ margin: '8px 0 0 0', color: '#10B981', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <CheckCircle2 size={14} /> Approved
                                                </p>
                                            </div>
                                            <button onClick={() => handleGenerateReportAndFinalize(req)} style={{ background: '#3B82F6', color: '#FFF', padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Package size={16} /> Finalize
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>

                {/* Sidebar Operations */}
                <aside className="sa-sidebar-col">
                    <MiniCalendar />

                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Quick Actions</h3>
                        </div>
                        <div className="branch-quick-actions">
                            <button className="action-btn-light"><UserPlus size={20} /> Add Member</button>
                            <button className="action-btn-light"><CreditCard size={20} /> Record Pay</button>
                            <button className="action-btn-light"><Wrench size={20} /> Log Issue</button>
                            <button className="action-btn-light"><Bell size={20} /> Broadcast</button>
                        </div>
                    </div>

                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Attention Required</h3>
                        </div>
                        <div className="alerts-stack" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Alert 1 */}
                            <div style={{ padding: '16px', background: '#FFFBEB', borderRadius: '16px', borderLeft: '4px solid #F59E0B', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Clock size={24} color="#F59E0B" />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#92400E' }}>24 Expiring Soon</p>
                                    <span style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>Memberships ending within 7 days</span>
                                </div>
                            </div>
                            {/* Alert 2 */}
                            <div style={{ padding: '16px', background: '#FEF2F2', borderRadius: '16px', borderLeft: '4px solid #EF4444', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <AlertTriangle size={24} color="#EF4444" />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#991B1B' }}>3 Asset Faults</p>
                                    <span style={{ fontSize: '0.75rem', color: '#B91C1C', fontWeight: 600 }}>Equipment maintenance needed</span>
                                </div>
                            </div>
                            <div style={{ padding: '16px', background: '#F1F5F9', borderRadius: '16px', borderLeft: '4px solid #3B82F6', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <CreditCard size={24} color="#3B82F6" />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#1E40AF' }}>12 Overdue Payments</p>
                                    <span style={{ fontSize: '0.75rem', color: '#1E3A8A', fontWeight: 600 }}>Follow-up required from front desk</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="branch-info-pill">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--color-red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
                                {staffName ? staffName.charAt(0) : 'M'}
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#1E293B' }}>{staffName || 'Branch Manager'}</h4>
                                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Branch Administrator</span>
                            </div>
                        </div>
                        <div style={{ padding: '12px 14px', background: '#FFFFFF', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #E2E8F0' }}>
                            <span style={{ color: '#64748B' }}>System Sync:</span>
                            <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: 6, height: 6, background: '#10B981', borderRadius: '50%' }}></div> Active
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default StaffDashboard;
