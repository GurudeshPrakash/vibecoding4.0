import React, { useState, useEffect } from 'react';
import {
    Loader2, Users, Plus, CheckCircle2,
    UserCheck, UserMinus
} from 'lucide-react';

// Shared UI Components
// Constants & Mock Data
import {
    ADMIN_BRANCHES,
    DEFAULT_STAFF,
    AVATAR_COLORS
} from '../constants/mockData';

// Feature Components
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
    branchIds: member?.branchIds || (member?.branchId ? [member.branchId] : []),
    joinDate: member?.joinDate || '',
    status: member?.status || 'Active',
    photo: member?.photo || '',
});

const EMPTY_FORM = {
    firstName: '',
    lastName: '',
    phone: '',
    nic: '',
    branchIds: [],
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    photo: '',
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

    const [selectedStaff, setSelectedStaff] = useState(null);
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
    const getBranchNames = (branchIds) => {
        if (!branchIds || branchIds.length === 0) return 'Unassigned';
        return branchIds
            .map(id => ADMIN_BRANCHES.find(b => b._id === id)?.name)
            .filter(Boolean)
            .join(', ');
    };

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
        if (!formData.branchIds || formData.branchIds.length === 0) errors.branchIds = 'At least one branch is required';
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
        active: staff.filter(s => s.status === 'Active').length,
        inactive: staff.filter(s => s.status === 'Inactive' || s.status === 'Offline').length,
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
                        <p className="sm-page-subtitle">Assign and manage staff for your branches.</p>
                    </div>
                </div>
                <button 
                    className="sm-btn-add" 
                    onClick={openAdd}
                >
                    <Plus size={18} /> Add Staff
                </button>
            </div>

            {/* Quick Cards Section */}
            <section className="sa-summary-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div className="live-card" style={{ padding: '16px 20px' }}>
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Users size={20} /></div>
                    <div className="card-data">
                        <span className="label">Total Staff</span>
                        <h2 className="value">{stats.total}</h2>
                    </div>
                </div>
                <div className="live-card" style={{ padding: '16px 20px' }}>
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><UserCheck size={20} /></div>
                    <div className="card-data">
                        <span className="label">Active Staff</span>
                        <h2 className="value">{stats.active}</h2>
                    </div>
                </div>
                <div className="live-card" style={{ padding: '16px 20px' }}>
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><UserMinus size={20} /></div>
                    <div className="card-data">
                        <span className="label">Inactive Staff</span>
                        <h2 className="value">{stats.inactive}</h2>
                    </div>
                </div>
            </section>

            <div className="sm-profiles-grid" style={{ marginTop: '32px' }}>
                {staff.map(member => (
                    <StaffProfileCard
                        key={member._id}
                        member={member}
                        branchName={getBranchNames(member.branchIds || (member.branchId ? [member.branchId] : []))}
                        avatarColor={getAvatarColor(member.firstName)}
                        onView={openView}
                    />
                ))}
                {staff.length === 0 && (
                    <div className="sm-empty-row" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', color: '#64748B', fontWeight: 600 }}>
                        No staff members found.
                    </div>
                )}
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
                branchName={getBranchNames(selectedStaff?.branchIds || (selectedStaff?.branchId ? [selectedStaff.branchId] : []))}
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
