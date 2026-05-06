import React, { useState, useEffect } from 'react';
import { Search, Filter, Phone, Mail, CheckCircle2, XCircle, Eye, Trash2 } from 'lucide-react';
import '../styles/MembersManagement.css';

const MembersManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [membersList, setMembersList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/members', {
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
        if (!window.confirm('Delete member?')) return;
        const token = sessionStorage.getItem('admin_token');
        try {
            const response = await fetch(`http://localhost:5000/api/members/${id}`, {
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
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>Members Management</h1>
                    <p>Manage branch members, subscriptions, and profiles.</p>
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
                            {isLoading ? (
                                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>Loading members...</td></tr>
                            ) : membersList.filter(m =>
                                (m.firstName + ' ' + m.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (m._id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (m.phone || '').includes(searchTerm)
                            ).map((member) => (
                                <tr key={member._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {member.firstName?.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '0.9rem' }}>{member.firstName} {member.lastName}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{member._id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} color="#94A3B8" /> {member.phone}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} color="#94A3B8" /> {member.email}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#334155' }}>{member.subscriptionType || member.type}</span>
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
                                        {member.expireDate?.split('T')[0] || member.expire}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                                <Eye size={14} style={{ marginRight: '6px' }} /> View
                                            </button>
                                            <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#EF4444' }} onClick={() => handleDelete(member._id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
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

export default MembersManagement;
