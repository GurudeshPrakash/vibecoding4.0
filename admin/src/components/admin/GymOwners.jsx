import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
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
=======
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Phone, Mail, MapPin, Search,
    UserPlus, Edit2, Trash2, Shield, Loader2, X, Plus, Users, Eye, EyeOff, Activity, ArrowUpRight
} from 'lucide-react';
import '../../style/SuperAdminDashboard.css';

const GymManagers = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState(location.state?.initialSearch || '');
    const [managers, setManagers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
>>>>>>> main
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (location.state?.openModal) {
            setEditingManager(null);
            setShowModal(true);
        }
    }, [location.state]);

    const [editingManager, setEditingManager] = useState(null);
<<<<<<< HEAD
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
=======
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', phone: '', branch: '', assignedArea: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const [knownBranches, setKnownBranches] = useState([]);
    const [branchError, setBranchError] = useState(null);
    const [isBranchesLoading, setIsBranchesLoading] = useState(true);

    useEffect(() => {
        const fetchBranches = async () => {
            setIsBranchesLoading(true);
            try {
                const token = localStorage.getItem('admin_token');
                const response = await fetch('http://localhost:5000/api/admin/branches', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setKnownBranches(data.map(b => b.name).sort());
                    }
                } else {
                    setBranchError('Failed to load branches');
                }
            } catch (error) {
                setBranchError('Network error loading branches');
            } finally {
                setIsBranchesLoading(false);
            }
        };
        fetchBranches();
    }, []);

    const fetchManagers = async () => {
        setIsLoading(true);
>>>>>>> main
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/admin/staff', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
<<<<<<< HEAD
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
=======
            if (response.status === 403) {
                setManagers({ error: 'Access Denied: You do not have permission to manage staff.' });
            } else {
                const data = await response.json();
                if (response.ok) setManagers(data);
            }
        } catch (error) {
            console.error('Fetch managers error:', error);
>>>>>>> main
        } finally {
            setIsLoading(false);
        }
    };

