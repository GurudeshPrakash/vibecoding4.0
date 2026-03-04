import React from 'react';
import { Users, Activity, CheckSquare, DollarSign, Clock, UserCheck, UserPlus, CreditCard, ChevronRight } from 'lucide-react';
import '../../style/AdminDashboard.css';

const StaffDashboard = () => {
    const todayCheckins = [
        { id: 'M-001', name: 'John Doe', time: '08:30 AM', status: 'Checked In' },
        { id: 'M-002', name: 'Jane Smith', time: '09:15 AM', status: 'Checked In' },
        { id: 'M-003', name: 'Mike Ross', time: '09:45 AM', status: 'Checked Out' },
        { id: 'M-004', name: 'Rachel Zane', time: '10:00 AM', status: 'Checked In' },
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

            <section className="sa-summary-grid" style={{ marginBottom: '32px' }}>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><UserCheck /></div>
                    <div className="card-data">
                        <span className="label">Today's Check-ins</span>
                        <h2 className="value">145</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><Activity /></div>
                    <div className="card-data">
                        <span className="label">Currently Active</span>
                        <h2 className="value">42</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><UserPlus /></div>
                    <div className="card-data">
                        <span className="label">New Registrations</span>
                        <h2 className="value">08</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><CreditCard /></div>
                    <div className="card-data">
                        <span className="label">Pending Payments</span>
                        <h2 className="value">12</h2>
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
