import React, { useState } from 'react';
import { Search, Filter, Plus, User, Mail, Phone, MapPin, MoreHorizontal, CheckCircle2, XCircle, Eye } from 'lucide-react';
import '../../style/AdminDashboard.css';

const Members = ({ userRole = 'staff' }) => {
    const isPowerUser = userRole === 'admin' || userRole === 'super_admin';
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', type: 'Monthly', status: 'Active' });

    const [members, setMembers] = useState([
        { id: 'M-1024', name: 'Arjun Perera', email: 'arjun.p@example.com', phone: '077 123 4567', type: 'Monthly', status: 'Active', enrollDate: '2026-01-10', expire: '2026-03-10' },
        { id: 'M-1056', name: 'Sarah Mendis', email: 'sarah.m@example.com', phone: '071 234 5678', type: 'Annual', status: 'Active', enrollDate: '2025-11-20', expire: '2026-11-20' },
        { id: 'M-1089', name: 'Dilshan Silva', email: 'dilshan.s@example.com', phone: '076 345 6789', type: 'Quarterly', status: 'Active', enrollDate: '2025-12-15', expire: '2026-03-15' },
        { id: 'M-1102', name: 'Anjali Gunawardena', email: 'anjali@example.com', phone: '072 456 7890', type: 'Monthly', status: 'Active', enrollDate: '2026-02-05', expire: '2026-03-05' },
        { id: 'M-1115', name: 'Kasun Rajapaksa', email: 'kasun.r@example.com', phone: '075 567 8901', type: 'Annual', status: 'Expired', enrollDate: '2025-02-10', expire: '2026-02-10' },
        { id: 'M-1128', name: 'Nirosha Fernando', email: 'nirosha@example.com', phone: '070 678 9012', type: 'Monthly', status: 'Active', enrollDate: '2026-02-15', expire: '2026-03-15' },
        { id: 'M-1142', name: 'Damith Perera', email: 'damith@example.com', phone: '077 789 0123', type: 'Quarterly', status: 'Active', enrollDate: '2026-01-05', expire: '2026-04-05' },
        { id: 'M-1156', name: 'Priyanka Jayasuriya', email: 'priyanka@example.com', phone: '071 890 1234', type: 'Annual', status: 'Active', enrollDate: '2025-10-20', expire: '2026-10-20' }
    ]);

    const handleSave = (e) => {
        e.preventDefault();
        if (editingMember) {
            setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...formData } : m));
        } else {
            const newMember = {
                ...formData,
                id: `M-${Math.floor(1000 + Math.random() * 9000)}`,
                enrollDate: new Date().toISOString().split('T')[0],
                expire: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
            setMembers([...members, newMember]);
        }
        setShowModal(false);
        setEditingMember(null);
        setFormData({ name: '', email: '', phone: '', type: 'Monthly', status: 'Active' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this member?')) {
            setMembers(members.filter(m => m.id !== id));
        }
    };

    const openEdit = (member) => {
        setEditingMember(member);
        setFormData({ name: member.name, email: member.email, phone: member.phone, type: member.type, status: member.status });
        setShowModal(true);
    };

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>Members</h1>
                    <p>Manage branch members, subscriptions, and profiles.</p>
                </div>
                {isPowerUser && (
                    <div className="sa-actions">
                        <button className="btn-approve" onClick={() => { setEditingMember(null); setFormData({ name: '', email: '', phone: '', type: 'Monthly', status: 'Active' }); setShowModal(true); }}>
                            <Plus size={18} /> Add Member
                        </button>
                    </div>
                )}
            </header>

            <div className="sa-card">
                <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '50%' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input
                                type="text"
                                placeholder="Search members by name, ID, or phone..."
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
                                <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px' }}>Member</th>
                                <th style={{ padding: '12px 16px' }}>Contact</th>
                                <th style={{ padding: '12px 16px' }}>Package</th>
                                <th style={{ padding: '12px 16px' }}>Status</th>
                                <th style={{ padding: '12px 16px' }}>Expiration</th>
                                <th style={{ padding: '12px 16px', borderRadius: '0 8px 8px 0', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.filter(m =>
                                m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                m.phone.includes(searchTerm)
                            ).map((member, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '0.9rem' }}>{member.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{member.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} color="#94A3B8" /> {member.phone}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} color="#94A3B8" /> {member.email}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#334155' }}>{member.type}</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            background: member.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: member.status === 'Active' ? '#10B981' : '#EF4444',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {member.status === 'Active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {member.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748B' }}>
                                        {member.expire}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { }}>
                                                <Eye size={14} /> View
                                            </button>
                                            {isPowerUser && (
                                                <>
                                                    <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#3B82F6' }} onClick={() => openEdit(member)}>
                                                        Edit
                                                    </button>
                                                    <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#EF4444' }} onClick={() => handleDelete(member.id)}>
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

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '24px' }}>
                        <h3 style={{ marginTop: 0 }}>{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Email</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Phone</label>
                                <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#EF4444', color: '#fff', fontWeight: 600 }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Members;
