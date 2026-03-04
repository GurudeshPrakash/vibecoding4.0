import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Search, Plus, Loader2, X, Trash2, Edit2, Shield, Eye, EyeOff, Users, ClipboardList, Activity, ArrowUpRight, CheckCircle2, AlertCircle, RefreshCcw, UserMinus, UserPlus, ArrowLeft, Clock } from 'lucide-react';
import '../../style/SuperAdminDashboard.css';
import AdminLogs from './AdminLogs';

const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text)' }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
    );
};

const Admins = () => {
    const [viewTab, setViewTab] = useState('accounts');
    const [searchQuery, setSearchQuery] = useState('');
    const [admins, setAdmins] = useState(() => {
        const saved = localStorage.getItem('mock_admins_db');
        return saved ? JSON.parse(saved) : [];
    });
    const [branches, setBranches] = useState(() => {
        const saved = localStorage.getItem('mock_branches_db');
        return saved ? JSON.parse(saved) : [
            { _id: 'b1', name: 'Colombo City Gym' },
            { _id: 'b2', name: 'Kandy Fitness Center' },
            { _id: 'b3', name: 'Galle Power Hub' }
        ];
    });
    const [isLoading, setIsLoading] = useState(!localStorage.getItem('mock_admins_db'));
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Admin',
        branchId: '',
        allBranchAccess: false,
        sendInvite: true,
        tempPassword: Math.random().toString(36).slice(-8).toUpperCase()
    });

    const fetchAdmins = async () => {
        if (admins.length === 0) setIsLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/admin/admins', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 403) {
                setAdmins({ error: 'Access Denied: Only Super Admins can manage Administrators.' });
                return;
            }
            const data = await response.json();
            if (response.ok) {
                setAdmins(data);
                localStorage.setItem('mock_admins_db', JSON.stringify(data));
            }
        } catch (error) {
            console.warn('Backend reachability issue, using mock data:', error.message);
            const savedMock = localStorage.getItem('mock_admins_db');
            if (savedMock) {
                setAdmins(JSON.parse(savedMock));
            } else {
                const defaultMocks = [
                    { _id: 'mock1', firstName: 'Shahana', lastName: 'Kuganesan', email: 'shaha@vibecoding.com', phone: '+94 77 123 4567', role: 'Admin', status: 'Active', lastLogin: 'Today, 10:45 AM', allBranchAccess: true },
                    { _id: 'mock2', firstName: 'Admin', lastName: 'User', email: 'admin@gymsys.com', phone: '+94 77 999 0000', role: 'Admin', status: 'Active', lastLogin: 'Yesterday, 04:30 PM', branchId: 'b1' },
                    { _id: 'mock3', firstName: 'Branch', lastName: 'Head', email: 'head@fitpro.lk', phone: '+94 71 555 1111', role: 'Branch Admin', status: 'Inactive', lastLogin: '2 days ago', branchId: 'b2' }
                ];
                setAdmins(defaultMocks);
                localStorage.setItem('mock_admins_db', JSON.stringify(defaultMocks));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/admin/branches', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBranches(data);
                localStorage.setItem('mock_branches_db', JSON.stringify(data));
            }
        } catch (error) {
            setBranches([
                { _id: 'b1', name: 'Colombo City Gym' },
                { _id: 'b2', name: 'Kandy Fitness Center' },
                { _id: 'b3', name: 'Galle Power Hub' }
            ]);
        }
    };

    useEffect(() => {
        fetchAdmins();
        fetchBranches();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        const url = editingAdmin
            ? `http://localhost:5000/api/admin/admins/${editingAdmin._id}`
            : 'http://localhost:5000/api/admin/admins';
        const method = editingAdmin ? 'PUT' : 'POST';

        // Prepare submission data
        const submitData = {
            ...formData,
            password: formData.tempPassword,
            status: editingAdmin ? editingAdmin.status : 'Active',
            lastLogin: editingAdmin ? editingAdmin.lastLogin : 'Never'
        };

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(submitData)
            });

            if (response.ok) {
                setShowModal(false);
                setEditingAdmin(null);
                resetForm();
                fetchAdmins();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to save admin');
            }
        } catch (error) {
            console.warn('Network error, applying changes to mock database:', error.message);
            // APPLY TO MOCK DB
            const savedMock = JSON.parse(localStorage.getItem('mock_admins_db') || '[]');
            if (editingAdmin) {
                const updated = savedMock.map(a => a._id === editingAdmin._id ? { ...a, ...submitData } : a);
                localStorage.setItem('mock_admins_db', JSON.stringify(updated));
            } else {
                const newItem = { ...submitData, _id: 'mock_' + Date.now() };
                savedMock.push(newItem);
                localStorage.setItem('mock_admins_db', JSON.stringify(savedMock));
            }
            setShowModal(false);
            setEditingAdmin(null);
            resetForm();
            fetchAdmins();
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'Admin',
            branchId: '',
            allBranchAccess: false,
            sendInvite: true,
            tempPassword: Math.random().toString(36).slice(-8).toUpperCase()
        });
        setShowPassword(false);
    };

    const handleToggleStatus = async (admin) => {
        const token = localStorage.getItem('admin_token');
        const newStatus = admin.status === 'Active' ? 'Inactive' : 'Active';
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/admins/${admin._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...admin, status: newStatus })
            });

            if (response.ok) fetchAdmins();
        } catch (error) {
            alert('Status update failed');
        }
    };

    const handleResetPassword = async (email) => {
        if (!window.confirm(`Send password reset email to ${email}?`)) return;
        alert(`Invitation reset sent to ${email}`);
        // In a real app, you'd call an API endpoint here
    };

    const openEdit = (a) => {
        setEditingAdmin(a);
        setFormData({
            firstName: a.firstName || '',
            lastName: a.lastName || '',
            email: a.email || '',
            phone: a.phone || '',
            role: a.role || 'Admin',
            branchId: a.branchId || '',
            allBranchAccess: a.allBranchAccess || false,
            sendInvite: false,
            tempPassword: ''
        });
        setShowModal(true);
    };

    const filteredAdmins = Array.isArray(admins) ? admins.filter(a => {
        const isSearchMatch = `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.email.toLowerCase().includes(searchQuery.toLowerCase());
        const isAdminRole = a.role === 'Admin' || a.role === 'Branch Admin';
        return isSearchMatch && isAdminRole;
    }) : [];

    const totalAdmins = filteredAdmins.length;
    const activeAdmins = filteredAdmins.filter(a => a.status === 'Active' || !a.status).length;
    const nonActiveAdmins = filteredAdmins.filter(a => a.status === 'Inactive').length;

    return (
        <div className="super-admin-dashboard">
            <header className="sa-header">
                <div className="sa-welcome">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Admin Management
                    </h1>
                    <p style={{ margin: 0, marginTop: '4px' }}>Manage and monitor all administrators.</p>
                </div>

                <div className="sa-actions">
                    <button className="icon-btn" style={{ background: 'var(--color-red)', color: 'white' }} onClick={() => { setEditingAdmin(null); resetForm(); setShowModal(true); }} title="Register New Admin">
                        <Plus size={22} />
                    </button>

                    <div className="sa-search-bar" style={{ width: '350px' }}>
                        <Search className="sa-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '24px' }}>
                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000', margin: 0 }}>
                            <Shield size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Total Admins</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{totalAdmins}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', margin: 0 }}>
                            <CheckCircle2 size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Active Admins</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{activeAdmins}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', margin: 0 }}>
                            <AlertCircle size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Non-Active Admins</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{nonActiveAdmins}</h2>
                        </div>
                    </div>
                </div>
            </section>

            {viewTab === 'accounts' ? (
                <div className="sa-dashboard-layout" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="sa-card" style={{ padding: '0', overflow: 'hidden' }}>
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
                            <div className="sa-table-container">
                                <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--color-red)' }}>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>No</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Name</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Email</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Role</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Branch</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Status</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Last Login</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAdmins.map((a, index) => (
                                            <tr key={a._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>
                                                    {String(index + 1).padStart(2, '0')}
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Shield size={18} color="var(--color-red)" />
                                                        </div>
                                                        <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>{a.firstName} {a.lastName}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{a.email}</td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--color-red)', background: 'rgba(255,0,0,0.08)', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                                                        {a.role || 'Admin'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                    {a.allBranchAccess ? 'All Branches' : (branches.find(b => b._id === a.branchId)?.name || 'Default Branch')}
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.status === 'Inactive' ? '#EF4444' : '#10B981' }} />
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: a.status === 'Inactive' ? '#EF4444' : '#10B981' }}>{a.status || 'Active'}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{a.lastLogin || 'Never'}</td>
                                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => openEdit(a)} title="Edit Details"><Edit2 size={14} /></button>
                                                        <button className="icon-btn" style={{ width: 32, height: 32, color: a.status === 'Inactive' ? '#10B981' : '#EF4444' }} onClick={() => handleToggleStatus(a)} title={a.status === 'Inactive' ? 'Activate' : 'Disable'}><UserMinus size={14} /></button>
                                                        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => handleResetPassword(a.email)} title="Reset Password"><RefreshCcw size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredAdmins.length === 0 && (
                                    <div style={{ padding: '80px', textAlign: 'center', color: 'var(--color-text-dim)', fontWeight: 600 }}>
                                        No administrators found.
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
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.3s ease' }}>
                    <div className="sa-card" style={{ maxWidth: '650px', width: '100%', padding: '32px', background: '#FFFFFF', border: '1px solid var(--border-color)', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserPlus size={22} color="var(--color-red)" />
                                </div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
                                    {editingAdmin ? 'Update Administrator' : 'Add New Administrator'}
                                </h2>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: '#f5f5fa', border: 'none', color: '#666', borderRadius: '10px', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {/* Basic Info */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <h4 style={{ margin: '0 0 16px 0', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Information</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text)' }}>First Name <span style={{ color: 'red' }}>*</span></label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} placeholder="e.g. John" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text)' }}>Last Name <span style={{ color: 'red' }}>*</span></label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} placeholder="e.g. Doe" />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 1' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text)' }}>Email Address <span style={{ color: 'red' }}>*</span></label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} placeholder="john@gymsys.com" />
                                </div>

                                <div style={{ gridColumn: 'span 1' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Phone Number <span style={{ color: 'var(--color-text-dim)', fontWeight: 500 }}>(Optional)</span></label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600 }} placeholder="+94 77 000 0000" />
                                </div>

                                {/* Role & Branch */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <h4 style={{ margin: '12px 0 16px 0', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Permissions & Access</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Assign Role</label>
                                            <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, cursor: 'pointer' }}>
                                                <option value="Admin">Admin</option>
                                                <option value="Branch Admin">Branch Admin</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Assign Branch</label>
                                            <select
                                                name="branchId"
                                                value={formData.branchId}
                                                onChange={handleChange}
                                                disabled={formData.allBranchAccess}
                                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: formData.allBranchAccess ? '#edf2f7' : '#F9FAFB', fontWeight: 600, cursor: 'pointer' }}
                                            >
                                                <option value="">Select Branch...</option>
                                                {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                            </select>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                                                <input type="checkbox" id="aba" name="allBranchAccess" checked={formData.allBranchAccess} onChange={handleChange} style={{ cursor: 'pointer' }} />
                                                <label htmlFor="aba" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-dim)', cursor: 'pointer' }}>All Branch Access</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Setup */}
                                {!editingAdmin && (
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <h4 style={{ margin: '12px 0 16px 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Setup</h4>
                                        <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-dim)', marginBottom: '4px' }}>Temporary Password</span>
                                                    <span style={{ fontSize: '0.88rem', fontWeight: 900, color: 'var(--color-red)', letterSpacing: '0.1em' }}>{formData.tempPassword}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <input type="checkbox" id="si" name="sendInvite" checked={formData.sendInvite} onChange={handleChange} />
                                                    <label htmlFor="si" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Send Invite Link</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'white', fontWeight: 800, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--color-red)', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,0,0,0.2)' }}>
                                    {editingAdmin ? 'Update Administrator' : 'Create Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admins;
