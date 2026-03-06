import React from 'react';
import { Calendar, Download, TrendingUp, Users, CreditCard, Activity, BarChart3, PieChart as PieChartIcon, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const SuperAdminReports = () => {
    const revenueTrend = [
        { name: 'Jan', revenue: 1.2, members: 420 },
        { name: 'Feb', revenue: 1.5, members: 450 },
        { name: 'Mar', revenue: 1.8, members: 480 },
        { name: 'Apr', revenue: 2.1, members: 510 },
        { name: 'May', revenue: 2.4, members: 540 },
        { name: 'Jun', revenue: 2.8, members: 580 },
    ];

    const branchPerformance = [
        { subject: 'Colombo', A: 120, B: 110, fullMark: 150 },
        { subject: 'Kandy', A: 98, B: 130, fullMark: 150 },
        { subject: 'Galle', A: 86, B: 130, fullMark: 150 },
        { subject: 'Negombo', A: 99, B: 100, fullMark: 150 },
        { subject: 'Jaffna', A: 85, B: 90, fullMark: 150 },
    ];

    const stats = [
        { label: 'Network Revenue', value: 'LKR 12.5M', change: '+18.2%', up: true, icon: <CreditCard size={20} /> },
        { label: 'Member Retention', value: '92.4%', change: '+2.4%', up: true, icon: <Users size={20} /> },
        { label: 'Operational Costs', value: 'LKR 4.2M', change: '-5.1%', up: true, icon: <Activity size={20} /> },
        { label: 'Inquiry Conversion', value: '68%', change: '+12%', up: true, icon: <BarChart3 size={20} /> },
    ];

    return (
        <div className="super-admin-dashboard">
            <header className="sa-header">
                <div className="sa-welcome">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>Network Intelligence</h1>
                    <p style={{ margin: 0, marginTop: '4px' }}>Strategic insights and performance metrics across all 24 branches.</p>
                </div>

                <div className="sa-actions">
                    <button className="icon-btn-light" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'white', fontWeight: 700, fontSize: '0.8rem' }}>
                        <Calendar size={18} color="var(--color-red)" /> Q2 - 2026
                    </button>
                    <button className="icon-btn" style={{ background: 'var(--color-red)', color: 'white', padding: '10px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,0,0,0.2)' }}>
                        <Download size={18} /> Export Analytics
                    </button>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '32px' }}>
                {stats.map((s, idx) => (
                    <div key={idx} className="sa-stat-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div className="icon-circle" style={{ background: 'rgba(255,0,0,0.05)', color: 'var(--color-red)', margin: 0, width: 44, height: 44 }}>{s.icon}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: s.up ? '#10B981' : '#EF4444', fontWeight: 800, fontSize: '0.7rem' }}>
                                {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {s.change}
                            </div>
                        </div>
                        <span className="label" style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', fontWeight: 700 }}>{s.label}</span>
                        <h2 className="value" style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 900 }}>{s.value}</h2>
                    </div>
                ))}
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div className="sa-card" style={{ padding: '32px' }}>
                    <div className="sa-card-header" style={{ marginBottom: '32px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Revenue Infrastructure</h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>Forecasting based on current membership growth.</p>
                        </div>
                    </div>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrend}>
                                <defs>
                                    <linearGradient id="premiumRed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-red)" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="var(--color-red)" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--color-text-dim)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--color-text-dim)' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 700 }} />
                                <Area type="monotone" dataKey="revenue" stroke="var(--color-red)" strokeWidth={4} fillOpacity={1} fill="url(#premiumRed)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="sa-card" style={{ padding: '32px' }}>
                    <div className="sa-card-header" style={{ marginBottom: '32px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Regional Performance</h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>Branch-wise efficiency comparison.</p>
                        </div>
                    </div>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={branchPerformance}>
                                <PolarGrid stroke="rgba(0,0,0,0.05)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 800 }} />
                                <Radar name="Performance" dataKey="A" stroke="var(--color-red)" fill="var(--color-red)" fillOpacity={0.6} />
                                <Radar name="Growth" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="sa-card" style={{ padding: '32px' }}>
                <div className="sa-card-header" style={{ marginBottom: '24px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Automated Insight Logs</h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>AI-generated observations and system reports.</p>
                    </div>
                    <button style={{ border: 'none', background: 'transparent', color: 'var(--color-red)', fontWeight: 800, fontSize: '0.75rem', padding: '8px 16px', cursor: 'pointer' }}>Generate Full Report</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {[
                        { title: 'Quarterly Revenue Spike', desc: 'Predicting a 22% increase in Colombo region for Q3.', time: 'Generated 2h ago', level: 'High' },
                        { title: 'Membership Churn Risk', desc: 'Slight increase in churn at Galle branch detected.', time: 'Generated 5h ago', level: 'Medium' },
                        { title: 'New Market Potential', desc: 'Region Jaffna showing high interest in premium plans.', time: 'Generated Yesterday', level: 'Action Required' },
                        { title: 'Inventory Efficiency', desc: 'Equipment lifespan in Kandy branch exceeds average.', time: 'Generated Yesterday', level: 'Low' },
                    ].map((report, idx) => (
                        <div key={idx} style={{ padding: '20px', background: 'rgba(0,0,0,0.015)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'white', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText size={20} color="var(--color-text-dim)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>{report.title}</h4>
                                    <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', color: report.level === 'High' ? 'var(--color-red)' : '#64748B' }}>{report.level}</span>
                                </div>
                                <p style={{ margin: '0 0 6px 0', fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 500 }}>{report.desc}</p>
                                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', fontWeight: 700 }}>{report.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuperAdminReports;
