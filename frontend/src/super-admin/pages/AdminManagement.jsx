import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Search, Plus, X, Trash2, Edit2, Shield, Users, CheckCircle2, Building2, Camera, UserPlus, Eye, ShieldCheck, Minus } from 'lucide-react';
import '../styles/AdminManagement.css';

const DEFAULT_AVATAR = '/MDH_8729webqualitysquare.webp';

const AdminManagement = ({ userRole = 'super_admin', setActiveTab, setSelectedProfileId }) => {
    const isSuperAdmin = userRole === 'super_admin';
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);

    // Load real branches from localStorage
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const savedBranches = localStorage.getItem('mock_branches_db');
        if (savedBranches) {
            setBranches(JSON.parse(savedBranches));
        } else {
            // Fallback if none created yet
            setBranches(Array.from({ length: 24 }, (_, i) => ({
                _id: `b${i + 1}`,
                name: `Branch ${String(i + 1).padStart(2, '0')}`
            })));
        }
    }, [showModal]);

    // Calculate branches assigned to other admins
    const getTakenBranches = () => {
        return admins
            .filter(a => !editingAdmin || a._id !== editingAdmin._id)
            .flatMap(a => a.assignedBranches);
    };

    // Max 4 Admins State with local public images
    const [admins, setAdmins] = useState(() => {
        const saved = localStorage.getItem('mock_admins_db');
        const defaultAdmins = [
            {
                _id: 'ADM-1001',
                firstName: 'Shahana',
                lastName: 'Kuganesan',
                email: 'shaha@vibecoding.com',
                phone: '0771234567',
                nic: '199512345678',
                lastLogin: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
                assignedBranches: ['Branch 01', 'Branch 02', 'Branch 03', 'Branch 04', 'Branch 05', 'Branch 06'],
                profilePic: '/MDH_8729webqualitysquare.webp'
            },
            {
                _id: 'ADM-1002',
                firstName: 'Prakash',
                lastName: 'Gurudesh',
                email: 'prakash@gymsys.com',
                phone: '0779990000',
                nic: '199098765432',
                lastLogin: null,
                assignedBranches: ['Branch 07', 'Branch 08', 'Branch 09', 'Branch 10', 'Branch 11', 'Branch 12'],
                profilePic: '/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg'
            },
            {
                _id: 'ADM-1003',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@gymsys.com',
                phone: '0772222222',
                nic: '199212344321',
                lastLogin: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
                assignedBranches: ['Branch 13', 'Branch 14', 'Branch 15', 'Branch 16', 'Branch 17', 'Branch 18'],
                profilePic: '/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg'
            },
            {
                _id: 'ADM-1004',
                firstName: 'Mike',
                lastName: 'Johnson',
                email: 'mike@gymsys.com',
                phone: '0768882222',
                nic: '199877776666',
                lastLogin: null,
                assignedBranches: ['Branch 19', 'Branch 20', 'Branch 21', 'Branch 22', 'Branch 23', 'Branch 24'],
                profilePic: '/download.jpg'
            },
        ];

        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.map((a, idx) => {
                const publicPics = ['/MDH_8729webqualitysquare.webp', '/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg', '/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg', '/download.jpg'];
                if (!a.profilePic || a.profilePic.includes('unsplash.com')) {
                    return { ...a, profilePic: publicPics[idx % 4] };
                }
                return a;
            });
        }
        return defaultAdmins;
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
        const takenByOthers = getTakenBranches();
        if (takenByOthers.includes(branchName)) return;

        setFormData(prev => {
            const isSelected = prev.assignedBranches.includes(branchName);
            if (isSelected) {
                return { ...prev, assignedBranches: prev.assignedBranches.filter(b => b !== branchName) };
            } else {
                if (prev.assignedBranches.length >= 6) {
                    alert("An admin can manage a maximum of 6 branches.");
                    return prev;
                }
                return { ...prev, assignedBranches: [...prev.assignedBranches, branchName] };
            }
        });
    };

    const validateForm = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.nic) {
            alert("All fields are mandatory.");
            return false;
        }

        // Phone Validation: 10 digits, starts with 0
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Please enter a valid phone number.");
            return false;
        }

        // NIC Validation: Old (9 digits + V/X) or New (12 digits)
        const nicRegex = /^([0-9]{9}[xXvV]|[0-9]{12})$/;
        if (!nicRegex.test(formData.nic)) {
            alert("Please enter a valid NIC number.");
            return false;
        }

        if (formData.assignedBranches.length === 0) {
            alert("Please assign at least one branch.");
            return false;
        }

        if (formData.assignedBranches.length > 6) {
            alert("An admin can manage a maximum of 6 branches.");
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!editingAdmin && admins.length >= 4) {
            alert("You can only add a maximum of 4 admins.");
            return;
        }

        let updatedAdmins;
        if (editingAdmin) {
            updatedAdmins = admins.map(a => a._id === editingAdmin._id ? {
                ...a,
                ...formData,
                profilePic: formData.profilePic
            } : a);
        } else {
            const newAdmin = {
                ...formData,
                _id: 'ADM-' + Math.floor(1000 + Math.random() * 9000),
                lastLogin: null,
                profilePic: formData.profilePic || DEFAULT_AVATAR
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

    // Mock Login History Data
    const [loginHistory] = useState([
        { id: 1, name: 'Shahana Kuganesan', adminId: 'ADM-1001', loginTime: '2026-03-08T08:30:00', logoutTime: null, status: 'Active' },
        { id: 2, name: 'Prakash Gurudesh', adminId: 'ADM-1002', loginTime: '2026-03-08T09:15:00', logoutTime: '2026-03-08T17:45:00', status: 'Inactive' },
        { id: 3, name: 'Jane Smith', adminId: 'ADM-1003', loginTime: '2026-03-07T10:00:00', logoutTime: '2026-03-07T18:00:00', status: 'Inactive' },
        { id: 4, name: 'Mike Johnson', adminId: 'ADM-1004', loginTime: '2026-03-06T08:00:00', logoutTime: '2026-03-06T16:00:00', status: 'Inactive' },
        { id: 5, name: 'Jane Smith', adminId: 'ADM-1003', loginTime: '2026-03-05T09:00:00', logoutTime: '2026-03-05T17:00:00', status: 'Inactive' },
    ]);

    const formatTime = (dateStr) => {
        if (!dateStr) return '*';
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const groupHistoryByDate = (history) => {
        const now = new Date();
        const today = now.toDateString();
        const yesterday = new Date(now.setDate(now.getDate() - 1)).toDateString();

        const groups = {
            'Today': [],
            'Yesterday': [],
            'Older Dates': []
        };

        history.forEach(item => {
            const date = new Date(item.loginTime).toDateString();
            if (date === today) groups['Today'].push(item);
            else if (date === yesterday) groups['Yesterday'].push(item);
            else groups['Older Dates'].push(item);
        });

        return groups;
    };

    const onAddClick = () => {
        if (admins.length >= 4) {
            alert("You can only add a maximum of 4 admins.");
            return;
        }
        resetForm();
        setShowModal(true);
    };

    return (
        <div className="super-admin-dashboard animate-fade-in" style={{ padding: '30px' }}>
            <header className="sa-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="sa-welcome">
                    <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Admin Management</h1>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>Manage system admins and branch access.</p>
                </div>

                <div className="sa-actions">
                    <button className="add-btn-premium" onClick={onAddClick}>
                        <Plus size={20} />
                        <span>Add Admin</span>
                    </button>
                </div>
            </header>

            <div className="sa-summary-grid" style={{ marginBottom: '40px' }}>
                {/* Stat cards remain same */}
                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="label">Total Admins</div>
                        <div className="value">{admins.length}</div>
                    </div>
                </div>
                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <div className="label">Active Admins</div>
                        <div className="value">{admins.filter(a => getAdminStatus(a.lastLogin) === 'Active').length}</div>
                    </div>
                </div>
                <div className="sa-stat-card">
                    <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                        <Shield size={24} style={{ opacity: 0.7 }} />
                    </div>
                    <div>
                        <div className="label">Inactive Admins</div>
                        <div className="value">{admins.filter(a => getAdminStatus(a.lastLogin) === 'Inactive').length}</div>
                    </div>
                </div>
            </div>

            <div className="admin-list-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '20px', marginBottom: '50px' }}>
                {admins.map((a) => {
                    const status = getAdminStatus(a.lastLogin);
                    return (
                        <div key={a._id} className="sa-card admin-profile-row" style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '24px',
                            position: 'relative',
                            overflow: 'hidden',
                            minHeight: '140px'
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '6px',
                                background: status === 'Active' ? '#10B981' : '#EF4444'
                            }} />

                            {/* Profile Photo */}
                            <div className="admin-profile-left" style={{ flexShrink: 0, marginRight: '30px' }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    border: '3px solid #f8fafc',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                    background: '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img
                                        src={a.profilePic || DEFAULT_AVATAR}
                                        alt={a.firstName}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                                    />
                                </div>
                            </div>

                            {/* Details Middle */}
                            <div className="admin-profile-content" style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#1e293b' }}>
                                        {a.firstName} {a.lastName}
                                    </h2>
                                    <span style={{
                                        fontSize: '0.65rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px',
                                        background: status === 'Inactive' ? '#FEE2E2' : '#DEF7EC',
                                        color: status === 'Inactive' ? '#991B1B' : '#03543F'
                                    }}>{status}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-red)', fontWeight: 700 }}>Admin ID: {a._id}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{a.phone}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{a.email}</div>
                            </div>

                            {/* Branches Right */}
                            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '8px', marginRight: '30px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                    {a.assignedBranches.map((b, idx) => (
                                        <div key={idx} style={{
                                            fontSize: '0.75rem', fontWeight: 700, color: '#475569', background: '#f8fafc',
                                            padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                        }}>
                                            {b}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions Right */}
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                <button className="row-action-btn" onClick={() => openEdit(a)} title="Edit"><Edit2 size={18} /></button>
                                <button className="row-action-btn" onClick={() => handleDelete(a._id)} style={{ color: '#EF4444' }} title="Delete"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Login History Section */}
            <div className="login-history-section">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px', color: '#1e293b' }}>Admin Login History</h2>

                <div style={{ background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '500px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }} className="custom-scrollbar">
                        {Object.entries(groupHistoryByDate(loginHistory)).map(([group, items]) => (
                            <div key={group} style={{ marginBottom: '30px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--color-red)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-red)' }} />
                                    {group}
                                </h3>

                                <table className="history-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                    <thead>
                                        <tr style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                            <th style={{ textAlign: 'left', padding: '0 15px' }}>No</th>
                                            <th style={{ textAlign: 'left', padding: '0 15px' }}>Name</th>
                                            <th style={{ textAlign: 'left', padding: '0 15px' }}>Admin ID</th>
                                            <th style={{ textAlign: 'left', padding: '0 15px' }}>Login Time</th>
                                            <th style={{ textAlign: 'left', padding: '0 15px' }}>Logout Time</th>
                                            <th style={{ textAlign: 'left', padding: '0 15px' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={item.id} style={{ background: '#f8fafc', borderRadius: '12px' }}>
                                                <td style={{ padding: '15px', fontWeight: 700, borderRadius: '12px 0 0 12px' }}>{index + 1}</td>
                                                <td style={{ padding: '15px', fontWeight: 700, color: '#1e293b' }}>{item.name}</td>
                                                <td style={{ padding: '15px', fontWeight: 700, color: '#64748b' }}>{item.adminId}</td>
                                                <td style={{ padding: '15px', fontWeight: 700, color: '#444' }}>{formatTime(item.loginTime)}</td>
                                                <td style={{ padding: '15px', fontWeight: 700, color: '#444' }}>{formatTime(item.logoutTime)}</td>
                                                <td style={{ padding: '15px', borderRadius: '0 12px 12px 0' }}>
                                                    <span style={{
                                                        fontSize: '0.65rem', fontWeight: 900, padding: '4px 10px', borderRadius: '100px',
                                                        background: item.status === 'Inactive' ? '#FEE2E2' : '#DEF7EC',
                                                        color: item.status === 'Inactive' ? '#991B1B' : '#03543F'
                                                    }}>{item.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {
                showModal && (
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
                                                <img
                                                    src={formData.profilePic}
                                                    alt="Preview"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px' }}
                                                    onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                                                />
                                            ) : (
                                                <>
                                                    <img src={DEFAULT_AVATAR} alt="Default" style={{ width: '60px', height: '60px', opacity: 0.5, borderRadius: '50%', marginBottom: '8px' }} />
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '8px', color: '#64748b' }}>Click to Upload Photo</div>
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
                                                const takenByOthers = getTakenBranches();
                                                const isTaken = takenByOthers.includes(b.name);
                                                const isDisabled = isTaken || (formData.assignedBranches.length >= 6 && !isSelected);

                                                return (
                                                    <div
                                                        key={b._id}
                                                        onClick={() => !isDisabled && toggleBranch(b.name)}
                                                        style={{
                                                            padding: '10px', borderRadius: '10px',
                                                            border: '1px solid ' + (isSelected ? 'var(--color-red)' : (isTaken ? '#cbd5e1' : '#e2e8f0')),
                                                            background: isSelected ? 'rgba(255,0,0,0.05)' : (isTaken ? '#f1f5f9' : (isDisabled ? '#f1f5f9' : '#fff')),
                                                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                            opacity: isDisabled ? 0.6 : 1,
                                                            transition: 'all 0.15s',
                                                            position: 'relative'
                                                        }}
                                                        title={isTaken ? "Already assigned to another admin" : ""}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div style={{
                                                                width: 14, height: 14, borderRadius: '3px',
                                                                border: '2px solid ' + (isSelected ? 'var(--color-red)' : (isTaken ? '#94a3b8' : '#cbd5e1')),
                                                                background: isSelected ? 'var(--color-red)' : 'transparent',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                            }}>
                                                                {isSelected && <CheckCircle2 size={10} color="#fff" />}
                                                                {isTaken && <Minus size={8} color="#94a3b8" />}
                                                            </div>
                                                            <span style={{
                                                                fontSize: '0.65rem',
                                                                fontWeight: 700,
                                                                color: isSelected ? 'var(--color-red)' : (isTaken ? '#94a3b8' : '#333'),
                                                                textDecoration: isTaken ? 'line-through' : 'none'
                                                            }}>
                                                                {b.name}
                                                            </span>
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
                )
            }
        </div >
    );
};

export default AdminManagement;
