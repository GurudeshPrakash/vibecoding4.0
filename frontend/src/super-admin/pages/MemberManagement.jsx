import React, { useState, useEffect } from 'react';
import { Search, Filter, User, Mail, Phone, MapPin, CheckCircle2, XCircle, Eye, Download, Users, Trash2 } from 'lucide-react';
import '../styles/MemberManagement.css';

const MemberManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [membersList, setMembersList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/admin/owners', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMembersList(data);
            }
        } catch (error) {
            console.error('Failed to fetch members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this member?')) return;
        const token = sessionStorage.getItem('admin_token');
        try {
            const response = await fetch(`http://localhost:5000/api/admin/owners/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchMembers();
            }
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };

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
                            placeholder="Search by name, ID, or gym..."
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
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{membersList.length}</h2>
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
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{membersList.filter(m => m.status === 'Active').length}</h2>
                        </div>
                    </div>
                </div>
                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', margin: 0 }}>
                            <XCircle size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Inactive</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{membersList.filter(m => m.status === 'Inactive').length}</h2>
                        </div>
                    </div>
                </div>
            </section>

            <div className="sa-card" style={{ padding: '0', overflow: 'hidden' }}>
                {isLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading members...</div>
                ) : (
                <div className="sa-table-container">
                    <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--color-red)' }}>
                                <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Member Name</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Owned Gym</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Contact</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Partner Since</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membersList.filter(m =>
                                (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (m.ownedGym || '').toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((member) => (
                                <tr key={member._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,0,0,0.05)', color: 'var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                                {member.name?.charAt(0) || 'M'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>{member.name}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)' }}>{member._id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>{member.ownedGym || 'N/A'}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12} color="var(--color-text-dim)" /> {member.phone}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={12} color="var(--color-text-dim)" /> {member.email}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700 }}>{member.partnerSince || 'N/A'}</td>
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
                                            {(member.status || 'Active').toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button className="icon-btn" title="View Profile"><Eye size={16} /></button>
                                            <button className="icon-btn" title="Delete Member" style={{ color: '#EF4444' }} onClick={() => handleDelete(member._id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>
        </div>
    );
};

export default MemberManagement;
