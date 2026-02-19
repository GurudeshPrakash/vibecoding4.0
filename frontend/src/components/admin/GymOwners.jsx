import React, { useState, useMemo, useEffect } from 'react';
import {
    Phone, Mail, MapPin, ExternalLink, Calendar, Search,
    UserPlus, Edit2, Trash2, Shield, Loader2, X, Plus, Users
} from 'lucide-react';
import '../../style/AdminGymOwners.css';

const GymManagers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [managers, setManagers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingManager, setEditingManager] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', phone: '', branch: '', assignedArea: ''
    });

    const branches = [
        "Wellawatte", "Bambalapitiya", "Kollupitiya", "Kandy", "Galle",
        "Matara", "Jaffna", "Negombo", "Wattala", "Dehiwala",
        "Mount Lavinia", "Ratnapura", "Anuradhapura", "Polonnaruwa", "Kurunegala",
        "Gampaha", "Kalutara", "Panadura", "Batticaloa", "Trincomalee",
        "Nuwara Eliya", "Badulla", "Avissawella", "Maharagama"
    ];

    const fetchManagers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/admin/staff', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setManagers(data);
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

        // Check if branch is already assigned to another manager
        const existingManager = managers.find(m =>
            m.branch === formData.branch &&
            (!editingManager || m._id !== editingManager._id)
        );

        if (existingManager) {
            alert(`The branch "${formData.branch}" is already assigned to ${existingManager.firstName} ${existingManager.lastName}. Please select a different branch.`);
            return;
        }

        const token = localStorage.getItem('admin_token');
        const url = editingManager
            ? `http://localhost:5000/api/admin/staff/${editingManager._id}`
            : 'http://localhost:5000/api/admin/staff';
        const method = editingManager ? 'PUT' : 'POST';

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
                setEditingManager(null);
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

    const sortedBranches = useMemo(() => {
        // Calculate assigned branches based on current managers
        const assignedBranches = new Set(managers.map(m => m.branch).filter(Boolean));

        const unassigned = branches.filter(b => !assignedBranches.has(b)).sort();
        const assigned = branches.filter(b => assignedBranches.has(b)).sort();

        // Unassigned at top, Assigned at bottom
        return [...unassigned, ...assigned];
    }, [managers, branches]);

    const filteredManagers = managers.filter(m =>
        `${m.firstName} ${m.lastName} ${m.branch}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="owners-view">
            <header className="content-header-search">
                <div className="header-titles">
                    <h1 className="page-title">Gym Managers</h1>
                    <p className="page-subtitle">Manage and oversee all branch managers and gym owners.</p>
                </div>

                <div className="search-box-container">
                    <Search className="search-icon-inside" size={20} />
                    <input
                        type="text"
                        placeholder="Search Managers..."
                        className="dynamic-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <button className="btn-primary" onClick={() => { setEditingManager(null); setShowModal(true); }}>
                    <Plus size={18} /> New Manager
                </button>
            </header>

            <div className="owners-grid animate-fade-in" style={{ marginTop: '20px' }}>
                {isLoading ? (
                    <div style={{ padding: '100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <Loader2 className="animate-spin" size={40} color="var(--color-red)" />
                        <span style={{ color: 'var(--color-text-dim)' }}>Loading Managers...</span>
                    </div>
                ) : (
                    <>
                        {filteredManagers.map((m) => (
                            <div key={m._id} className="owner-card card">
                                <div className="owner-profile">
                                    <div className="owner-avatar" style={{ background: m.profilePicture ? 'transparent' : 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {m.profilePicture ? (
                                            <img
                                                src={m.profilePicture}
                                                alt={`${m.firstName} ${m.lastName}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'rgba(255,0,0,0.1)'; }}
                                            />
                                        ) : (
                                            <Shield size={32} color="var(--color-red)" />
                                        )}
                                    </div>
                                    <div className="owner-main-info">
                                        <h3>{m.firstName} {m.lastName}</h3>
                                        <span className="owner-id">MANAGER ID: {m._id.slice(-6).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="owner-details-list">
                                    <div className="owner-detail-item">
                                        <Mail size={16} /> <span style={{ fontSize: '0.85rem' }}>{m.email}</span>
                                    </div>
                                    <div className="owner-detail-item">
                                        <MapPin size={16} /> <span className="owned-gym-name">{m.branch}</span>
                                    </div>
                                    <div className="owner-detail-item">
                                        <Phone size={16} /> <span>{m.phone}</span>
                                    </div>
                                </div>
                                <div className="owner-card-footer">
                                    <button className="contact-btn" onClick={() => openEdit(m)}>
                                        <Edit2 size={16} /> Edit Account
                                    </button>
                                    <button className="view-gym-btn" style={{ background: '#ff4444' }} onClick={() => handleDelete(m._id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredManagers.length === 0 && (
                            <div style={{ padding: '60px', textAlign: 'center', width: '100%', color: 'var(--color-text-dim)' }}>
                                No managers found matching your search.
                            </div>
                        )}
                    </>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="modal-content card" style={{ maxWidth: '600px', width: '100%', padding: '32px', background: 'var(--color-surface)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{editingManager ? 'Update Manager' : 'Register Manager'}</h2>
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
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} required={!editingManager} placeholder={editingManager ? "Leave blank to keep current" : ""} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>Branch Assignment</label>
                                    <select
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)',
                                            background: '#1a1a1a',
                                            color: 'white',
                                            cursor: 'pointer',
                                            appearance: 'auto',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <option value="" style={{ background: '#1a1a1a', color: 'white' }}>Select Branch</option>
                                        {sortedBranches.map(b => {
                                            const isOccupied = managers.some(m => m.branch === b);
                                            // Allow selection if it's the branch currently assigned to the manager being edited
                                            const isCurrentManagerBranch = editingManager && editingManager.branch === b;
                                            const isDisabled = isOccupied && !isCurrentManagerBranch;

                                            return (
                                                <option
                                                    key={b}
                                                    value={b}
                                                    disabled={isDisabled}
                                                    style={{
                                                        background: '#1a1a1a',
                                                        color: isDisabled ? 'gray' : 'white',
                                                        fontStyle: isDisabled ? 'italic' : 'normal'
                                                    }}
                                                >
                                                    {b} {isOccupied && !isCurrentManagerBranch ? '(Assigned)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px', padding: '12px', fontWeight: 'bold' }}>
                                {editingManager ? 'Update Manager Account' : 'Register Manager'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GymManagers;
