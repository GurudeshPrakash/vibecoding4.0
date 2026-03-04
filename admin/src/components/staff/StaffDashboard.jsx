import React from 'react';
import { Users, Activity, CheckSquare, DollarSign, Clock, UserCheck, UserPlus, CreditCard, ChevronRight } from 'lucide-react';
import '../../style/AdminDashboard.css';

const StaffDashboard = () => {
    const todayCheckins = [
        { id: 'M-1024', name: 'Arjun Perera', time: '08:15 AM', status: 'Checked In' },
        { id: 'M-1056', name: 'Sarah Mendis', time: '08:45 AM', status: 'Checked In' },
        { id: 'M-1089', name: 'Dilshan Silva', time: '09:05 AM', status: 'Checked In' },
        { id: 'M-1102', name: 'Anjali Gunawardena', time: '09:30 AM', status: 'Checked In' },
        { id: 'M-1115', name: 'Kasun Rajapaksa', time: '10:00 AM', status: 'Checked Out' },
        { id: 'M-1128', name: 'Nirosha Fernando', time: '10:15 AM', status: 'Checked In' },
    ];

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>Staff Dashboard</h1>
                    <p>Welcome to your daily shift overview. Have a great day!</p>
                </div>
                <div className="sa-actions">
                    <div className="date-time-display">
                        <Clock size={18} />
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Users /></div>
                    <div className="card-data">
                        <span className="label">Total Members</span>
                        <h2 className="value">842</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><UserCheck /></div>
                    <div className="card-data">
                        <span className="label">Active Members</span>
                        <h2 className="value">756</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><Activity /></div>
                    <div className="card-data">
                        <span className="label">Today Check-ins</span>
                        <h2 className="value">124</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><DollarSign /></div>
                    <div className="card-data">
                        <span className="label">Pending Payments</span>
                        <h2 className="value">18</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}><CheckSquare /></div>
                    <div className="card-data">
                        <span className="label">Total Equipment</span>
                        <h2 className="value">64</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><Clock /></div>
                    <div className="card-data">
                        <span className="label">Equipment Under Maintenance</span>
                        <h2 className="value">03</h2>
                    </div>
                </div>
            </section>

            <div className="branch-grid" style={{ gridTemplateColumns: '1fr' }}>
                <main className="sa-analytics-col" style={{ gridColumn: '1 / -1' }}>
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Recent Check-ins</h3>
                        </div>
                        <div className="table-responsive" style={{ padding: '0 20px 20px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'left' }}>
                                        <th style={{ padding: '12px 8px' }}>Member ID</th>
                                        <th style={{ padding: '12px 8px' }}>Name</th>
                                        <th style={{ padding: '12px 8px' }}>Time</th>
                                        <th style={{ padding: '12px 8px' }}>Status</th>
                                        <th style={{ padding: '12px 8px', textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todayCheckins.map((checkin, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '12px 8px', fontWeight: '600', color: '#334155' }}>{checkin.id}</td>
                                            <td style={{ padding: '12px 8px', color: '#1E293B' }}>{checkin.name}</td>
                                            <td style={{ padding: '12px 8px', color: '#64748B' }}>{checkin.time}</td>
                                            <td style={{ padding: '12px 8px' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    background: checkin.status === 'Checked In' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: checkin.status === 'Checked In' ? '#10B981' : '#F59E0B'
                                                }}>
                                                    {checkin.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                                                <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><ChevronRight size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StaffDashboard;
