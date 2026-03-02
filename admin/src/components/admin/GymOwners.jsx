import React, { useState, useEffect } from 'react';
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
    const [showModal, setShowModal] = useState(false);
    const [editingManager, setEditingManager] = useState(null);
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
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/admin/staff', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 403) {
                setManagers({ error: 'Access Denied: You do not have permission to manage staff.' });
            } else {
                const data = await response.json();
                if (response.ok) setManagers(data);
            }
        } catch (error) {
            console.error('Fetch managers error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchManagers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const existingManager = managers.find(m =>
            m.branch === formData.branch &&
            (!editingManager || m._id !== editingManager._id)
        );

        if (existingManager) {
            alert(`The branch "${formData.branch}" is already assigned to ${existingManager.firstName} ${existingManager.lastName}.`);
            return;
        }

        const token = localStorage.getItem('admin_token');
        const url = editingManager
            ? `http://localhost:5000/api/admin/staff/${editingManager._id}`
            : 'http://localhost:5000/api/admin/staff';
        const method = editingManager ? 'PUT' : 'POST';

        try {
            const formDataWithRole = { ...formData, role: 'manager' };
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formDataWithRole)
            });

            if (response.ok) {
                setShowModal(false);
                setEditingManager(null);
                setShowPassword(false);
                setFormData({
                    firstName: '', lastName: '', email: '', password: '', phone: '', branch: '', assignedArea: ''
                });
                fetchManagers();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to save manager');
            }
        } catch (error) {
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
        setFormData({
            firstName: m.firstName || '',
            lastName: m.lastName || '',
            email: m.email || '',
            password: '',
            phone: m.phone || '',
            branch: m.branch || '',
            assignedArea: m.assignedArea || ''
        });
        setShowModal(true);
    };

    const filteredManagers = Array.isArray(managers) ? managers.filter(m =>
        `${m.firstName} ${m.lastName} ${m.branch} ${m.assignedArea}`.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    return (
        <div className="super-admin-dashboard">
            <header className="sa-header">
                <div className="sa-welcome">
                    <h1>Branch Management</h1>
                    <p>Oversee gym managers and regional assignments across all locations</p>
                </div>

                <div className="sa-actions">
                    <div className="sa-search-bar" style={{ width: '350px' }}>
                        <Search className="sa-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Find manager or branch..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

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
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        <MapPin size={24} />
                    </div>
                    <div>
                        <span className="label">Managed Branches</span>
                        <h2 className="value">{new Set(filteredManagers.map(m => m.branch)).size}</h2>
                        <span className="trend up"><ArrowUpRight size={14} /> Active Assignments</span>
                    </div>
                </div>
            </section>

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
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GymManagers;
