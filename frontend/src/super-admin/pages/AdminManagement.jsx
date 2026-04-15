import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Search, Plus, X, Trash2, Edit2, Shield, Users, CheckCircle2, Building2, Camera, UserPlus, Eye, ShieldCheck, Minus } from 'lucide-react';
import '../styles/AdminManagement.css';
import AdminProfileDashboard from '../components/AdminProfileDashboard';

const DEFAULT_AVATAR = '/MDH_8729webqualitysquare.webp';

const AdminManagement = ({ userRole = 'super_admin', showCreateModal = false }) => {
    const isSuperAdmin = userRole === 'super_admin';
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(showCreateModal);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [selectedAdminView, setSelectedAdminView] = useState(null);


    // Load real branches from API
    const [branches, setBranches] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAdmins = async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/admin/admins', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAdmins(data);
            }
        } catch (error) {
            console.error('Failed to fetch admins:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const token = sessionStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/admin/branches', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBranches(data);
            }
        } catch (error) {
            console.error('Failed to fetch branches:', error);
        }
    };

    useEffect(() => {
        fetchAdmins();
        fetchBranches();
    }, [showModal]);

    // Calculate branches assigned to other admins
    const getTakenBranches = () => {
        return admins
            .filter(a => !editingAdmin || a._id !== editingAdmin._id)
            .flatMap(a => a.assignedBranches || []);
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nic: '',
        assignedBranches: [],
        profilePic: null,
        password: '' // Required for new admins
    });

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            nic: '',
            assignedBranches: [],
            profilePic: null,
            password: ''
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

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!editingAdmin && admins.length >= 4) {
            alert("You can only add a maximum of 4 admins.");
            return;
        }

        const token = sessionStorage.getItem('admin_token');
        const url = editingAdmin 
            ? `http://localhost:5000/api/admin/admins/${editingAdmin._id}` // Actually Admin editing is usually thru register/update routes
            : 'http://localhost:5000/api/admin/admins';
        
        // Wait, adminRoutes.js:
        // router.post('/admins', protect, rbac('super_admin'), registerAdmin);
        // router.delete('/admins/:id', protect, rbac('super_admin'), deleteAdmin);
        // There is no PUT /admins/:id in the routes! I should add it or use registerAdmin logic.
        // Actually I should add updateAdmin to adminRoutes.js and adminController.js
        
        try {
            const method = editingAdmin ? 'PUT' : 'POST';
            const endpoint = editingAdmin 
                ? `http://localhost:5000/api/admin/admins/${editingAdmin._id}`
                : `http://localhost:5000/api/admin/admins`;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    password: formData.password || 'Admin@123'
                })
            });

            if (response.ok) {
                setShowModal(false);
                resetForm();
                fetchAdmins();
            } else {
                const err = await response.json();
                alert(err.message || 'Failed to save admin');
            }
        } catch (error) {
            console.error('Error saving admin:', error);
            alert('Network error');
        }
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
            profilePic: admin.profilePic,
            password: '' // Don't show password
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this admin?")) return;
        const token = sessionStorage.getItem('admin_token');
        try {
            const response = await fetch(`http://localhost:5000/api/admin/admins/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchAdmins();
            } else {
                alert('Failed to delete admin');
            }
        } catch (error) {
            console.error('Error deleting admin:', error);
            alert('Network error');
        }
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

    const onAddClick = () => {
        if (admins.length >= 4) {
            alert("You can only add a maximum of 4 admins.");
            return;
        }
        resetForm();
        setShowModal(true);
    };

    if (selectedAdminView) {
        return (
            <div className="super-admin-dashboard animate-fade-in" style={{ padding: '30px' }}>
                <AdminProfileDashboard admin={selectedAdminView} onBack={() => setSelectedAdminView(null)} />
            </div>
        );
    }

    return (
        <div className="sm-page">
            <header className="sm-page-header">
                <div className="sm-page-title-block">
                    <div className="sm-page-icon">
                        <ShieldCheck size={24} color="var(--color-red)" />
                    </div>
                    <div>
                        <h1 className="sm-page-title">Admin Management</h1>
                        <p className="sm-page-subtitle">Manage system admins and branch access.</p>
                    </div>
                </div>

                <button className="sm-btn-add" onClick={onAddClick}>
                    <Plus size={18} />
                    <span>Add Admin</span>
                </button>
            </header>

            <div className="sm-stats-grid">
                <div className="sm-stat-card">
                    <div className="sm-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        <Users size={20} />
                    </div>
                    <div className="sm-stat-body">
                        <span className="sm-stat-label">Total Admins</span>
                        <h2 className="sm-stat-value">{admins.length}</h2>
                    </div>
                </div>
                <div className="sm-stat-card">
                    <div className="sm-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                        <ShieldCheck size={20} />
                    </div>
                    <div className="sm-stat-body">
                        <span className="sm-stat-label">Active Admins</span>
                        <h2 className="sm-stat-value">{admins.filter(a => getAdminStatus(a.lastLogin) === 'Active').length}</h2>
                    </div>
                </div>
                <div className="sm-stat-card">
                    <div className="sm-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                        <Shield size={20} />
                    </div>
                    <div className="sm-stat-body">
                        <span className="sm-stat-label">Inactive Admins</span>
                        <h2 className="sm-stat-value">{admins.filter(a => getAdminStatus(a.lastLogin) === 'Inactive').length}</h2>
                    </div>
                </div>
                <div className="sm-stat-card">
                    <div className="sm-stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
                        <Building2 size={20} />
                    </div>
                    <div className="sm-stat-body">
                        <span className="sm-stat-label">Total Branches</span>
                        <h2 className="sm-stat-value">{branches.length}</h2>
                    </div>
                </div>
            </div>

            <div className="sm-card sm-table-card" style={{ marginBottom: '40px' }}>
                <div className="sm-table-scroll">
                    <table className="sm-table">
                        <thead>
                            <tr>
                                <th style={{ paddingLeft: '24px' }}>Admin ID</th>
                                <th>Name</th>
                                <th>Assigned Branches</th>
                                <th>Contact Details</th>
                                <th>Status</th>
                                <th className="sm-th-right" style={{ paddingRight: '24px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((a) => {
                                const status = getAdminStatus(a.lastLogin);
                                return (
                                    <tr key={a._id} className="sm-tr" onClick={() => setSelectedAdminView(a)} style={{ cursor: 'pointer' }}>
                                        <td style={{ paddingLeft: '24px' }}>
                                            <span className="sm-id-pill">{a._id}</span>
                                        </td>
                                        <td>
                                            <div className="sm-name-cell">
                                                <div className="sm-avatar" style={{ background: '#f1f5f9', overflow: 'hidden' }}>
                                                    <img src={a.profilePic || DEFAULT_AVATAR} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <span className="sm-name">{a.firstName} {a.lastName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '300px' }}>
                                                {(a.assignedBranches || []).slice(0, 2).map((b, idx) => (
                                                    <span key={idx} className="sm-branch-tag">{b}</span>
                                                ))}
                                                {(a.assignedBranches || []).length > 2 && (
                                                    <span className="sm-branch-tag" style={{ background: '#f1f5f9' }}>+{(a.assignedBranches || []).length - 2} more</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <span className="sm-phone">{a.phone}</span>
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{a.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`sm-status-badge ${status === 'Active' ? 'sm-status-active' : 'sm-status-inactive'}`}>
                                                <div className="sm-status-dot" />
                                                {status}
                                            </span>
                                        </td>
                                        <td className="sm-actions-cell" style={{ paddingRight: '24px' }}>
                                            <div className="sm-action-btns">
                                                <button className="sm-action-btn sm-btn-view" onClick={(e) => { e.stopPropagation(); setSelectedAdminView(a); }}>
                                                    <Eye size={14} /> <span>View</span>
                                                </button>
                                                <button className="sm-action-btn sm-btn-edit" onClick={(e) => { e.stopPropagation(); openEdit(a); }}>
                                                    <Edit2 size={14} /> <span>Edit</span>
                                                </button>
                                                <button className="sm-action-btn sm-btn-deactivate" onClick={(e) => { e.stopPropagation(); handleDelete(a._id); }}>
                                                    <Trash2 size={14} /> <span>Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="sm-profiles-section">
                <div className="sm-section-header">
                    <h2 className="sm-section-title">Administrator Profiles</h2>
                </div>
                <div className="sm-profiles-grid">
                    {admins.map((a) => {
                        const status = getAdminStatus(a.lastLogin);
                        return (
                            <div key={a._id} className="sa-card admin-profile-row" onClick={() => setSelectedAdminView(a)} style={{ cursor: 'pointer', padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #f8fafc', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                                        <img src={a.profilePic || DEFAULT_AVATAR} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>{a.firstName}</h3>
                                        <span className={`sm-status-badge ${status === 'Active' ? 'sm-status-active' : 'sm-status-inactive'}`} style={{ marginTop: '4px' }}>{status}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div className="sm-id-pill" style={{ alignSelf: 'flex-start' }}>{a._id}</div>
                                    <div className="sm-phone">{a.phone}</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                                        {(a.assignedBranches || []).map((b, idx) => (
                                            <span key={idx} className="sm-branch-tag">{b}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="login-history-section" style={{ marginTop: '50px' }}>
                <div className="sm-section-header">
                    <h2 className="sm-section-title">Admin Login History</h2>
                </div>

                <div className="sm-card sm-table-card">
                    <div className="sm-table-scroll" style={{ height: '500px' }}>
                        <table className="sm-table">
                            <thead>
                                <tr>
                                    <th style={{ paddingLeft: '24px' }}>No</th>
                                    <th>Name</th>
                                    <th>Admin ID</th>
                                    <th>Login Time</th>
                                    <th>Logout Time</th>
                                    <th className="sm-th-right" style={{ paddingRight: '24px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loginHistory.map((item, index) => (
                                    <tr key={item.id} className="sm-tr">
                                        <td style={{ paddingLeft: '24px' }}>{index + 1}</td>
                                        <td><span className="sm-name">{item.name}</span></td>
                                        <td><span className="sm-id-pill">{item.adminId}</span></td>
                                        <td><span className="sm-phone">{formatTime(item.loginTime)}</span></td>
                                        <td><span className="sm-phone">{formatTime(item.logoutTime)}</span></td>
                                        <td className="sm-actions-cell" style={{ paddingRight: '24px' }}>
                                            <span className={`sm-status-badge ${item.status === 'Active' ? 'sm-status-active' : 'sm-status-inactive'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {showModal && (
                <div className="sm-overlay">
                    <div className="sm-modal sm-modal-form">
                        <div className="sm-modal-header">
                            <div className="sm-modal-title-row">
                                <div className="sm-modal-icon-wrap">
                                    <UserPlus size={22} color="var(--color-red)" />
                                </div>
                                <div>
                                    <h2 className="sm-modal-title">{editingAdmin ? 'Update Administrator' : 'Create New Admin'}</h2>
                                    <p className="sm-modal-subtitle">Fill in the details to {editingAdmin ? 'update' : 'add'} an administrator.</p>
                                </div>
                            </div>
                            <button onClick={() => { resetForm(); setShowModal(false); }} className="sm-modal-close"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="sm-form">
                            <div className="sm-form-grid">
                                <div className="sm-form-group sm-half">
                                    <label className="sm-label">First Name <span className="sm-req">*</span></label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="sm-input" placeholder="e.g. Shahana" />
                                </div>
                                <div className="sm-form-group sm-half">
                                    <label className="sm-label">Surname <span className="sm-req">*</span></label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="sm-input" placeholder="e.g. Kuganesan" />
                                </div>
                                <div className="sm-form-group sm-half">
                                    <label className="sm-label">Email Address <span className="sm-req">*</span></label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="sm-input" placeholder="shaha@vibecoding.com" />
                                </div>
                                <div className="sm-form-group sm-half">
                                    <label className="sm-label">Phone Number <span className="sm-req">*</span></label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="sm-input" placeholder="0779990000" />
                                </div>
                                <div className="sm-form-group sm-full">
                                    <label className="sm-label">NIC Number <span className="sm-req">*</span></label>
                                    <input type="text" name="nic" value={formData.nic} onChange={handleChange} required className="sm-input" placeholder="Enter NIC Number" />
                                </div>

                                <div className="sm-form-group sm-full">
                                    <label className="sm-label">Profile Photo</label>
                                    <div style={{ position: 'relative', height: '100px', width: '100px', borderRadius: '16px', overflow: 'hidden', border: '2px dashed #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {formData.profilePic ? (
                                            <img src={formData.profilePic} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <Camera size={24} color="#94A3B8" />
                                        )}
                                        <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                    </div>
                                    <span style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '4px' }}>Click to upload (Recommended: Square)</span>
                                </div>

                                <div className="sm-form-group sm-full">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <label className="sm-label" style={{ marginBottom: 0 }}>Assign Branches</label>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: formData.assignedBranches.length === 6 ? '#10B981' : 'var(--color-red)' }}>
                                            {formData.assignedBranches.length}/6 SELECTED
                                        </span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxHeight: '200px', overflowY: 'auto', padding: '12px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
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
                                                        padding: '8px', borderRadius: '8px',
                                                        border: '1.5px solid ' + (isSelected ? 'var(--color-red)' : (isTaken ? '#E2E8F0' : '#E2E8F0')),
                                                        background: isSelected ? 'rgba(239, 68, 68, 0.05)' : (isTaken ? '#F1F5F9' : '#fff'),
                                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                        opacity: isDisabled ? 0.6 : 1,
                                                        transition: 'all 0.15s',
                                                        display: 'flex', alignItems: 'center', gap: '8px'
                                                    }}
                                                >
                                                    <div style={{ width: 14, height: 14, borderRadius: '3px', border: '2px solid ' + (isSelected ? 'var(--color-red)' : '#CBD5E1'), background: isSelected ? 'var(--color-red)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {isSelected && <CheckCircle2 size={10} color="#fff" />}
                                                    </div>
                                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: isSelected ? 'var(--color-red)' : '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="sm-modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="sm-btn-ghost">Cancel</button>
                                <button type="submit" className="sm-btn-primary">
                                    {editingAdmin ? 'Update Administrator' : 'Add Administrator'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
};

export default AdminManagement;
