import React, { useState, useEffect, useRef } from 'react';
import {
    Loader2, X, Edit2, Users, Plus, Trash2,
    Eye,
    Phone, MapPin, Calendar, CheckCircle2, XCircle,
    ChevronDown, Shield
} from 'lucide-react';
import '../styles/StaffManagement.css';

// ─── Admin has exactly 6 branches, each with exactly 1 staff ─────────────────
const ADMIN_BRANCHES = [
    { _id: 'b1', name: 'Colombo City Gym' },
    { _id: 'b2', name: 'Kandy Fitness Center' },
    { _id: 'b3', name: 'Galle Power Hub' },
    { _id: 'b4', name: 'Negombo Fitness' },
    { _id: 'b5', name: 'Kurunegala Gym' },
    { _id: 'b6', name: 'Jaffna Fitness' },
];

// ─── Default mock staff — exactly 1 per branch (6 total) ─────────────────────
const DEFAULT_STAFF = [
    { _id: 's1', staffId: 'STF-0001', firstName: 'Niluka', lastName: 'Perera', phone: '+94 77 111 2233', branchId: 'b1', joinDate: '2024-01-15', status: 'Active', nic: '958822334V', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80' },
    { _id: 's2', staffId: 'STF-9763', firstName: 'Mithula', lastName: 'Kuganesan', phone: '+94 76 112 7146', branchId: 'b2', joinDate: '2024-03-10', status: 'Active', nic: '985533445V', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
    { _id: 's3', staffId: 'STF-5987', firstName: 'Sugirtha', lastName: 'Kuganesan', phone: '+94 76 112 7146', branchId: 'b3', joinDate: '2023-11-05', status: 'Active', nic: '974455667V', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=400&q=80' },
    { _id: 's4', staffId: 'STF-9750', firstName: 'Vithushi', lastName: 'Kuganesan', phone: '+94 76 112 7146', branchId: 'b4', joinDate: '2025-01-20', status: 'Active', nic: '996677889V', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
    { _id: 's5', staffId: 'STF-7115', firstName: 'Guru', lastName: 'Praksh', phone: '+94 76 112 7146', branchId: 'b5', joinDate: '2024-08-01', status: 'Active', nic: '921100223V', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
    { _id: 's6', staffId: 'STF-7980', firstName: 'Kuganesan', lastName: 'Kandasamy', phone: '+94 76 112 7146', branchId: 'b6', joinDate: '2024-05-12', status: 'Active', nic: '752233445V', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
];

// ─── Colour palette for avatars ───────────────────────────────────────────────
const AVATAR_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
const getAvatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ─── Edit-only form shape (no email / role) ───────────────────────────────────
const makeEditForm = (member) => ({
    firstName: member?.firstName || '',
    lastName: member?.lastName || '',
    phone: member?.phone || '',
    nic: member?.nic || '',
    branchId: member?.branchId || '',
    joinDate: member?.joinDate || '',
    status: member?.status || 'Active',
});

const EMPTY_FORM = {
    firstName: '',
    lastName: '',
    phone: '',
    nic: '',
    branchId: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active',
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
    <span className={`sm-status-badge ${status === 'Active' ? 'sm-status-active' : 'sm-status-inactive'}`}>
        <span className="sm-status-dot" />
        {status}
    </span>
);

// ─── Detail row for View modal ────────────────────────────────────────────────
const FieldRow = ({ label, value, icon }) => (
    <div className="sm-field-row">
        <span className="sm-field-label">{label}</span>
        <div className="sm-field-value">
            {icon && <span className="sm-field-icon">{icon}</span>}
            <span>{value || '—'}</span>
        </div>
    </div>
);



// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type = 'success', visible }) => (
    <div className={`sm-toast sm-toast-${type} ${visible ? 'sm-toast-show' : ''}`}>
        <CheckCircle2 size={16} />
        <span>{message}</span>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const StaffManagement = () => {
    // ── State ────────────────────────────────────────────────────────────────
    const [staff, setStaff] = useState(() => {
        try {
            const saved = localStorage.getItem('admin_staff_db');
            return saved ? JSON.parse(saved) : DEFAULT_STAFF;
        } catch { return DEFAULT_STAFF; }
    });

    const [isLoading, setIsLoading] = useState(false);


    const [modalMode, setModalMode] = useState(null); // 'edit' | 'view'
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});


    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

    const formRef = useRef(null);

    // ── Persist ──────────────────────────────────────────────────────────────
    const persist = (updated) => {
        setStaff(updated);
        try { localStorage.setItem('admin_staff_db', JSON.stringify(updated)); } catch { }
    };

    // ── Toast helper ─────────────────────────────────────────────────────────
    const showToast = (message, type = 'success') => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
    };

    // ── Fetch from backend (mock fallback) ───────────────────────────────────
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const res = await fetch('http://localhost:5000/api/admin/staff', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    persist(data);
                }
            } catch { /* fallback to localStorage / mock */ } finally {
                setIsLoading(false);
            }
        };
        fetchStaff();
    }, []);



    // ── Helpers ──────────────────────────────────────────────────────────────
    const getBranchName = (branchId) =>
        ADMIN_BRANCHES.find(b => b._id === branchId)?.name || 'Unassigned';

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try { return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
        catch { return dateStr; }
    };

    // ── Modal handlers ───────────────────────────────────────────────────────
    const openAdd = () => {
        setFormData(EMPTY_FORM);
        setFormErrors({});
        setModalMode('add');
    };

    const openEdit = (member) => {
        setSelectedStaff(member);
        setFormData(makeEditForm(member));
        setFormErrors({});
        setModalMode('edit');
    };

    const openView = (member) => {
        setSelectedStaff(member);
        setModalMode('view');
    };

    const deleteStaff = (id) => {
        if (window.confirm('Are you sure you want to remove this staff member? This will free up the branch assignment.')) {
            const updated = staff.filter(s => s._id !== id);
            persist(updated);
            showToast('Staff removed successfully');
        }
    };

    const closeModal = () => {
        setModalMode(null);
        setSelectedStaff(null);
        setFormErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    // ── Validation (edit only, no email / role) ───────────────────────────────
    const validate = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.branchId) errors.branchId = 'Branch assignment is required';
        if (!formData.joinDate) errors.joinDate = 'Join date is required';
        return errors;
    };

    // ── Save edit ────────────────────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

        if (modalMode === 'add') {
            const newStaff = {
                ...formData,
                _id: `s${Date.now()}`,
                staffId: `STF-${Math.floor(1000 + Math.random() * 9000)}`,
            };
            persist([...staff, newStaff]);
            showToast('Staff added successfully!');
        } else {
            persist(staff.map(s => s._id === selectedStaff._id ? { ...s, ...formData } : s));
            showToast('Staff details updated successfully!');
        }
        closeModal();
    };



    // ── Stats ─────────────────────────────────────────────────────────────────
    const stats = {
        total: staff.length,
        active: staff.filter(s => s.status === 'Active').length,
        inactive: staff.filter(s => s.status === 'Inactive').length,
        branches: ADMIN_BRANCHES.length,
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (isLoading) return (
        <div className="sm-loading-screen">
            <Loader2 size={40} className="sm-spin" color="var(--color-red)" />
            <span>Loading staff data…</span>
        </div>
    );

    return (
        <div className="sm-page">
            <Toast message={toast.message} type={toast.type} visible={toast.visible} />

            {/* ── Page Header ──────────────────────────────────────────────── */}
            <div className="sm-page-header">
                <div className="sm-page-title-block">
                    <div>
                        <h1 className="sm-page-title">Staff Management</h1>
                        <p className="sm-page-subtitle">
                            Assign and manage staff for your 6 branches.
                        </p>
                    </div>
                </div>

                {staff.length < 6 && (
                    <button className="sm-btn-add" onClick={openAdd}>
                        <Plus size={18} />
                        Add Staff
                    </button>
                )}
            </div>

            {/* ── Summary Cards ────────────────────────────────────────────── */}
            <div className="sm-stats-grid">
                {[
                    { label: 'Total Staff', value: stats.total, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', icon: <Users size={20} color="#3B82F6" /> },
                    { label: 'Active', value: stats.active, color: '#10B981', bg: 'rgba(16,185,129,0.08)', icon: <CheckCircle2 size={20} color="#10B981" /> },
                    { label: 'Inactive', value: stats.inactive, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', icon: <XCircle size={20} color="#EF4444" /> },
                    { label: 'Assigned Branches', value: stats.branches, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', icon: <MapPin size={20} color="#F59E0B" /> },
                ].map((card, i) => (
                    <div key={i} className="sm-stat-card">
                        <div className="sm-stat-icon" style={{ background: card.bg }}>{card.icon}</div>
                        <div className="sm-stat-body">
                            <span className="sm-stat-label">{card.label}</span>
                            <span className="sm-stat-value" style={{ color: card.color }}>{card.value}</span>
                        </div>
                    </div>
                ))}
            </div>



            {/* ── Staff Table ───────────────────────────────────────────────── */}
            <div className="sm-card sm-table-card">
                <div className="sm-table-scroll">
                    <table className="sm-table">
                        <thead>
                            <tr>
                                {['Staff ID', 'Name', 'Branch', 'Phone Number', 'Status', 'Actions'].map((col, i) => (
                                    <th key={i} className={i === 5 ? 'sm-th-right' : ''}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {staff.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="sm-empty-row">
                                        <div className="sm-empty-state">
                                            <Users size={36} color="#CBD5E1" />
                                            <span>No staff members found.</span>
                                            <small>Try adjusting your search or filters.</small>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                staff.map((member) => {
                                    const avatarColor = getAvatarColor(member.firstName);
                                    return (
                                        <tr key={member._id} className="sm-tr">
                                            {/* Staff ID */}
                                            <td>
                                                <span className="sm-id-pill">{member.staffId}</span>
                                            </td>
                                            {/* Name */}
                                            <td>
                                                <div className="sm-name-cell">
                                                    <div
                                                        className="sm-avatar"
                                                        style={{
                                                            background: member.photo ? 'none' : `${avatarColor}18`,
                                                            color: avatarColor,
                                                            cursor: 'pointer',
                                                            overflow: 'hidden',
                                                            border: '2px solid #fff',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                        onClick={() => openView(member)}
                                                    >
                                                        {member.photo ? (
                                                            <img src={member.photo} alt={member.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            `${(member.firstName || '').charAt(0)}${(member.lastName || '').charAt(0)}`
                                                        )}
                                                    </div>
                                                    <span className="sm-name">{member.firstName} {member.lastName}</span>
                                                </div>
                                            </td>
                                            {/* Branch */}
                                            <td>
                                                <span className="sm-branch-tag">
                                                    <MapPin size={11} />
                                                    {getBranchName(member.branchId)}
                                                </span>
                                            </td>
                                            {/* Phone */}
                                            <td className="sm-phone">{member.phone || '—'}</td>
                                            {/* Status */}
                                            <td><StatusBadge status={member.status} /></td>
                                            {/* Actions */}
                                            <td className="sm-actions-cell">
                                                <div className="sm-action-btns">
                                                    {/* View */}
                                                    <button
                                                        className="sm-action-btn sm-btn-view"
                                                        title="View Details"
                                                        onClick={() => openView(member)}
                                                    >
                                                        <Eye size={14} />
                                                        <span>View</span>
                                                    </button>
                                                    {/* Edit */}
                                                    <button
                                                        className="sm-action-btn sm-btn-edit"
                                                        title="Edit Staff"
                                                        onClick={() => openEdit(member)}
                                                    >
                                                        <Edit2 size={14} />
                                                        <span>Edit</span>
                                                    </button>
                                                    {/* Delete */}
                                                    <button
                                                        className="sm-action-btn sm-btn-deactivate"
                                                        title="Remove Staff"
                                                        onClick={() => deleteStaff(member._id)}
                                                    >
                                                        <Trash2 size={14} />
                                                        <span>Remove</span>
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {staff.length > 0 && (
                    <div className="sm-table-footer">
                        <span>
                            Showing <strong>{staff.length}</strong> staff
                            member{staff.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Staff Profiles Section (New) ───────────────────────────── */}
            <div className="sm-profiles-section">
                <div className="sm-section-header">
                    <h2 className="sm-section-title">Staff Profiles</h2>
                    <p className="sm-section-subtitle">Visual overview of all assigned staff members.</p>
                </div>

                <div className="sm-profiles-grid">
                    {staff.map((member) => {
                        const avatarColor = getAvatarColor(member.firstName);
                        return (
                            <div key={member._id} className="sm-profile-card">
                                <div className="sm-profile-card-inner">
                                    <div className="sm-profile-photo-wrap">
                                        <img
                                            src={member.photo || `https://i.pravatar.cc/150?u=${member.staffId}`}
                                            alt={member.firstName}
                                            className="sm-profile-img"
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=${avatarColor.replace('#', '')}&color=fff`;
                                            }}
                                        />
                                    </div>
                                    <div className="sm-profile-details">
                                        <div className="sm-profile-top">
                                            <span className="sm-profile-id">{member.staffId}</span>
                                            <StatusBadge status={member.status} />
                                        </div>
                                        <h3 className="sm-profile-name">{member.firstName} {member.lastName}</h3>

                                        <div className="sm-profile-info-list">
                                            <div className="sm-profile-info-item">
                                                <MapPin size={14} />
                                                <span>{getBranchName(member.branchId)}</span>
                                            </div>
                                            <div className="sm-profile-info-item">
                                                <Phone size={14} />
                                                <span>{member.phone || '—'}</span>
                                            </div>
                                            <div className="sm-profile-info-item">
                                                <Shield size={14} />
                                                <span>{member.nic || '—'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ADD / EDIT MODAL                                               */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {(modalMode === 'add' || modalMode === 'edit') && (
                <div className="sm-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="sm-modal sm-modal-form" ref={formRef}>

                        {/* Header */}
                        <div className="sm-modal-header">
                            <div className="sm-modal-title-row">
                                <div className="sm-modal-icon-wrap">
                                    {modalMode === 'add' ? <Plus size={20} color="var(--color-red)" /> : <Edit2 size={20} color="var(--color-red)" />}
                                </div>
                                <div>
                                    <h2 className="sm-modal-title">
                                        {modalMode === 'add' ? 'Add New Staff' : 'Edit Staff Details'}
                                    </h2>
                                    <p className="sm-modal-subtitle">
                                        {modalMode === 'add'
                                            ? 'Fill in the details to assign a staff member to a branch.'
                                            : `Editing — ${selectedStaff.firstName} ${selectedStaff.lastName}`}
                                    </p>
                                </div>
                            </div>
                            <button className="sm-modal-close" onClick={closeModal}><X size={18} /></button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="sm-form" noValidate>
                            <div className="sm-form-grid">

                                {modalMode === 'edit' && (
                                    <div className="sm-form-group sm-half">
                                        <label className="sm-label">Staff ID</label>
                                        <input className="sm-input sm-input-readonly" value={selectedStaff.staffId} readOnly />
                                    </div>
                                )}

                                {/* Join Date */}
                                <div className="sm-form-group sm-half">
                                    <label className="sm-label">Join Date <span className="sm-req">*</span></label>
                                    <input
                                        type="date"
                                        name="joinDate"
                                        className={`sm-input ${formErrors.joinDate ? 'sm-input-error' : ''}`}
                                        value={formData.joinDate}
                                        onChange={handleChange}
                                    />
                                    {formErrors.joinDate && <span className="sm-error-msg">{formErrors.joinDate}</span>}
                                </div>

                                {/* First Name */}
                                <div className="sm-form-group sm-half">
                                    <label className="sm-label">First Name <span className="sm-req">*</span></label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className={`sm-input ${formErrors.firstName ? 'sm-input-error' : ''}`}
                                        placeholder="e.g. Amal"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                    {formErrors.firstName && <span className="sm-error-msg">{formErrors.firstName}</span>}
                                </div>

                                {/* Last Name */}
                                <div className="sm-form-group sm-half">
                                    <label className="sm-label">Last Name <span className="sm-req">*</span></label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className={`sm-input ${formErrors.lastName ? 'sm-input-error' : ''}`}
                                        placeholder="e.g. Perera"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                    {formErrors.lastName && <span className="sm-error-msg">{formErrors.lastName}</span>}
                                </div>

                                {/* Phone */}
                                <div className="sm-form-group sm-half">
                                    <label className="sm-label">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="sm-input"
                                        placeholder="+94 77 000 0000"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* NIC Number */}
                                <div className="sm-form-group sm-half">
                                    <label className="sm-label">NIC Number</label>
                                    <input
                                        type="text"
                                        name="nic"
                                        className="sm-input"
                                        placeholder="e.g. 950000000V"
                                        value={formData.nic}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Branch Assignment */}
                                <div className="sm-form-group sm-half">
                                    <label className="sm-label">
                                        Assigned Branch <span className="sm-req">*</span>
                                    </label>
                                    <div className="sm-select-wrap">
                                        <select
                                            name="branchId"
                                            className={`sm-input ${formErrors.branchId ? 'sm-input-error' : ''}`}
                                            value={formData.branchId}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select a Branch</option>
                                            {ADMIN_BRANCHES.map(branch => {
                                                const isAssigned = staff.some(s =>
                                                    s.branchId === branch._id && (modalMode === 'add' || s._id !== selectedStaff?._id)
                                                );
                                                return (
                                                    <option
                                                        key={branch._id}
                                                        value={branch._id}
                                                        disabled={isAssigned}
                                                        style={isAssigned ? { color: '#94A3B8' } : {}}
                                                    >
                                                        {branch.name} {isAssigned ? '— Assigned' : ''}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <ChevronDown size={14} className="sm-select-caret" />
                                    </div>
                                    {formErrors.branchId && <span className="sm-error-msg">{formErrors.branchId}</span>}
                                </div>


                            </div>

                            <div className="sm-modal-footer">
                                <button type="button" className="sm-btn-ghost" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="sm-btn-primary">
                                    {modalMode === 'add' ? 'Add Staff' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* VIEW MODAL                                                     */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {modalMode === 'view' && selectedStaff && (() => {
                const avatarColor = getAvatarColor(selectedStaff.firstName);
                return (
                    <div className="sm-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                        <div className="sm-modal sm-modal-view" style={{ borderRadius: '32px' }}>
                            {/* Improved Profile View Layout */}
                            <div
                                className="sm-view-banner"
                                style={{
                                    background: `linear-gradient(180deg, ${avatarColor}dd, ${avatarColor}aa)`,
                                    height: '240px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '40px 20px',
                                    textAlign: 'center'
                                }}
                            >
                                <div className="sm-view-avatar" style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    border: '6px solid #fff',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                    marginBottom: '16px',
                                    overflow: 'hidden',
                                    background: '#fff'
                                }}>
                                    {selectedStaff.photo ? (
                                        <img src={selectedStaff.photo} alt={selectedStaff.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ color: avatarColor, fontSize: '2.5rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                                            {selectedStaff.firstName.charAt(0)}{selectedStaff.lastName.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <h2 className="sm-view-name" style={{ margin: '0', fontSize: '1.6rem', color: '#fff', fontWeight: 900 }}>{selectedStaff.firstName} {selectedStaff.lastName}</h2>
                                <span className="sm-view-id" style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, marginTop: '8px' }}>{selectedStaff.staffId}</span>

                                <button className="sm-modal-close" onClick={closeModal} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(0,0,0,0.1)', border: 'none', color: '#fff' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="sm-view-body" style={{ padding: '24px 32px 32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                                    <StatusBadge status={selectedStaff.status} />
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <h3 className="sm-view-section-title">Staff Details</h3>
                                    <div className="sm-view-fields">
                                        <FieldRow label="Staff ID" value={selectedStaff.staffId} icon={<Shield size={13} />} />
                                        <FieldRow label="Full Name" value={`${selectedStaff.firstName} ${selectedStaff.lastName}`} icon={<Users size={13} />} />
                                        <FieldRow label="Branch" value={getBranchName(selectedStaff.branchId)} icon={<MapPin size={13} />} />
                                        <FieldRow label="Phone Number" value={selectedStaff.phone} icon={<Phone size={13} />} />
                                        <FieldRow label="NIC Number" value={selectedStaff.nic} icon={<Shield size={13} />} />
                                        <FieldRow label="Join Date" value={formatDate(selectedStaff.joinDate)} icon={<Calendar size={13} />} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        className="sm-btn-primary"
                                        style={{ flex: 1 }}
                                        onClick={() => { closeModal(); openEdit(selectedStaff); }}
                                    >
                                        <Edit2 size={16} /> Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default StaffManagement;
