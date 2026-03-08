import React, { useState } from 'react';
import { Search, DollarSign, Filter, Receipt, FileText, CheckCircle2, Clock, Calendar, TrendingUp } from 'lucide-react';
import '../styles/Payments.css';

const Payments = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const paymentsList = [
        { id: 'PAY-8001', memberId: 'M-1024', name: 'Arjun Perera', amount: 'LKR 4,500', date: '2026-03-04', status: 'Completed', type: 'Monthly', method: 'Cash' },
        { id: 'PAY-8002', memberId: 'M-1056', name: 'Sarah Mendis', amount: 'LKR 45,000', date: '2026-03-04', status: 'Completed', type: 'Annual', method: 'Card' },
        { id: 'PAY-8003', memberId: 'M-1089', name: 'Dilshan Silva', amount: 'LKR 12,000', date: '2026-03-03', status: 'Pending', type: 'Quarterly', method: 'Online' },
        { id: 'PAY-8004', memberId: 'M-1102', name: 'Anjali Gunawardena', amount: 'LKR 4,500', date: '2026-03-02', status: 'Completed', type: 'Monthly', method: 'Card' },
        { id: 'PAY-8005', memberId: 'M-1128', name: 'Nirosha Fernando', amount: 'LKR 4,500', date: '2026-03-02', status: 'Completed', type: 'Monthly', method: 'Cash' },
        { id: 'PAY-8006', memberId: 'M-1142', name: 'Damith Perera', amount: 'LKR 12,000', date: '2026-03-01', status: 'Pending', type: 'Quarterly', method: 'Online' },
        { id: 'PAY-8007', memberId: 'M-1156', name: 'Priyanka Jayasuriya', amount: 'LKR 45,000', date: '2026-02-28', status: 'Completed', type: 'Annual', method: 'Card' },
        { id: 'PAY-8008', memberId: 'M-1170', name: 'Ruwan Kumara', amount: 'LKR 4,500', date: '2026-02-28', status: 'Completed', type: 'Monthly', method: 'Cash' },
        { id: 'PAY-8009', memberId: 'M-1201', name: 'Ishara Madushanka', amount: 'LKR 12,000', date: '2026-02-27', status: 'Completed', type: 'Quarterly', method: 'Online' },
        { id: 'PAY-8010', memberId: 'M-1230', name: 'Sanduni Perera', amount: 'LKR 4,500', date: '2026-02-26', status: 'Completed', type: 'Monthly', method: 'Card' },
    ];

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>Payment Management</h1>
                    <p>Track membership revenue, renewals, and financial transactions.</p>
                </div>
                <div className="sa-actions">
                    <button className="icon-btn-light" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={18} /> Last 7 Days
                    </button>
                    <button className="icon-btn" style={{ background: '#1E3A5F', color: '#fff', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DollarSign size={18} /> Financial Reports
                    </button>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '32px' }}>
                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><DollarSign size={20} /></div>
                        <div>
                            <span className="label">Monthly Revenue</span>
                            <h2 className="value">LKR 1,240,000</h2>
                            <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 'bold' }}>+8% from last month</div>
                        </div>
                    </div>
                </div>
                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Receipt size={20} /></div>
                        <div>
                            <span className="label">Transactions</span>
                            <h2 className="value">284</h2>
                            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Avg LKR 4,360 / txn</div>
                        </div>
                    </div>
                </div>
                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><Clock size={20} /></div>
                        <div>
                            <span className="label">Pending Fees</span>
                            <h2 className="value">12 Items</h2>
                            <div style={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 'bold' }}>Action required</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="sa-card">
                <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '50%' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input
                                type="text"
                                placeholder="Search payments by member name or invoice ID..."
                                style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button className="action-btn-light" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Filter size={16} /> Filter
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'left' }}>
                                <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px' }}>Invoice</th>
                                <th style={{ padding: '12px 16px' }}>Member</th>
                                <th style={{ padding: '12px 16px' }}>Plan</th>
                                <th style={{ padding: '12px 16px' }}>Amount</th>
                                <th style={{ padding: '12px 16px' }}>Status</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', borderRadius: '0 8px 8px 0' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentsList.filter(p =>
                                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                p.id.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((payment, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#334155', fontSize: '0.85rem' }}>{payment.id}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '0.9rem' }}>{payment.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{payment.memberId}</div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#334155' }}>{payment.type}</td>
                                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#10B981', fontSize: '0.85rem' }}>{payment.amount}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            background: payment.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: payment.status === 'Completed' ? '#10B981' : '#F59E0B',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {payment.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                            <FileText size={14} style={{ marginRight: '6px' }} /> Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
