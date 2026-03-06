import React, { useState } from 'react';
import { Search, DollarSign, Filter, Receipt, FileText, CheckCircle2, Clock } from 'lucide-react';
import '../../style/staff/StaffDashboard.css';

const Payments = ({ userRole = 'staff' }) => {
    const isPowerUser = userRole === 'admin' || userRole === 'super_admin';
    const [searchTerm, setSearchTerm] = useState('');

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);
    const [formData, setFormData] = useState({ memberId: '', name: '', amount: '', type: 'Monthly', method: 'Cash' });

    const [payments, setPayments] = useState([
        { id: 'PAY-8001', memberId: 'M-1024', name: 'Arjun Perera', amount: 'LKR 4,500', date: '2026-03-04', status: 'Completed', type: 'Monthly', method: 'Cash' },
        { id: 'PAY-8002', memberId: 'M-1056', name: 'Sarah Mendis', amount: 'LKR 45,000', date: '2026-03-04', status: 'Completed', type: 'Annual', method: 'Card' },
        { id: 'PAY-8003', memberId: 'M-1089', name: 'Dilshan Silva', amount: 'LKR 12,000', date: '2026-03-03', status: 'Pending', type: 'Quarterly', method: 'Online' },
        { id: 'PAY-8004', memberId: 'M-1102', name: 'Anjali Gunawardena', amount: 'LKR 4,500', date: '2026-03-02', status: 'Completed', type: 'Monthly', method: 'Card' },
        { id: 'PAY-8005', memberId: 'M-1128', name: 'Nirosha Fernando', amount: 'LKR 4,500', date: '2026-03-02', status: 'Completed', type: 'Monthly', method: 'Cash' }
    ]);

    const handleProcessPayment = (e) => {
        e.preventDefault();
        if (editingPayment) {
            setPayments(payments.map(p => p.id === editingPayment.id ? { ...p, ...formData, amount: `LKR ${formData.amount}` } : p));
        } else {
            const newPayment = {
                id: `PAY-${Math.floor(8000 + Math.random() * 1000)}`,
                ...formData,
                amount: `LKR ${formData.amount}`,
                date: new Date().toISOString().split('T')[0],
                status: 'Completed'
            };
            setPayments([newPayment, ...payments]);
        }
        setPaymentSuccess(true);
        setTimeout(() => {
            setShowPaymentModal(false);
            setPaymentSuccess(false);
            setEditingPayment(null);
            setFormData({ memberId: '', name: '', amount: '', type: 'Monthly', method: 'Cash' });
        }, 1500);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this transaction record?')) {
            setPayments(payments.filter(p => p.id !== id));
        }
    };

    const openEdit = (payment) => {
        setEditingPayment(payment);
        setFormData({
            memberId: payment.memberId,
            name: payment.name,
            amount: payment.amount.replace('LKR ', '').replace(',', ''),
            type: payment.type,
            method: payment.method
        });
        setShowPaymentModal(true);
    };

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>Payments</h1>
                    <p>Process member payments, renewals, and view transaction history.</p>
                </div>
                <div className="sa-actions">
                    <button
                        onClick={() => { setEditingPayment(null); setFormData({ memberId: '', name: '', amount: '', type: 'Monthly', method: 'Cash' }); setShowPaymentModal(true); }}
                        className="btn-approve"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
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
                        <h2 className="value">{payments.length}</h2>
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
                            {payments.filter(p =>
                                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                p.memberId.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((payment, idx) => (
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
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { }}>
                                                <FileText size={14} /> View
                                            </button>
                                            {isPowerUser && (
                                                <>
                                                    <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#3B82F6' }} onClick={() => openEdit(payment)}>
                                                        Edit
                                                    </button>
                                                    <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#EF4444' }} onClick={() => handleDelete(payment.id)}>
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Process Payment Modal */}
            {showPaymentModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#1E293B', fontSize: '0.85rem' }}>{editingPayment ? 'Edit Payment Record' : 'Process New Payment'}</h3>
                            <button onClick={() => setShowPaymentModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            {paymentSuccess ? (
                                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                    <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: '16px' }} />
                                    <h4 style={{ color: '#1E293B', marginBottom: '8px' }}>{editingPayment ? 'Entry Updated!' : 'Payment Successful!'}</h4>
                                    <p style={{ color: '#64748B', fontSize: '0.75rem' }}>The transaction has been recorded and updated.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleProcessPayment}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>Member Name</label>
                                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Search member..." required style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.75rem' }} />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>Member ID</label>
                                        <input type="text" value={formData.memberId} onChange={e => setFormData({ ...formData, memberId: e.target.value })} placeholder="M-XXXX" required style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.75rem' }} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>Amount (LKR)</label>
                                            <input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" required style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.75rem' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>Payment Mode</label>
                                            <select value={formData.method} onChange={e => setFormData({ ...formData, method: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.75rem', background: '#fff' }}>
                                                <option>Cash</option>
                                                <option>Card</option>
                                                <option>Online Transfer</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button type="button" onClick={() => setShowPaymentModal(false)} style={{ flex: 1, padding: '12px', background: '#F1F5F9', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#64748B', fontSize: '0.75rem' }}>Cancel</button>
                                        <button type="submit" style={{ flex: 2, padding: '12px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.75rem' }}>{editingPayment ? 'Update' : 'Confirm Payment'}</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
