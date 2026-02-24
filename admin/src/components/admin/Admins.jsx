import React, { useState, useEffect } from 'react';
import { Phone, Mail, Search, Plus, Loader2, X, Trash2, Edit2, Shield, Eye, EyeOff, Users, ClipboardList } from 'lucide-react';
import '../../style/AdminGymOwners.css';
import AdminLogs from './AdminLogs';

const Admins = () => {
    const [viewTab, setViewTab] = useState('accounts');
    const [searchQuery, setSearchQuery] = useState('');
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', phone: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const fetchAdmins = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/admin/admins', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 403) {
                setAdmins({ error: 'Access Denied: Only Super Admins can view or manage Administrators.' });
            } else {
                const data = await response.json();
                if (response.ok) setAdmins(data);
            }
        } catch (error) {
            console.error('Fetch admins error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        const url = editingAdmin
            ? `http://localhost:5000/api/admin/admins/${editingAdmin._id}`
            : 'http://localhost:5000/api/admin/admins';
        const method = editingAdmin ? 'PUT' : 'POST';

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
                setEditingAdmin(null);
                setShowPassword(false);
                setFormData({
                    firstName: '', lastName: '', email: '', password: '', phone: ''
                });
                fetchAdmins();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to save admin');
            }
        } catch (error) {
            alert('Request failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this admin account?')) return;
        const token = localStorage.getItem('admin_token');
        try {
            const response = await fetch(`http://localhost:5000/api/admin/admins/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) fetchAdmins();
        } catch (error) {
            alert('Delete failed');
        }
    };

    const openEdit = (a) => {
        setEditingAdmin(a);
        setShowPassword(false);
        setFormData({
            firstName: a.firstName || '',
            lastName: a.lastName || '',
            email: a.email || '',
            password: '',
            phone: a.phone || ''
        });
        setShowModal(true);
    };

    const filteredAdmins = Array.isArray(admins) ? admins.filter(a =>
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    return (
        <div className="owners-view">
            <header className="content-header-search" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="header-titles">
                        <h1 className="page-title">Administrators</h1>
                        <p className="page-subtitle">Manage system administrators and monitor session logs.</p>
                    </div>
                </div>

                <div className="sub-menu-bar" style={{ width: '100%' }}>
                    <button className={`sub-menu-item ${viewTab === 'accounts' ? 'active' : ''}`} onClick={() => setViewTab('accounts')}>
                        <Users size={18} />
                        <span>Admin Accounts</span>
                    </button>
                    <button className={`sub-menu-item ${viewTab === 'logs' ? 'active' : ''}`} onClick={() => setViewTab('logs')}>
                        <ClipboardList size={18} />
                        <span>Activity Logs</span>
                    </button>
                </div>
            </header>

            {viewTab === 'accounts' ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '20px' }}>
                        <div className="search-box-container">
                            <Search className="search-icon-inside" size={20} />
                            <input
                                type="text"
                                placeholder="Search Admins..."
                                className="dynamic-search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <button className="btn-primary" onClick={() => { setEditingAdmin(null); setShowModal(true); }}>
                            <Plus size={18} /> New Admin
                        </button>
                    </div>

                    <div className="owners-grid animate-fade-in">
                        {isLoading ? (
                            <div style={{ padding: '100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                <Loader2 className="animate-spin" size={40} color="var(--color-red)" />
                                <span style={{ color: 'var(--color-text-dim)' }}>Loading Admins...</span>
                            </div>
                        ) : admins.error ? (
                            <div style={{ padding: '100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                <Shield className="animate-pulse" size={48} color="var(--color-red)" />
                                <span style={{ color: 'var(--color-text-dim)', fontSize: '1.2rem' }}>{admins.error}</span>
                            </div>
                        ) : (
                            <>
                                {filteredAdmins.map((a) => (
                                    <div key={a._id} className="owner-card card">
                                        <div className="owner-profile">
                                            <div className="owner-avatar" style={{ background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Shield size={32} color="var(--color-red)" />
                                            </div>
                                            <div className="owner-main-info">
                                                <h3>{a.firstName} {a.lastName}</h3>
                                                <span className="owner-id">ADMIN ID: {a._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div className="owner-details-list">
                                            <div className="owner-detail-item">
                                                <Mail size={16} /> <span style={{ fontSize: '0.85rem' }}>{a.email}</span>
                                            </div>
                                            <div className="owner-detail-item">
                                                <Phone size={16} /> <span>{a.phone}</span>
                                            </div>
                                        </div>
                                        <div className="owner-card-footer">
                                            <button className="contact-btn" onClick={() => openEdit(a)}>
                                                <Edit2 size={16} /> Edit Account
                                            </button>
                                            <button className="view-gym-btn" style={{ background: '#ff4444' }} onClick={() => handleDelete(a._id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {filteredAdmins.length === 0 && (
                                    <div style={{ padding: '60px', textAlign: 'center', width: '100%', color: 'var(--color-text-dim)' }}>
                                        No admins found.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </>
            ) : (
                <div style={{ marginTop: '20px' }} className="animate-fade-in">
                    <AdminLogs embedded={true} />
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="modal-content card" style={{ maxWidth: '600px', width: '100%', padding: '32px', background: 'var(--color-surface)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{editingAdmin ? 'Update Admin' : 'Register Admin'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required={!editingAdmin}
                                            placeholder={editingAdmin ? "Leave blank to keep current" : ""}
                                            style={{
                                                width: '100%',
                                                padding: '10px 40px 10px 10px',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border-color)',
                                                background: 'rgba(255,255,255,0.05)',
                                                color: 'white'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--color-text-dim)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px', padding: '12px', fontWeight: 'bold' }}>
                                {editingAdmin ? 'Update Admin Account' : 'Register Admin'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admins;
