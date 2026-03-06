import React, { useState } from 'react';
import { Calendar, Download, Filter, TrendingUp, Users, Package, CreditCard, ChevronRight, FileText, PieChart, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import '../styles/Reports.css';

const Reports = () => {
    const revenueData = [
        { month: 'Jan', revenue: 450000, members: 420 },
        { month: 'Feb', revenue: 520000, members: 450 },
        { month: 'Mar', revenue: 480000, members: 460 },
        { month: 'Apr', revenue: 610000, members: 510 },
        { month: 'May', revenue: 590000, members: 530 },
        { month: 'Jun', revenue: 720000, members: 580 },
    ];

    const attendanceData = [
        { day: 'Mon', count: 120 },
        { day: 'Tue', count: 145 },
        { day: 'Wed', count: 132 },
        { day: 'Thu', count: 110 },
        { day: 'Fri', count: 165 },
        { day: 'Sat', count: 190 },
        { day: 'Sun', count: 140 },
    ];

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>System Reports & Analytics</h1>
                    <p>Financial performance, member growth, and operational insights.</p>
                </div>
                <div className="sa-actions">
                    <button className="icon-btn-light" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={18} /> Last 30 Days
                    </button>
                    <button className="icon-btn" style={{ background: '#1E3A5F', color: '#fff', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={18} /> Export Data
                    </button>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '32px' }}>
                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><CreditCard size={20} /></div>
                        <div>
                            <span className="label">Total Revenue</span>
                            <h2 className="value">LKR 3,370,000</h2>
                            <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <TrendingUp size={12} /> +12% from last month
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><Users size={20} /></div>
                        <div>
                            <span className="label">Active Members</span>
                            <h2 className="value">2,845</h2>
                            <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <TrendingUp size={12} /> +5.2% grow rate
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><Activity size={20} /></div>
                        <div>
                            <span className="label">Daily Check-ins</span>
                            <h2 className="value">412</h2>
                            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Peak time: 5 PM - 8 PM</div>
                        </div>
                    </div>
                </div>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="sa-card">
                    <div className="sa-card-header">
                        <h3>Revenue Growth</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="action-btn-xs active">Weekly</button>
                            <button className="action-btn-xs">Monthly</button>
                        </div>
                    </div>
                    <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="sa-card">
                    <div className="sa-card-header">
                        <h3>Daily Attendance</h3>
                        <Activity size={18} color="#94A3B8" />
                    </div>
                    <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <BarChart data={attendanceData}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                <YAxis axisLine={false} tickLine={false} hide />
                                <Tooltip />
                                <Bar dataKey="count" fill="#1E3A5F" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="sa-card">
                <div className="sa-card-header">
                    <h3>Operational Logs</h3>
                    <button className="action-btn-light" style={{ fontSize: '0.75rem' }}>View All</button>
                </div>
                <div style={{ marginTop: '16px' }}>
                    {[
                        { type: 'Service', desc: 'Maintenance completed for Bench #04 at Kandy branch', time: '2 hours ago', user: 'Staff: Kamal P.' },
                        { type: 'Inventory', desc: 'New Equipment Added: Commercial Treadmill Gen-X', time: '5 hours ago', user: 'Admin: Prakash S.' },
                        { type: 'Status', desc: 'Branch status changed: Colombo branch is now Active', time: 'Yesterday', user: 'System' },
                        { type: 'Reports', desc: 'Monthly summary report generated', time: 'Yesterday', user: 'System' },
                    ].map((log, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: idx === 3 ? 'none' : '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileText size={18} color="#64748B" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '0.85rem' }}>{log.desc}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{log.user} • {log.time}</div>
                                </div>
                            </div>
                            <ChevronRight size={16} color="#CBD5E1" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;
