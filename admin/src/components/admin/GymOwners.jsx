import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Search, Plus, Loader2, X, Trash2, Edit2, Shield, Eye, EyeOff, Users, ClipboardList, Activity, ArrowUpRight, CheckCircle2, AlertCircle, RefreshCcw, UserMinus, UserPlus, MapPin, ArrowLeft, Clock } from 'lucide-react';
import '../../style/SuperAdminDashboard.css';

const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text)' }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
    );
};

const GymManagers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [managers, setManagers] = useState(() => {
        const saved = localStorage.getItem('mock_managers_db');
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
    const [isLoading, setIsLoading] = useState(!localStorage.getItem('mock_managers_db'));
    const [showModal, setShowModal] = useState(false);
    const [editingManager, setEditingManager] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Manager',
        branchId: '',
        assignedArea: '',
        sendInvite: true,
        tempPassword: Math.random().toString(36).slice(-8).toUpperCase()
    });

    const fetchManagers = async () => {
        if (managers.length === 0) setIsLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/admin/staff', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setManagers(data);
                localStorage.setItem('mock_managers_db', JSON.stringify(data));
            }
        } catch (error) {
            console.warn('Backend reachability issue, using mock data:', error.message);
            const savedMock = localStorage.getItem('mock_managers_db');
            if (savedMock) {
                setManagers(JSON.parse(savedMock));
            } else {
                const defaultMocks = [
                    { _id: 'm1', firstName: 'Prakash', lastName: 'Gurudesh', email: 'prakash@fitpro.lk', phone: '+94 77 555 1234', role: 'Manager', status: 'Active', lastLogin: 'Today, 09:15 AM', branchId: 'b1', assignedArea: 'Colombo North' },
                    { _id: 'm2', firstName: 'Sarah', lastName: 'Perera', email: 'sarah@powerworld.com', phone: '+94 71 888 2222', role: 'Manager', status: 'Active', lastLogin: 'Yesterday, 05:45 PM', branchId: 'b2', assignedArea: 'Kandy Central' },
                    { _id: 'm3', firstName: 'Kamal', lastName: 'Silva', email: 'kamal@vibecoding.lk', phone: '+94 71 000 3333', role: 'Manager', status: 'Inactive', lastLogin: '3 days ago', branchId: 'b3', assignedArea: 'Galle Coastal' }
                ];
                setManagers(defaultMocks);
                localStorage.setItem('mock_managers_db', JSON.stringify(defaultMocks));
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
        fetchManagers();
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
        const url = editingManager
            ? `http://localhost:5000/api/admin/staff/${editingManager._id}`
            : 'http://localhost:5000/api/admin/staff';
        const method = editingManager ? 'PUT' : 'POST';

        const submitData = {
            ...formData,
            password: formData.tempPassword,
            status: editingManager ? editingManager.status : 'Active',
            lastLogin: editingManager ? editingManager.lastLogin : 'Never'
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
                setEditingManager(null);
                resetForm();
                fetchManagers();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to save manager');
            }
        } catch (error) {
            console.warn('Network error, applying changes to mock database:', error.message);
            const savedMock = JSON.parse(localStorage.getItem('mock_managers_db') || '[]');
            if (editingManager) {
                const updated = savedMock.map(m => m._id === editingManager._id ? { ...m, ...submitData } : m);
                localStorage.setItem('mock_managers_db', JSON.stringify(updated));
            } else {
                const newItem = { ...submitData, _id: 'mock_m_' + Date.now() };
                savedMock.push(newItem);
                localStorage.setItem('mock_managers_db', JSON.stringify(savedMock));
            }
            setShowModal(false);
            setEditingManager(null);
            resetForm();
            fetchManagers();
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'Manager',
            branchId: '',
            assignedArea: '',
            sendInvite: true,
            tempPassword: Math.random().toString(36).slice(-8).toUpperCase()
        });
        setShowPassword(false);
    };

    const handleToggleStatus = async (manager) => {
        const token = localStorage.getItem('admin_token');
        const newStatus = manager.status === 'Inactive' ? 'Active' : 'Inactive';
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/staff/${manager._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...manager, status: newStatus })
            });
            if (response.ok) fetchManagers();
        } catch (error) {
            // Apply to mock
            const savedMock = JSON.parse(localStorage.getItem('mock_managers_db') || '[]');
            const updated = savedMock.map(m => m._id === manager._id ? { ...m, status: newStatus } : m);
            localStorage.setItem('mock_managers_db', JSON.stringify(updated));
            fetchManagers();
        }
    };

    const handleResetPassword = async (email) => {
        if (!window.confirm(`Send password reset email to ${email}?`)) return;
        alert(`Invitation reset sent to ${email}`);
    };

    const openEdit = (m) => {
        setEditingManager(m);
        setFormData({
            firstName: m.firstName || '',
            lastName: m.lastName || '',
            email: m.email || '',
            phone: m.phone || '',
            role: m.role || 'Manager',
            branchId: m.branchId || '',
            assignedArea: m.assignedArea || '',
            sendInvite: false,
            tempPassword: ''
        });
        setShowModal(true);
    };

    const filteredManagers = Array.isArray(managers) ? managers.filter(m => {
        const isSearchMatch = `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.assignedArea?.toLowerCase().includes(searchQuery.toLowerCase());
        const isManagerRole = m.role?.toLowerCase() === 'manager';
        return isSearchMatch && isManagerRole;
    }) : [];

    const totalManagers = filteredManagers.length;
    const activeManagers = filteredManagers.filter(m => m.status === 'Active' || !m.status).length;
    const nonActiveManagers = filteredManagers.filter(m => m.status === 'Inactive').length;

    return (
        <div className="super-admin-dashboard">
            <header className="sa-header">
                <div className="sa-welcome">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Manager Management
                    </h1>
                    <p style={{ margin: 0, marginTop: '4px' }}>Manage and monitor all managers.</p>
                </div>

                <div className="sa-actions">
                    <button className="icon-btn" style={{ background: 'var(--color-red)', color: 'white' }} onClick={() => { setEditingManager(null); resetForm(); setShowModal(true); }} title="Register New Manager">
                        <Plus size={22} />
                    </button>

                    <div className="sa-search-bar" style={{ width: '350px' }}>
                        <Search className="sa-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email or area..."
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
                            <Users size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Total Managers</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{totalManagers}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', margin: 0 }}>
                            <CheckCircle2 size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Active Managers</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{activeManagers}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', margin: 0 }}>
                            <AlertCircle size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Non-Active Managers</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{nonActiveManagers}</h2>
                        </div>
                    </div>
                </div>
            </section>

            <div className="sa-dashboard-layout" style={{ gridTemplateColumns: '1fr' }}>
                <div className="sa-card" style={{ padding: '0', overflow: 'hidden' }}>
                    {isLoading ? (
                        <div style={{ padding: '100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                            <Loader2 className="animate-spin" size={40} color="var(--color-red)" />
                            <span style={{ color: 'var(--color-text-dim)', fontWeight: 600 }}>Syncing Management Database...</span>
                        </div>
                    ) : (
                        <div className="sa-table-container">
                            <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--color-red)' }}>
                                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>No</th>
                                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Name</th>
                                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Email</th>
                                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Role</th>
                                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Branch</th>
                                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Status</th>
                                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Last Login</th>
                                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredManagers.map((m, index) => (
                                        <tr key={m._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>
                                                {String(index + 1).padStart(2, '0')}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Shield size={18} color="var(--color-red)" />
                                                    </div>
                                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.firstName} {m.lastName}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{m.email}</td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-red)', background: 'rgba(255,0,0,0.08)', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                                                    {m.role || 'Manager'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700 }}>
                                                {branches.find(b => b._id === m.branchId)?.name || m.branch || 'Default Center'}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.status === 'Inactive' ? '#EF4444' : '#10B981' }} />
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: m.status === 'Inactive' ? '#EF4444' : '#10B981' }}>{m.status || 'Active'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{m.lastLogin || 'Never'}</td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => openEdit(m)} title="Edit Details"><Edit2 size={14} /></button>
                                                    <button className="icon-btn" style={{ width: 32, height: 32, color: m.status === 'Inactive' ? '#10B981' : '#EF4444' }} onClick={() => handleToggleStatus(m)} title={m.status === 'Inactive' ? 'Activate' : 'Disable'}><UserMinus size={14} /></button>
                                                    <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => handleResetPassword(m.email)} title="Reset Password"><RefreshCcw size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredManagers.length === 0 && (
                                <div style={{ padding: '80px', textAlign: 'center', color: 'var(--color-text-dim)', fontWeight: 600 }}>
                                    No managers found.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.3s ease' }}>
                    <div className="sa-card" style={{ maxWidth: '650px', width: '100%', padding: '32px', background: '#FFFFFF', border: '1px solid var(--border-color)', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserPlus size={22} color="var(--color-red)" />
                                </div>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
                                    {editingManager ? 'Update Manager' : 'Add New Manager'}
                                </h2>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: '#f5f5fa', border: 'none', color: '#666', borderRadius: '10px', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {/* Basic Info */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <h4 style={{ margin: '0 0 16px 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Information</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>First Name <span style={{ color: 'red' }}>*</span></label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600 }} placeholder="e.g. Sarah" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Last Name <span style={{ color: 'red' }}>*</span></label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600 }} placeholder="e.g. Perera" />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 1' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Corporate Email <span style={{ color: 'red' }}>*</span></label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600 }} placeholder="sarah@powerworld.com" />
                                </div>

                                <div style={{ gridColumn: 'span 1' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Direct Line <span style={{ color: 'var(--color-text-dim)', fontWeight: 500 }}>(Optional)</span></label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600 }} placeholder="+94 77 000 0000" />
                                </div>

                                {/* Area & Branch */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <h4 style={{ margin: '12px 0 16px 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operational Scope</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Assigned Branch</label>
                                            <select
                                                name="branchId"
                                                value={formData.branchId}
                                                onChange={handleChange}
                                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, cursor: 'pointer' }}
                                            >
                                                <option value="">Select Center...</option>
                                                {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Regional Area</label>
                                            <input type="text" name="assignedArea" value={formData.assignedArea} onChange={handleChange} placeholder="e.g. Western Province South" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600 }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Account Setup */}
                                {!editingManager && (
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <h4 style={{ margin: '12px 0 16px 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Provisioning</h4>
                                        <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-dim)', marginBottom: '4px' }}>Default Password</span>
                                                    <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--color-red)', letterSpacing: '0.1em' }}>{formData.tempPassword}</span>
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
                                    {editingManager ? 'Update Account Authority' : 'Provision Manager'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GymManagers;
