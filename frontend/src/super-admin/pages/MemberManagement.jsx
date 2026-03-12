import React, { useState } from 'react';
import { Search, Filter, User, Mail, Phone, MapPin, CheckCircle2, XCircle, Eye, Download, Users } from 'lucide-react';
import '../styles/MemberManagement.css';

const MemberManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const membersList = [
        { id: 'M-1024', name: 'Arjun Perera', email: 'arjun.p@example.com', phone: '077 123 4567', type: 'Monthly', status: 'Active', branch: 'Colombo City Gym', enrollDate: '2026-01-10', expire: '2026-03-10' },
        { id: 'M-1056', name: 'Sarah Mendis', email: 'sarah.m@example.com', phone: '071 234 5678', type: 'Annual', status: 'Active', branch: 'Kandy Fitness Center', enrollDate: '2025-11-20', expire: '2026-11-20' },
        { id: 'M-1089', name: 'Dilshan Silva', email: 'dilshan.s@example.com', phone: '076 345 6789', type: 'Quarterly', status: 'Active', branch: 'Galle Power Hub', enrollDate: '2025-12-15', expire: '2026-03-15' },
        { id: 'M-1102', name: 'Anjali Gunawardena', email: 'anjali@example.com', phone: '072 456 7890', type: 'Monthly', status: 'Active', branch: 'Negombo Fitness', enrollDate: '2026-02-05', expire: '2026-03-05' },
        { id: 'M-1115', name: 'Kasun Rajapaksa', email: 'kasun.r@example.com', phone: '075 567 8901', type: 'Annual', status: 'Expired', branch: 'Kurunegala Gym', enrollDate: '2025-02-10', expire: '2026-02-10' },
        { id: 'M-1128', name: 'Nirosha Fernando', email: 'nirosha@example.com', phone: '070 678 9012', type: 'Monthly', status: 'Active', branch: 'Matara Fitness Hub', enrollDate: '2026-02-15', expire: '2026-03-15' },
    ];

    return (
        <div className="super-admin-dashboard">
            <header className="sa-header">
                <div className="sa-welcome">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>Member Management</h1>
                    <p style={{ margin: 0, marginTop: '4px' }}>Network-wide member directory and subscription monitoring.</p>
                </div>

                <div className="sa-actions">
                    <button className="icon-btn" style={{ background: 'var(--color-red)', color: 'white' }} title="Export Member Data">
                        <Download size={22} />
                    </button>
                    <div className="sa-search-bar" style={{ width: '350px' }}>
                        <Search className="sa-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or branch..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '24px' }}>
                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000', margin: 0 }}>
                            <Users size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Total Members</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>4,850</h2>
                        </div>
                    </div>
                </div>
                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', margin: 0 }}>
                            <CheckCircle2 size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Active Members</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>4,200</h2>
                        </div>
                    </div>
                </div>
                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', margin: 0 }}>
                            <XCircle size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Expired Subscriptions</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>650</h2>
                        </div>
                    </div>
                </div>
            </section>

            <div className="sa-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div className="sa-table-container">
                    <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--color-red)' }}>
                                <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Member Name</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Branch</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Contact</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Plan</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membersList.filter(m =>
                                m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                m.branch.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((member, idx) => (
                                <tr key={member.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,0,0,0.05)', color: 'var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>{member.name}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)' }}>{member.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>{member.branch}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12} color="var(--color-text-dim)" /> {member.phone}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={12} color="var(--color-text-dim)" /> {member.email}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700 }}>{member.type}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.65rem',
                                            fontWeight: '800',
                                            background: member.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: member.status === 'Active' ? '#10B981' : '#EF4444',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                                            {member.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <button className="icon-btn" title="View Profile"><Eye size={16} /></button>
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

export default MemberManagement;
