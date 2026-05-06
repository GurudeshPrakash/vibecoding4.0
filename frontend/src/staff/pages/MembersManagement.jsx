/**
 * @module StaffModule
 * @status STABLE - LOCKED
 * @description This module is development-complete. Avoid modifications unless specifically requested.
 */
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, User, Mail, Phone, MapPin, MoreHorizontal, CheckCircle2, XCircle, Eye } from 'lucide-react';
import '../styles/MembersManagement.css';

const MembersManagement = ({ userRole = 'staff' }) => {
    const isPowerUser = userRole === 'admin' || userRole === 'super_admin';
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', type: 'Monthly', status: 'Active', branchId: '' });
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [branches, setBranches] = useState([]);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('admin_token') || localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/members', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMembers(data);
            }
        } catch (error) {
            console.error('Failed to fetch members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const token = sessionStorage.getItem('admin_token') || localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/branches', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBranches(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, branchId: data[0]._id }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch branches:', error);
        }
    };

    useEffect(() => {
        fetchMembers();
        fetchBranches();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('admin_token') || localStorage.getItem('token');
        const method = editingMember ? 'PUT' : 'POST';
        const url = editingMember 
            ? `http://localhost:5000/api/members/${editingMember._id}`
            : 'http://localhost:5000/api/members';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowModal(false);
                setEditingMember(null);
                setFormData({ firstName: '', lastName: '', email: '', phone: '', type: 'Monthly', status: 'Active', branchId: branches[0]?._id });
                fetchMembers();
            }
        } catch (error) {
            console.error('Error saving member:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this member?')) return;
        const token = sessionStorage.getItem('admin_token') || localStorage.getItem('token');
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

    const openEdit = (member) => {
        setEditingMember(member);
        setFormData({ 
            firstName: member.firstName, 
            lastName: member.lastName, 
            email: member.email, 
            phone: member.phone, 
            type: member.subscriptionType || member.type, 
            status: member.status,
            branchId: member.branchId?._id || member.branchId
        });
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
                            {isLoading ? (
                                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>Loading members...</td></tr>
                            ) : members.filter(m =>
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
                                            <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { }}>
                                                <Eye size={14} /> View
                                            </button>
                                            {isPowerUser && (
                                                <>
                                                    <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#3B82F6' }} onClick={() => openEdit(member)}>
                                                        Edit
                                                    </button>
                                                    <button className="action-btn-light" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#EF4444' }} onClick={() => handleDelete(member._id)}>
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600 }}>First Name</label>
                                    <input type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Last Name</label>
                                    <input type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Email</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Phone</label>
                                <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Branch</label>
                                <select value={formData.branchId} onChange={e => setFormData({ ...formData, branchId: e.target.value })} required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                    <option value="">Select Branch</option>
                                    {branches.map(b => (
                                        <option key={b._id} value={b._id}>{b.name}</option>
                                    ))}
                                </select>
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

export default MembersManagement;
