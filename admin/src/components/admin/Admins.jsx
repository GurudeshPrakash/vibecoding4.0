import React, { useState, useEffect } from 'react';
import { Phone, Mail, Search, Plus, Loader2, X, Trash2, Edit2, Shield, Eye, EyeOff, Users, ClipboardList, Activity, ArrowUpRight } from 'lucide-react';
import '../../style/SuperAdminDashboard.css';
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
                setAdmins({ error: 'Access Denied: Only Super Admins can manage Administrators.' });
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
        <div className="super-admin-dashboard">
            {/* New Premium Header */}
            <header className="sa-header">
                <div className="sa-welcome">
                    <h1>System Administrators</h1>
                    <p>Manage access levels and monitor administrative session history</p>
                </div>

                <div className="sa-actions">
                    <div className="sa-search-bar" style={{ width: '350px' }}>
                        <Search className="sa-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button className="icon-btn" onClick={() => { setEditingAdmin(null); setShowModal(true); }} title="Register New Admin">
                        <Plus size={22} />
                    </button>

                    <button
                        className={`icon-btn ${viewTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setViewTab(viewTab === 'logs' ? 'accounts' : 'logs')}
                        title="Session Logs"
                    >
                        <Activity size={22} />
                    </button>
                </div>
            </header>

            {/* Quick Metrics */}
            <section className="sa-summary-grid" style={{ marginBottom: '32px' }}>
                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000' }}>
                        <Shield size={24} />
                    </div>
                    <div>
                        <span className="label">Privileged Accounts</span>
                        <h2 className="value">{filteredAdmins.length}</h2>
                        <span className="trend up"><ArrowUpRight size={14} /> System-wide</span>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                        <ClipboardList size={24} />
                    </div>
                    <div>
                        <span className="label">Active Sessions</span>
                        <h2 className="value">4</h2>
                        <span className="trend up"><ArrowUpRight size={14} /> Last 24 hours</span>
                    </div>
                </div>
            </section>

            {viewTab === 'accounts' ? (
                <div className="sa-dashboard-layout" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="sa-card" style={{ border: '1px solid var(--border-color)' }}>
                        {isLoading ? (
                            <div style={{ padding: '100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                <Loader2 className="animate-spin" size={40} color="var(--color-red)" />
                                <span style={{ color: 'var(--color-text-dim)', fontWeight: 600 }}>Syncing Admin Database...</span>
                            </div>
                        ) : admins.error ? (
                            <div style={{ padding: '100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Shield size={40} color="var(--color-red)" />
                                </div>
                                <span style={{ color: 'var(--color-text)', fontSize: '1.25rem', fontWeight: 800 }}>{admins.error}</span>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                                {filteredAdmins.map((a) => (
                                    <div key={a._id} className="sa-stat-card" style={{ background: 'var(--color-bg)', gap: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ width: 56, height: 56, borderRadius: '14px', background: 'rgba(255,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Shield size={28} color="var(--color-red)" />
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="icon-btn" style={{ width: 36, height: 36 }} onClick={() => openEdit(a)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="icon-btn" style={{ width: 36, height: 36, color: '#ff4444' }} onClick={() => handleDelete(a._id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0' }}>{a.firstName} {a.lastName}</h3>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-red)', background: 'rgba(255,0,0,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                                                ID: {a._id.slice(-6).toUpperCase()}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-dim)', fontSize: '0.85rem', fontWeight: 600 }}>
                                                <Mail size={16} /> {a.email}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-dim)', fontSize: '0.85rem', fontWeight: 600 }}>
                                                <Phone size={16} /> {a.phone}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredAdmins.length === 0 && (
                                    <div style={{ padding: '60px', textAlign: 'center', width: '100%', color: 'var(--color-text-dim)', fontWeight: 600 }}>
                                        No administrators matching your search criteria.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="sa-card" style={{ border: '1px solid var(--border-color)' }}>
                    <div className="sa-card-header">
                        <h3>Session Historical Logs</h3>
                        <button className="view-all-link-top" onClick={() => setViewTab('accounts')}>Back to Accounts</button>
                    </div>
                    <AdminLogs embedded={true} />
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.3s ease' }}>
                    <div className="sa-card" style={{ maxWidth: '600px', width: '100%', padding: '40px', background: 'var(--color-surface)', border: '1px solid var(--border-color)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{editingAdmin ? 'Refine Admin Profile' : 'Register New Administrator'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'var(--color-bg)', border: '1px solid var(--border-color)', color: 'var(--color-text)', borderRadius: '12px', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--color-bg)', color: 'var(--color-text)', fontWeight: 600 }} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--color-bg)', color: 'var(--color-text)', fontWeight: 600 }} />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--color-bg)', color: 'var(--color-text)', fontWeight: 600 }} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>Secure Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required={!editingAdmin}
                                            placeholder={editingAdmin ? "Current active" : "••••••••"}
                                            style={{
                                                width: '100%',
                                                padding: '14px 48px 14px 14px',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--color-bg)',
                                                color: 'var(--color-text)',
                                                fontWeight: 600
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '14px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--color-text-dim)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--color-bg)', color: 'var(--color-text)', fontWeight: 600 }} />
                                </div>
                            </div>
                            <button type="submit" className="sa-action-btn" style={{ width: '100%', marginTop: '32px', background: 'var(--color-red)', color: 'white', border: 'none', padding: '16px', fontSize: '1rem', fontWeight: 900, borderRadius: '14px', display: 'flex', flexDirection: 'row' }}>
                                {editingAdmin ? 'Commit Changes' : 'Finalize Registration'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admins;
