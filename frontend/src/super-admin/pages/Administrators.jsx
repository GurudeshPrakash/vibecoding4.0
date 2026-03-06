import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Search, Plus, X, Trash2, Edit2, Shield, Users, CheckCircle2, Building2, Camera, UserPlus } from 'lucide-react';
import '../styles/Administrators.css';

const Administrators = ({ userRole = 'super_admin' }) => {
    const isSuperAdmin = userRole === 'super_admin';
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);

    // 24 branches generator
    const branches = Array.from({ length: 24 }, (_, i) => ({
        _id: `b${i + 1}`,
        name: `Branch ${String(i + 1).padStart(2, '0')}`
    }));

    // Max 4 Admins State with lastLogin logic for status
    const [admins, setAdmins] = useState(() => {
        const saved = localStorage.getItem('mock_admins_db');
        const defaultAdmins = [
            {
                _id: 'ADM-1001',
                firstName: 'Shahana',
                lastName: 'Kuganesan',
                email: 'shaha@vibecoding.com',
                phone: '+94 77 123 4567',
                nic: '199512345678',
                lastLogin: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
                assignedBranches: ['Branch 01', 'Branch 02', 'Branch 03', 'Branch 04', 'Branch 05', 'Branch 06'],
                profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
            },
            {
                _id: 'ADM-1002',
                firstName: 'Prakash',
                lastName: 'Gurudesh',
                email: 'prakash@gymsys.com',
                phone: '+94 77 999 0000',
                nic: '199098765432',
                lastLogin: null, // Never logged in
                assignedBranches: ['Branch 07', 'Branch 08', 'Branch 09', 'Branch 10', 'Branch 11', 'Branch 12'],
                profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
            },
        ];
        return saved ? JSON.parse(saved) : defaultAdmins;
    });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nic: '',
        assignedBranches: [],
        profilePic: null
    });

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            nic: '',
            assignedBranches: [],
            profilePic: null
        });
        setEditingAdmin(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePic: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleBranch = (branchName) => {
        setFormData(prev => {
            const isSelected = prev.assignedBranches.includes(branchName);
            if (isSelected) {
                return { ...prev, assignedBranches: prev.assignedBranches.filter(b => b !== branchName) };
            } else {
                if (prev.assignedBranches.length >= 6) return prev;
                return { ...prev, assignedBranches: [...prev.assignedBranches, branchName] };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!editingAdmin && admins.length >= 4) {
            alert("Sorry, you cannot add more than 4 admins.");
            return;
        }

        if (formData.assignedBranches.length !== 6) {
            alert("Please assign exactly 6 branches.");
            return;
        }

        let updatedAdmins;
        if (editingAdmin) {
            updatedAdmins = admins.map(a => a._id === editingAdmin._id ? { ...a, ...formData } : a);
        } else {
            const newAdmin = {
                ...formData,
                _id: 'ADM-' + Math.floor(1000 + Math.random() * 9000),
                lastLogin: null,
                profilePic: formData.profilePic || `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`
            };
            updatedAdmins = [...admins, newAdmin];
        }

        setAdmins(updatedAdmins);
        localStorage.setItem('mock_admins_db', JSON.stringify(updatedAdmins));
        setShowModal(false);
        resetForm();
    };

    const openEdit = (admin) => {
        setEditingAdmin(admin);
        setFormData({
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            phone: admin.phone,
            nic: admin.nic,
            assignedBranches: [...admin.assignedBranches],
            profilePic: admin.profilePic
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this admin?")) return;
        const updated = admins.filter(a => a._id !== id);
        setAdmins(updated);
        localStorage.setItem('mock_admins_db', JSON.stringify(updated));
    };

    // Calculate status based on lastLogin
    const getAdminStatus = (lastLogin) => {
        if (!lastLogin) return 'Inactive';
        const loginDate = new Date(lastLogin);
        const diffMinutes = (Date.now() - loginDate.getTime()) / (1000 * 60);
        return diffMinutes < 60 ? 'Active' : 'Inactive'; // Active if login within 1 hour for demo
    };

    const filteredAdmins = admins.filter(a => {
        const query = searchQuery.toLowerCase();
        return (
            `${a.firstName} ${a.lastName}`.toLowerCase().includes(query) ||
            a.email.toLowerCase().includes(query) ||
            a.nic?.toLowerCase().includes(query)
        );
    });

    const onAddClick = () => {
        if (admins.length >= 4) {
            alert("Sorry, you cannot add more than 4 admins.");
            return;
        }
        resetForm();
        setShowModal(true);
    };

    return (
        <div className="super-admin-dashboard animate-fade-in" style={{ padding: '30px' }}>
            <header className="sa-header" style={{ marginBottom: '40px' }}>
                <div className="sa-welcome">
                    <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Admin Management</h1>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>Manage system admins and branch access.</p>
                </div>

                <div className="sa-actions">
                    <button className="add-btn-premium" onClick={onAddClick}>
                        <Plus size={20} />
                        <span>Add Admin</span>
                    </button>

                    <div className="sa-search-bar" style={{ width: '350px' }}>
                        <Search className="sa-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search admins..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="admin-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {filteredAdmins.map((a) => {
                    const status = getAdminStatus(a.lastLogin);
                    return (
                        <div key={a._id} className="sa-card admin-clean-card" style={{ display: 'flex', alignItems: 'center', padding: '25px', borderRadius: '24px', background: '#fff', border: '1px solid #eef2f6', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }}>

                            {/* LEFT SIDE: Rounded Profile Image */}
                            <div className="admin-profile-left" style={{ flexShrink: 0, marginRight: '30px' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                    <img src={a.profilePic} alt={a.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            </div>

                            {/* CENTER: Structured Info */}
                            <div className="admin-profile-center" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr', gap: '20px' }}>
                                <div className="info-block">
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identity</span>
                                    <div style={{ fontWeight: 800, color: 'var(--color-red)', fontSize: '0.85rem', marginTop: '2px' }}>{a._id}</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{a.firstName} {a.lastName}</div>
                                </div>

                                <div className="info-block">
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Details</span>
                                    <div style={{ fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}><Phone size={14} color="var(--color-red)" /> {a.phone}</div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} color="var(--color-red)" /> {a.email}</div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '5px' }}>NIC: {a.nic}</div>
                                </div>

                                <div className="info-block">
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Branches</span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '5px' }}>
                                        {a.assignedBranches.map((b, idx) => (
                                            <div key={idx} className="branch-tag">
                                                <Building2 size={10} /> {b}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE: Status & Actions */}
                            <div className="admin-profile-right" style={{ display: 'flex', alignItems: 'center', gap: '25px', paddingLeft: '30px', borderLeft: '1px solid #f1f5f9' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <span className={`status-pill ${status.toLowerCase()}`} style={{
                                        padding: '6px 16px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 900,
                                        background: status === 'Inactive' ? '#FEE2E2' : '#DEF7EC',
                                        color: status === 'Inactive' ? '#991B1B' : '#03543F',
                                        display: 'block', minWidth: '80px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="row-action-btn" onClick={() => openEdit(a)} title="Edit"><Edit2 size={18} /></button>
                                    <button className="row-action-btn" onClick={() => handleDelete(a._id)} style={{ color: '#EF4444' }} title="Delete"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredAdmins.length === 0 && (
                    <div className="no-data-card" style={{ padding: '80px', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                        <Users size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                        <h3 style={{ color: '#64748b' }}>No administrators found</h3>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showModal && (
                <div className="modal-overlay-p" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="premium-modal-card" style={{ maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#fff', padding: '40px', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: 50, height: 50, borderRadius: '14px', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserPlus size={24} color="var(--color-red)" />
                                </div>
                                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>{editingAdmin ? 'Update Administrator' : 'Create New Admin'}</h2>
                            </div>
                            <button onClick={() => { resetForm(); setShowModal(false); }} className="modal-close-p"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <label className="p-label">First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="p-input" placeholder="e.g. Shahana" />
                                </div>
                                <div>
                                    <label className="p-label">Surname</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="p-input" placeholder="e.g. Kuganesan" />
                                </div>
                                <div>
                                    <label className="p-label">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="p-input" placeholder="shaha@vibecoding.com" />
                                </div>
                                <div>
                                    <label className="p-label">Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="p-input" placeholder="+94 77 XXX XXXX" />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label className="p-label">NIC Number</label>
                                    <input type="text" name="nic" value={formData.nic} onChange={handleChange} required className="p-input" placeholder="Enter NIC Number" />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label className="p-label">Profile Photo</label>
                                    <div className="p-upload-box" style={{ width: '100%', border: '2px dashed #e2e8f0', borderRadius: '16px', padding: '20px', textAlign: 'center', background: '#f8f9fa', position: 'relative' }}>
                                        {formData.profilePic ? (
                                            <img src={formData.profilePic} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px' }} />
                                        ) : (
                                            <>
                                                <Camera size={24} color="#94a3b8" />
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '8px', color: '#64748b' }}>Upload Admin Photo</div>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <label className="p-label" style={{ marginBottom: 0 }}>Assign Branches</label>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: formData.assignedBranches.length === 6 ? '#10B981' : 'var(--color-red)' }}>
                                            {formData.assignedBranches.length}/6 SELECTED
                                        </span>
                                    </div>
                                    <div className="p-branch-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxHeight: '250px', overflowY: 'auto', background: '#f8f9fa', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                        {branches.map(b => {
                                            const isSelected = formData.assignedBranches.includes(b.name);
                                            const isDisabled = formData.assignedBranches.length >= 6 && !isSelected;
                                            return (
                                                <div
                                                    key={b._id}
                                                    onClick={() => !isDisabled && toggleBranch(b.name)}
                                                    style={{
                                                        padding: '10px', borderRadius: '10px', border: '1px solid ' + (isSelected ? 'var(--color-red)' : '#e2e8f0'),
                                                        background: isSelected ? 'rgba(255,0,0,0.05)' : (isDisabled ? '#f1f5f9' : '#fff'),
                                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                        opacity: isDisabled ? 0.6 : 1,
                                                        transition: 'all 0.15s'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ width: 14, height: 14, borderRadius: '3px', border: '2px solid ' + (isSelected ? 'var(--color-red)' : '#cbd5e1'), background: isSelected ? 'var(--color-red)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {isSelected && <CheckCircle2 size={10} color="#fff" />}
                                                        </div>
                                                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: isSelected ? 'var(--color-red)' : '#333' }}>{b.name}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 2, padding: '16px', borderRadius: '16px', border: 'none', background: 'var(--color-red)', color: 'white', fontWeight: 800, cursor: 'pointer' }}>
                                    {editingAdmin ? 'Update Admin' : 'Add Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Administrators;