<<<<<<< HEAD
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
=======
    useEffect(() => {
        fetchManagers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
>>>>>>> main
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
<<<<<<< HEAD
=======

        const existingManager = managers.find(m =>
            m.branch === formData.branch &&
            (!editingManager || m._id !== editingManager._id)
        );

        if (existingManager) {
            alert(`The branch "${formData.branch}" is already assigned to ${existingManager.firstName} ${existingManager.lastName}.`);
            return;
        }

>>>>>>> main
        const token = localStorage.getItem('admin_token');
        const url = editingManager
            ? `http://localhost:5000/api/admin/staff/${editingManager._id}`
            : 'http://localhost:5000/api/admin/staff';
        const method = editingManager ? 'PUT' : 'POST';

<<<<<<< HEAD
        const submitData = {
            ...formData,
            password: formData.tempPassword,
            status: editingManager ? editingManager.status : 'Active',
            lastLogin: editingManager ? editingManager.lastLogin : 'Never'
        };

        try {
=======
        try {
            const formDataWithRole = { ...formData, role: 'manager' };
>>>>>>> main
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
<<<<<<< HEAD
                body: JSON.stringify(submitData)
=======
                body: JSON.stringify(formDataWithRole)
>>>>>>> main
            });

            if (response.ok) {
                setShowModal(false);
                setEditingManager(null);
<<<<<<< HEAD
                resetForm();
=======
                setShowPassword(false);
                setFormData({
                    firstName: '', lastName: '', email: '', password: '', phone: '', branch: '', assignedArea: ''
                });
>>>>>>> main
                fetchManagers();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to save manager');
            }
        } catch (error) {
<<<<<<< HEAD
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
=======
            alert('Request failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this manager account?')) return;
        const token = localStorage.getItem('admin_token');
        try {
            const response = await fetch(`http://localhost:5000/api/admin/staff/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) fetchManagers();
        } catch (error) {
            alert('Delete failed');
        }
    };

    const openEdit = (m) => {
        setEditingManager(m);
        setShowPassword(false);
>>>>>>> main
        setFormData({
            firstName: m.firstName || '',
            lastName: m.lastName || '',
            email: m.email || '',
<<<<<<< HEAD
            phone: m.phone || '',
            role: m.role || 'Manager',
            branchId: m.branchId || '',
            assignedArea: m.assignedArea || '',
            sendInvite: false,
            tempPassword: ''
=======
            password: '',
            phone: m.phone || '',
            branch: m.branch || '',
            assignedArea: m.assignedArea || ''
>>>>>>> main
        });
        setShowModal(true);
    };

<<<<<<< HEAD
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
=======
    const filteredManagers = Array.isArray(managers) ? managers.filter(m =>
        `${m.firstName} ${m.lastName} ${m.branch} ${m.assignedArea}`.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];
>>>>>>> main

    return (
        <div className="super-admin-dashboard">
            <header className="sa-header">
                <div className="sa-welcome">
<<<<<<< HEAD
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Manager Management
                    </h1>
                    <p style={{ margin: 0, marginTop: '4px' }}>Manage and monitor all managers.</p>
                </div>

                <div className="sa-actions">
                    <button className="icon-btn" style={{ background: 'var(--color-red)', color: 'white' }} onClick={() => { setEditingManager(null); resetForm(); setShowModal(true); }} title="Register New Manager">
                        <Plus size={22} />
                    </button>

=======
                    <h1>Branch Management</h1>
                    <p>Oversee gym managers and regional assignments across all locations</p>
                </div>

                <div className="sa-actions">
>>>>>>> main
                    <div className="sa-search-bar" style={{ width: '350px' }}>
                        <Search className="sa-search-icon" size={20} />
                        <input
                            type="text"
<<<<<<< HEAD
                            placeholder="Search by name, email or area..."
=======
                            placeholder="Find manager or branch..."
>>>>>>> main
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
<<<<<<< HEAD
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
=======

                    <button className="icon-btn" onClick={() => { setEditingManager(null); setShowModal(true); }} title="Register New Manager">
                        <UserPlus size={22} />
                    </button>

                    <button className="icon-btn" title="View Logs" onClick={() => fetchManagers()}>
                        <Activity size={22} />
                    </button>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '32px' }}>
                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <span className="label">Total Managers</span>
                        <h2 className="value">{filteredManagers.length}</h2>
                        <span className="trend up"><ArrowUpRight size={14} /> Global Workforce</span>
>>>>>>> main
                    </div>
                </div>

                <div className="sa-stat-card">
<<<<<<< HEAD
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
=======
                    <div className="icon-circle" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        <MapPin size={24} />
                    </div>
                    <div>
                        <span className="label">Managed Branches</span>
                        <h2 className="value">{new Set(filteredManagers.map(m => m.branch)).size}</h2>
                        <span className="trend up"><ArrowUpRight size={14} /> Active Assignments</span>
>>>>>>> main
                    </div>
                </div>
            </section>

<<<<<<< HEAD
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
=======
            <div className="sa-card" style={{ border: '1px solid var(--border-color)' }}>
                {isLoading ? (
                    <div style={{ padding: '100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <Loader2 className="animate-spin" size={40} color="var(--color-red)" />
                        <span style={{ color: 'var(--color-text-dim)', fontWeight: 600 }}>Syncing Management Data...</span>
                    </div>
                ) : managers.error ? (
                    <div style={{ padding: '100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                        <Shield size={40} color="var(--color-red)" />
                        <span style={{ color: 'var(--color-text)', fontSize: '1.25rem', fontWeight: 800 }}>{managers.error}</span>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                        {filteredManagers.map((m) => (
                            <div key={m._id} className="sa-stat-card" style={{ background: 'var(--color-bg)', gap: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ width: 64, height: 64, borderRadius: '18px', background: m.profilePicture ? 'transparent' : 'rgba(255,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {m.profilePicture ? (
                                            <img src={m.profilePicture} alt={m.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <Shield size={32} color="var(--color-red)" />
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="icon-btn" style={{ width: 38, height: 38 }} onClick={() => openEdit(m)}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="icon-btn" style={{ width: 38, height: 38, color: '#ff4444' }} onClick={() => handleDelete(m._id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{m.firstName} {m.lastName}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-red)', background: 'rgba(255,0,0,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                                            ID: {m._id.slice(-6).toUpperCase()}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10B981', background: 'rgba(16,185,129,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                                            {m.branch}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-dim)', fontSize: '0.9rem', fontWeight: 600 }}>
                                        <Mail size={16} /> {m.email}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-dim)', fontSize: '0.9rem', fontWeight: 600 }}>
                                        <Phone size={16} /> {m.phone}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-dim)', fontSize: '0.9rem', fontWeight: 600 }}>
                                        <MapPin size={16} /> {m.assignedArea || 'Global Coverage'}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredManagers.length === 0 && (
                            <div style={{ padding: '60px', textAlign: 'center', width: '100%', color: 'var(--color-text-dim)', fontWeight: 600 }}>
                                No managers found matching your search.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="sa-card" style={{ maxWidth: '650px', width: '100%', padding: '40px', background: 'var(--color-surface)', border: '1px solid var(--border-color)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900 }}>{editingManager ? 'Update Manager Profile' : 'Register New Manager Account'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'var(--color-bg)', border: '1px solid var(--border-color)', color: 'var(--color-text)', borderRadius: '12px', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={20} /></button>
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
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>Corporate Email</label>
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
                                            required={!editingManager}
                                            placeholder={editingManager ? "Unchanged" : "••••••••"}
                                            style={{ width: '100%', padding: '14px 48px 14px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--color-bg)', color: 'var(--color-text)', fontWeight: 600 }}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer' }}>
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>Manager Phone & Direct Line</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--color-bg)', color: 'var(--color-text)', fontWeight: 600 }} />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>Assigned Operational Area (Optional)</label>
                                    <input type="text" name="assignedArea" value={formData.assignedArea} onChange={handleChange} placeholder="e.g. Western Province South" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--color-bg)', color: 'var(--color-text)', fontWeight: 600 }} />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>Assigned Center (Branch)</label>
                                    <select
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--color-bg)', color: 'var(--color-text)', fontWeight: 700, cursor: 'pointer', appearance: 'none' }}
                                    >
                                        <option value="">Select Branch Center</option>
                                        {!isBranchesLoading && knownBranches.map(b => {
                                            const isOccupied = managers.some(m => m.branch === b && (!editingManager || m._id !== editingManager._id));
                                            return (
                                                <option key={b} value={b} disabled={isOccupied}>
                                                    {b} {isOccupied ? '(Allocated)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="sa-action-btn" style={{ width: '100%', marginTop: '32px', background: 'var(--color-red)', color: 'white', border: 'none', padding: '18px', fontSize: '1rem', fontWeight: 900, borderRadius: '16px', display: 'flex', flexDirection: 'row' }}>
                                {editingManager ? 'Update Account Authority' : 'Provision Manager Account'}
                            </button>
>>>>>>> main
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GymManagers;
