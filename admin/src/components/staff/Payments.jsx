import React, { useState } from 'react';
import { Search, DollarSign, Filter, Receipt, FileText, CheckCircle2, Clock } from 'lucide-react';
import '../../style/AdminDashboard.css';

const Payments = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const paymentsList = [
        { id: 'PAY-1001', memberId: 'M-001', name: 'John Doe', amount: 'LKR 5,000', date: '2026-03-04', status: 'Completed', type: 'Monthly Fee' },
        { id: 'PAY-1002', memberId: 'M-015', name: 'Sarah Connor', amount: 'LKR 15,000', date: '2026-03-04', status: 'Pending', type: 'Annual Renewal' },
        { id: 'PAY-1003', memberId: 'M-042', name: 'Bruce Wayne', amount: 'LKR 2,500', date: '2026-03-03', status: 'Completed', type: 'Personal Training ' },
        { id: 'PAY-1004', memberId: 'M-008', name: 'Clark Kent', amount: 'LKR 5,000', date: '2026-03-02', status: 'Overdue', type: 'Monthly Fee' },
    ];

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>Payments & Billing</h1>
                    <p>Process member payments, renewals, and view transaction history.</p>
                </div>
                <div className="sa-actions">
                    <button className="btn-approve" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DollarSign size={18} /> Process Payment
                    </button>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '32px' }}>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><DollarSign /></div>
                    <div className="card-data">
                        <span className="label">Today's Revenue</span>
                        <h2 className="value">LKR 25,500</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><Clock /></div>
                    <div className="card-data">
                        <span className="label">Pending Collections</span>
                        <h2 className="value">LKR 45,000</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Receipt /></div>
                    <div className="card-data">
                        <span className="label">Transactions Today</span>
                        <h2 className="value">14</h2>
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
                                placeholder="Search by Invoice ID, Member ID, or Name..."
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
                                <th style={{ padding: '12px 16px' }}>Description</th>
                                <th style={{ padding: '12px 16px' }}>Date</th>
                                <th style={{ padding: '12px 16px' }}>Status</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', borderRadius: '0 8px 8px 0' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentsList.map((payment, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#334155' }}>
                                        {payment.id}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '600', color: '#1E293B' }}>{payment.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{payment.memberId}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '500', color: '#334155' }}>{payment.type}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 'bold' }}>{payment.amount}</div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748B' }}>
                                        {payment.date}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            background: payment.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' :
                                                payment.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: payment.status === 'Completed' ? '#10B981' :
                                                payment.status === 'Pending' ? '#F59E0B' : '#EF4444',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {payment.status === 'Completed' && <CheckCircle2 size={12} />}
                                            {payment.status === 'Pending' && <Clock size={12} />}
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                            <FileText size={14} style={{ marginRight: '6px' }} /> View
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
