import React, { useState, useEffect } from 'react';
import {
    Loader2, X, Users, Plus, CheckCircle2,
    MapPin, XCircle, Clock
} from 'lucide-react';

// Shared UI Components
import StatusBadge from '../../shared/components/ui/StatusBadge';

// Constants & Mock Data
import {
    ADMIN_BRANCHES,
    DEFAULT_STAFF,
    AVATAR_COLORS
} from '../constants/mockData';

// Feature Components
import StaffTableRow from '../components/StaffTableRow';
import StaffProfileCard from '../components/StaffProfileCard';
import StaffFormModal from '../components/StaffFormModal';
import StaffViewModal from '../components/StaffViewModal';

// Styles
import '../styles/StaffManagement.css';

// ─── Utilities ─────────────────────────────────────────────────────────────
const getAvatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

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

// ─── Toast Sub-component ───────────────────────────────────────────────────
const Toast = ({ message, type = 'success', visible }) => (
    <div className={`sm-toast sm-toast-${type} ${visible ? 'sm-toast-show' : ''}`}>
        <CheckCircle2 size={16} />
        <span>{message}</span>
    </div>
);

const StaffManagement = ({ showCreateModal = false }) => {
    // ── State ────────────────────────────────────────────────────────────────
    const [staff, setStaff] = useState(() => {
        try {
            const saved = localStorage.getItem('admin_staff_db');
            return saved ? JSON.parse(saved) : DEFAULT_STAFF;
        } catch { return DEFAULT_STAFF; }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [modalMode, setModalMode] = useState(showCreateModal ? 'add' : null); // 'edit' | 'view' | 'add'
    const [formData, setFormData] = useState(showCreateModal ? EMPTY_FORM : {});

    const [formErrors, setFormErrors] = useState({});
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

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

    // ── Handlers ─────────────────────────────────────────────────────────────
    const getBranchName = (branchId) =>
        ADMIN_BRANCHES.find(b => b._id === branchId)?.name || 'Unassigned';

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try { return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
        catch { return dateStr; }
    };

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

    const validate = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.branchId) errors.branchId = 'Branch assignment is required';
        if (!formData.joinDate) errors.joinDate = 'Join date is required';
        return errors;
    };

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

    // ── Stats ────────────────────────────────────────────────────────────────
    const stats = {
        total: staff.length,
        online: 0,
        branches: ADMIN_BRANCHES.length,
    };

    if (isLoading) return (
        <div className="sm-loading-screen">
            <Loader2 size={40} className="sm-spin" color="var(--color-red)" />
            <span>Loading staff data…</span>
        </div>
    );

    return (
        <div className="sm-page">
            <Toast message={toast.message} type={toast.type} visible={toast.visible} />

            <div className="sm-page-header">
                <div className="sm-page-title-block">
                    <div>
                        <h1 className="sm-page-title">Staff Management</h1>
                        <p className="sm-page-subtitle">Assign and manage staff for your 6 branches.</p>
                    </div>
                </div>
                <button 
                    className="sm-btn-add" 
                    onClick={() => {
                        if (staff.length >= 6) {
                            alert("Maximum staff limit reached. You cannot add more than 6 staff members.");
                        } else {
                            openAdd();
                        }
                    }}
                >
                    <Plus size={18} /> Add Staff
                </button>
            </div>

            <div className="sm-stats-grid">
                {[
                    { label: 'Total Staff', value: stats.total, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', icon: <Users size={20} color="#3B82F6" /> },
                    { label: 'Online Now', value: stats.online, color: '#10B981', bg: 'rgba(16,185,129,0.08)', icon: <CheckCircle2 size={20} color="#10B981" /> },
                    { label: 'Total Branches', value: stats.branches, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', icon: <MapPin size={20} color="#F59E0B" /> },
                    { label: 'System Status', value: 'Live', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', icon: <Clock size={20} color="#8B5CF6" /> },
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
                                    <td colSpan={6} className="sm-empty-row">No staff found.</td>
                                </tr>
                            ) : (
                                staff.map(member => (
                                    <StaffTableRow
                                        key={member._id}
                                        member={member}
                                        branchName={getBranchName(member.branchId)}
                                        avatarColor={getAvatarColor(member.firstName)}
                                        onView={openView}
                                        onDelete={deleteStaff}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="sm-profiles-section">
                <div className="sm-section-header">
                    <h2 className="sm-section-title">Staff Profiles</h2>
                </div>
                <div className="sm-profiles-grid">
                    {staff.map(member => (
                        <StaffProfileCard
                            key={member._id}
                            member={member}
                            branchName={getBranchName(member.branchId)}
                            avatarColor={getAvatarColor(member.firstName)}
                            onView={openView}
                        />
                    ))}
                </div>
            </div>

            <StaffFormModal
                mode={modalMode}
                show={modalMode === 'add' || modalMode === 'edit'}
                onClose={closeModal}
                formData={formData}
                formErrors={formErrors}
                onChange={handleChange}
                onSubmit={handleSubmit}
                selectedStaff={selectedStaff}
                branches={ADMIN_BRANCHES}
                staffList={staff}
            />

            <StaffViewModal
                show={modalMode === 'view'}
                onClose={closeModal}
                staff={selectedStaff}
                branches={ADMIN_BRANCHES}
                branchName={getBranchName(selectedStaff?.branchId)}
                avatarColor={selectedStaff ? getAvatarColor(selectedStaff.firstName) : ''}
                onUpdate={(id, updatedData) => {
                    persist(staff.map(s => s._id === id ? { ...s, ...updatedData } : s));
                    showToast('Staff details updated successfully!');
                }}
                formatDate={formatDate}
            />
        </div>
    );
};

export default StaffManagement;
