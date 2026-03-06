import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Search, Plus, Loader2, X, Trash2, Edit2, Shield, Eye, EyeOff, Users, ClipboardList, Activity, ArrowUpRight, CheckCircle2, AlertCircle, RefreshCcw, UserMinus, UserPlus, MapPin, ArrowLeft, Clock } from 'lucide-react';
import '../styles/SuperAdminDashboard.css';

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

const Managers = ({ userRole = 'super_admin' }) => {
    const isSuperAdmin = userRole === 'super_admin';
    const isAdmin = userRole === 'admin';

    const canModify = (targetRole) => {
        if (isSuperAdmin) return true;
        if (isAdmin && targetRole === 'Staff') return true;
        return false;
    };

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
    const [modalRole, setModalRole] = useState('Staff');

    const [editingManager, setEditingManager] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Staff',
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
            if (response.ok) {
                const data = await response.json();
                setManagers(data);
                localStorage.setItem('mock_managers_db', JSON.stringify(data));
            } else {
                throw new Error(`Server returned ${response.status}`);
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
                    { _id: 'm3', firstName: 'Kamal', lastName: 'Silva', email: 'kamal@vibecoding.lk', phone: '+94 71 000 3333', role: 'Staff', status: 'Inactive', lastLogin: '3 days ago', branchId: 'b3', assignedArea: 'Galle Coastal' }
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
            role: editingManager ? editingManager.role : modalRole,
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
                alert(errorData.message || 'Failed to save user');
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
            role: 'Staff',
            branchId: '',
            assignedArea: '',
            sendInvite: true,
            tempPassword: Math.random().toString(36).slice(-8).toUpperCase()
        });
        setShowPassword(false);
    };

    const handleToggleStatus = async (manager) => {
        if (!canModify(manager.role)) return;
        const token = localStorage.getItem('admin_token');
        const newStatus = manager.status === 'Inactive' ? 'Active' : 'Inactive';
        if (!window.confirm(`Are you sure you want to change status for ${manager.firstName} to ${newStatus}?`)) return;

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
            const savedMock = JSON.parse(localStorage.getItem('mock_managers_db') || '[]');
            const updated = savedMock.map(m => m._id === manager._id ? { ...m, status: newStatus } : m);
            localStorage.setItem('mock_managers_db', JSON.stringify(updated));
            fetchManagers();
        }
    };

    const handleResetPassword = async (m) => {
        if (!canModify(m.role)) return;
        if (!window.confirm(`Send password reset email to ${m.email}?`)) return;
        alert(`Invitation reset sent to ${m.email}`);
    };

    const openEdit = (m) => {
        if (!canModify(m.role)) return;
        setEditingManager(m);
        setFormData({
            firstName: m.firstName || '',
            lastName: m.lastName || '',
            email: m.email || '',
            phone: m.phone || '',
            role: m.role || 'Staff',
            branchId: m.branchId || '',
            assignedArea: m.assignedArea || '',
            sendInvite: false,
            tempPassword: ''
        });
        setShowModal(true);
    };

    const openAdd = (role) => {
        if (!canModify(role)) return;
        setEditingManager(null);
        setModalRole(role);
        resetForm();
        setShowModal(true);
    };

    const renderTable = (title, roleFilter) => {
        const filtered = Array.isArray(managers) ? managers.filter(m => {
            const isRoleMatch = m.role?.toLowerCase() === roleFilter.toLowerCase();
            const isSearchMatch = `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.email.toLowerCase().includes(searchQuery.toLowerCase());
            return isRoleMatch && isSearchMatch;
        }) : [];

        const isLocked = !canModify(roleFilter);

        return (
            <div className="sa-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px', position: 'relative' }}>
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: isLocked ? '#f8f9fa' : 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: isLocked ? '#e5e7eb' : 'rgba(255,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={20} color={isLocked ? '#9ca3af' : 'var(--color-red)'} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{title}</h3>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>{filtered.length} total members listed</p>
                        </div>
                    </div>
                    <button
                        className="icon-btn"
                        style={{ background: isLocked ? '#d1d5db' : 'var(--color-red)', color: 'white', cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.7 : 1 }}
                        onClick={() => openAdd(roleFilter)}
                        disabled={isLocked}
                        title={isLocked ? "Access Restricted" : `Add New ${roleFilter}`}
                    >
                        {isLocked ? <Shield size={18} /> : <Plus size={18} />}
                    </button>
                </div>

                <div className="sa-table-container">
                    <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--color-red)' }}>
                                <th style={{ padding: '16px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Staff Name</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Branch</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Role</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((m, index) => (
                                <tr key={m._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '8px', background: isLocked ? '#f3f4f6' : 'rgba(255,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Users size={14} color={isLocked ? '#9ca3af' : 'var(--color-red)'} />
                                            </div>
                                            <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>{m.firstName} {m.lastName}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700 }}>{branches.find(b => b._id === m.branchId)?.name || 'Central Center'}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: isLocked ? '#6b7280' : 'var(--color-red)', background: isLocked ? '#f3f4f6' : 'rgba(255,0,0,0.08)', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                            {m.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.status === 'Inactive' ? '#EF4444' : '#10B981' }} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: m.status === 'Inactive' ? '#EF4444' : '#10B981' }}>{m.status || 'Active'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                            <button className="icon-btn" style={{ width: 28, height: 28, cursor: isLocked ? 'not-allowed' : 'pointer' }} onClick={() => openEdit(m)} disabled={isLocked}><Edit2 size={12} /></button>
                                            <button className="icon-btn" style={{ width: 28, height: 28, cursor: isLocked ? 'not-allowed' : 'pointer', color: m.status === 'Inactive' ? '#10B981' : '#EF4444' }} onClick={() => handleToggleStatus(m)} disabled={isLocked}><UserMinus size={12} /></button>
                                            <button className="icon-btn" style={{ width: 28, height: 28, cursor: isLocked ? 'not-allowed' : 'pointer' }} onClick={() => handleResetPassword(m)} disabled={isLocked}><RefreshCcw size={12} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-dim)', fontWeight: 600, fontSize: '0.8rem' }}>
                            No {roleFilter.toLowerCase()}s recorded in this category.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="super-admin-dashboard" style={{ paddingBottom: '100px' }}>
            <header className="sa-header">
                <div className="sa-welcome">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>Staff Management</h1>
                    <p style={{ margin: 0, marginTop: '4px' }}>Comprehensive management of Branch Staff and Trainers.</p>
                </div>

                <div className="sa-actions">
                    <div className="sa-search-bar" style={{ width: '400px' }}>
                        <Search className="sa-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Unified search across all team members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div style={{ padding: '100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <Loader2 className="animate-spin" size={40} color="var(--color-red)" />
                    <span style={{ color: 'var(--color-text-dim)', fontWeight: 600 }}>Syncing Management Infrastructure...</span>
                </div>
            ) : (
                <div style={{ marginTop: '32px' }}>
                    {renderTable('System Managers', 'Manager')}
                    {renderTable('Branch Operations (Staff)', 'Staff')}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="sa-card" style={{ maxWidth: '650px', width: '100%', padding: '32px', background: '#FFFFFF', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserPlus size={22} color="var(--color-red)" />
                                </div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>
                                    {editingManager ? `Update ${editingManager.role}` : `Provision New ${modalRole}`}
                                </h2>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: '#f5f5fa', border: 'none', borderRadius: '10px', width: 36, height: 36, cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700 }}>First Name *</label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700 }}>Last Name *</label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB' }} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700 }}>Corporate Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700 }}>Contact Number</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700 }}>Assigned Center</label>
                                    <select name="branchId" value={formData.branchId} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB' }}>
                                        <option value="">Select Location...</option>
                                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700 }}>Operational Area</label>
                                    <input type="text" name="assignedArea" value={formData.assignedArea} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB' }} />
                                </div>

                                {!editingManager && (
                                    <div style={{ gridColumn: 'span 2', background: '#F9FAFB', padding: '16px', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>INITIAL PASSWORD</span>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-red)' }}>{formData.tempPassword}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input type="checkbox" id="invite" name="sendInvite" checked={formData.sendInvite} onChange={handleChange} />
                                                <label htmlFor="invite" style={{ fontSize: '0.7rem', fontWeight: 700 }}>SEND INVITE</label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'white', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--color-red)', color: 'white', fontWeight: 800, cursor: 'pointer' }}>
                                    {editingManager ? 'Update Credentials' : `Provision ${modalRole}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Managers;
