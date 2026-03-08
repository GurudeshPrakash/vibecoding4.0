import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Search, Plus, Loader2, X, Trash2, Edit2, Eye, RefreshCcw, UserMinus, UserPlus, Users, Camera, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import '../styles/StaffManagement.css';

const StaffManagement = ({ userRole = 'super_admin', setActiveTab, setSelectedProfileId }) => {
    const isSuperAdmin = userRole === 'super_admin';
    const isAdmin = userRole === 'admin';

    const canModify = () => {
        if (isSuperAdmin) return true;
        if (isAdmin) return true;
        return false;
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [staffList, setStaffList] = useState(() => {
        const saved = localStorage.getItem('mock_staff_db');
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
    const [isLoading, setIsLoading] = useState(!localStorage.getItem('mock_staff_db'));
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        email: '',
        phone: '',
        nic: '',
        branchId: '',
        profilePhoto: null,
        photoPreview: null,
        sendInvite: true,
        tempPassword: Math.random().toString(36).slice(-8).toUpperCase()
    });

    const fetchStaff = async () => {
        if (staffList.length === 0) setIsLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/admin/staff', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter only Staff
                const onlyStaff = data.filter(s => s.role === 'Staff');
                setStaffList(onlyStaff);
                localStorage.setItem('mock_staff_db', JSON.stringify(onlyStaff));
            } else {
                throw new Error(`Server returned ${response.status}`);
            }
        } catch (error) {
            console.warn('Backend reachability issue, using mock data:', error.message);
            const savedMock = localStorage.getItem('mock_staff_db');
            if (savedMock) {
                setStaffList(JSON.parse(savedMock));
            } else {
                const defaultMocks = [
                    { _id: 's1', firstName: 'Kamal', surname: 'Silva', email: 'kamal@vibecoding.lk', phone: '+94 71 000 3333', role: 'Staff', status: 'Active', lastLogin: '3 days ago', branchId: 'b1', nic: '199512345678', profilePhoto: null },
                    { _id: 's2', firstName: 'Prakash', surname: 'Gurudesh', email: 'prakash@fitpro.lk', phone: '+94 77 555 1234', role: 'Staff', status: 'Active', lastLogin: 'Today, 09:15 AM', branchId: 'b1', nic: '199012345678', profilePhoto: null },
                    { _id: 's3', firstName: 'Nimal', surname: 'Perera', email: 'nimal@vibecoding.lk', phone: '+94 71 111 2222', role: 'Staff', status: 'Inactive', lastLogin: '5 days ago', branchId: 'b2', nic: '199812345678', profilePhoto: null }
                ];
                setStaffList(defaultMocks);
                localStorage.setItem('mock_staff_db', JSON.stringify(defaultMocks));
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
            // Keep existing branches if fetch fails
        }
    };

    useEffect(() => {
        fetchStaff();
        fetchBranches();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    profilePhoto: file,
                    photoPreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        const url = editingStaff
            ? `http://localhost:5000/api/admin/staff/${editingStaff._id}`
            : 'http://localhost:5000/api/admin/staff';
        const method = editingStaff ? 'PUT' : 'POST';

        const submitData = {
            ...formData,
            role: 'Staff',
            password: formData.tempPassword,
            status: editingStaff ? editingStaff.status : 'Active',
            lastLogin: editingStaff ? editingStaff.lastLogin : 'Never'
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
                setEditingStaff(null);
                resetForm();
                fetchStaff();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to save staff');
            }
        } catch (error) {
            console.warn('Network error, applying changes to mock database:', error.message);
            const savedMock = JSON.parse(localStorage.getItem('mock_staff_db') || '[]');
            if (editingStaff) {
                const updated = savedMock.map(s => s._id === editingStaff._id ? { ...s, ...submitData } : s);
                localStorage.setItem('mock_staff_db', JSON.stringify(updated));
            } else {
                const newItem = { ...submitData, _id: 'mock_s_' + Date.now() };
                savedMock.push(newItem);
                localStorage.setItem('mock_staff_db', JSON.stringify(savedMock));
            }
            setShowModal(false);
            setEditingStaff(null);
            resetForm();
            fetchStaff();
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            surname: '',
            email: '',
            phone: '',
            nic: '',
            branchId: '',
            profilePhoto: null,
            photoPreview: null,
            sendInvite: true,
            tempPassword: Math.random().toString(36).slice(-8).toUpperCase()
        });
    };

    const handleToggleStatus = async (staff) => {
        const token = localStorage.getItem('admin_token');
        const newStatus = staff.status === 'Inactive' ? 'Active' : 'Inactive';
        if (!window.confirm(`Are you sure you want to change status for ${staff.firstName} to ${newStatus}?`)) return;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/staff/${staff._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...staff, status: newStatus })
            });
            if (response.ok) fetchStaff();
        } catch (error) {
            const savedMock = JSON.parse(localStorage.getItem('mock_staff_db') || '[]');
            const updated = savedMock.map(s => s._id === staff._id ? { ...s, status: newStatus } : s);
            localStorage.setItem('mock_staff_db', JSON.stringify(updated));
            fetchStaff();
        }
    };

    const handleResetPassword = async (s) => {
        if (!window.confirm(`Send password reset email to ${s.email}?`)) return;
        alert(`Invitation reset sent to ${s.email}`);
    };

    const openEdit = (s) => {
        setEditingStaff(s);
        setFormData({
            firstName: s.firstName || '',
            surname: s.surname || s.lastName || '',
            email: s.email || '',
            phone: s.phone || '',
            nic: s.nic || '',
            branchId: s.branchId || '',
            profilePhoto: null,
            photoPreview: s.profilePhoto || null,
            sendInvite: false,
            tempPassword: ''
        });
        setShowModal(true);
    };

    const openAdd = () => {
        setEditingStaff(null);
        resetForm();
        setShowModal(true);
    };

    const renderStaffTable = () => {
        const filtered = Array.isArray(staffList) ? staffList.filter(s => {
            const isSearchMatch = `${s.firstName} ${s.surname || s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.email.toLowerCase().includes(searchQuery.toLowerCase());
            return isSearchMatch;
        }) : [];

        return (
            <div className="sa-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px' }}>
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(255,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={20} color="var(--color-red)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Branch Staff</h3>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>{filtered.length} staff members listed</p>
                        </div>
                    </div>
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
                            {filtered.map((s) => (
                                <tr key={s._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(255,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                {s.profilePhoto ? <img src={s.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Users size={14} color="var(--color-red)" />}
                                            </div>
                                            <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>{s.firstName} {s.surname || s.lastName}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700 }}>{branches.find(b => b._id === s.branchId)?.name || 'Central Center'}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--color-red)', background: 'rgba(255,0,0,0.08)', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                            Staff
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.status === 'Inactive' ? '#EF4444' : '#10B981' }} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: s.status === 'Inactive' ? '#EF4444' : '#10B981' }}>{s.status || 'Active'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                            <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => {
                                                if (setSelectedProfileId) setSelectedProfileId(s._id);
                                                if (setActiveTab) setActiveTab('profile');
                                            }} title="View Profile"><Eye size={12} /></button>
                                            <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => openEdit(s)} title="Edit Staff"><Edit2 size={12} /></button>
                                            <button className="icon-btn" style={{ width: 28, height: 28, color: s.status === 'Inactive' ? '#10B981' : '#EF4444' }} onClick={() => handleToggleStatus(s)} title={s.status === 'Inactive' ? 'Activate' : 'Deactivate'}><UserMinus size={12} /></button>
                                            <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => handleResetPassword(s)} title="Reset Password"><RefreshCcw size={12} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-dim)', fontWeight: 600, fontSize: '0.8rem' }}>
                            No staff members recorded in this category.
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
                    <p style={{ margin: 0, marginTop: '4px' }}>Comprehensive management of Branch Staff.</p>
                </div>

                <div className="sa-actions">
                    <div className="sa-search-bar" style={{ width: '400px' }}>
                        <Search className="sa-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search all staff members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        className="sa-add-btn"
                        onClick={openAdd}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--color-red)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: 800, cursor: 'pointer' }}
                    >
                        <Plus size={20} /> Add New Staff
                    </button>
                </div>
            </header>

            {isLoading ? (
                <div style={{ padding: '100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <Loader2 className="animate-spin" size={40} color="var(--color-red)" />
                    <span style={{ color: 'var(--color-text-dim)', fontWeight: 600 }}>Syncing Staff Records...</span>
                </div>
            ) : (
                <div style={{ marginTop: '32px' }}>
                    {renderStaffTable()}
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
                                    {editingStaff ? 'Update Staff Member' : 'Provision New Staff'}
                                </h2>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: '#f5f5fa', border: 'none', borderRadius: '10px', width: 36, height: 36, cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {/* Profile Photo Upload */}
                                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
                                    <div
                                        onClick={() => document.getElementById('profile-photo-input').click()}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            background: '#F9FAFB',
                                            border: '2px dashed #E2E8F0',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                    >
                                        {formData.photoPreview ? (
                                            <img src={formData.photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <>
                                                <Camera size={24} color="#94A3B8" />
                                                <span style={{ fontSize: '0.6rem', color: '#94A3B8', marginTop: '4px' }}>Upload Photo</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        id="profile-photo-input"
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700 }}>First Name *</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700 }}>Surname *</label>
                                    <input type="text" name="surname" value={formData.surname} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700 }}>Corporate Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700 }}>Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700 }}>NIC Number *</label>
                                    <input type="text" name="nic" value={formData.nic} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700 }}>Assign Branch</label>
                                    <select name="branchId" value={formData.branchId} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB' }}>
                                        <option value="">Select Branch...</option>
                                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>

                                {!editingStaff && (
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
                                    {editingStaff ? 'Update Staff Account' : 'Provision Staff Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffManagement;
