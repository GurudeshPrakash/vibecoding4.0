import React, { useState } from 'react';
import { Search, Filter, Plus, User, Mail, Phone, MapPin, MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';
import '../../style/AdminDashboard.css';

const Members = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const membersList = [
        { id: 'M-001', name: 'John Doe', email: 'john@example.com', phone: '077 123 4567', type: 'AC', status: 'Active', expire: '2026-08-15' },
        { id: 'M-002', name: 'Jane Smith', email: 'jane@example.com', phone: '077 234 5678', type: 'Non-AC', status: 'Active', expire: '2026-11-20' },
        { id: 'M-003', name: 'Mike Ross', email: 'mike@example.com', phone: '077 345 6789', type: 'AC', status: 'Expired', expire: '2026-02-10' },
        { id: 'M-004', name: 'Rachel Zane', email: 'rachel@example.com', phone: '077 456 7890', type: 'AC', status: 'Active', expire: '2027-01-05' },
    ];

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>Member Directory</h1>
                    <p>Manage branch members, subscriptions, and profiles.</p>
                </div>
                <div className="sa-actions">
                    <button className="btn-approve" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> New Member
                    </button>
                </div>
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
                            {membersList.map((member, idx) => (
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
                                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                                            <MoreHorizontal size={20} />
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

export default Members;
