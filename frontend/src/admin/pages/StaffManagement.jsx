import React, { useState, useEffect } from 'react';
import {
    Loader2, Users, Plus, CheckCircle2,
    UserCheck, UserMinus, Search, X, ChevronDown, Shield, Edit2, Trash2
} from 'lucide-react';

// Shared UI Components
// Constants & Mock Data
import {
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
    gender: member?.gender || '',
    designation: member?.designation || '',
    email: member?.email || '',
    address: member?.address || '',
    dob: member?.dob || '',
    emergencyContactName: member?.emergencyContactName || '',
    emergencyContactPhone: member?.emergencyContactPhone || '',
    username: member?.username || '',
    password: member?.password || '',
    confirmPassword: member?.confirmPassword || '',
    employmentType: member?.employmentType || '',
    salary: member?.salary || '',
    workingDays: member?.workingDays || [],
    shiftStartTime: member?.shiftStartTime || '',
    shiftEndTime: member?.shiftEndTime || '',
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
    gender: '',
    designation: '',
    email: '',
    address: '',
    dob: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    username: '',
    password: '',
    confirmPassword: '',
    employmentType: '',
    salary: '',
    workingDays: [],
    shiftStartTime: '',
    shiftEndTime: '',
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
    const [staff, setStaff] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [modalMode, setModalMode] = useState(showCreateModal ? 'add' : null); // 'edit' | 'view' | 'add'
    const [formData, setFormData] = useState(showCreateModal ? EMPTY_FORM : {});
    const [formErrors, setFormErrors] = useState({});
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

    const fetchStaff = async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('admin_token');
            const response = await fetch('http://localhost:5000/api/admin/staff', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStaff(data.filter(s => s.role === 'Staff'));
            }
        } catch (error) {
            console.error('Failed to fetch staff:', error);
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
        fetchStaff();
        fetchBranches();
    }, []);

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

    const deleteStaff = async (id) => {
        if (window.confirm('Are you sure you want to remove this staff member?')) {
            try {
                const token = sessionStorage.getItem('admin_token');
                const response = await fetch(`http://localhost:5000/api/admin/staff/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    fetchStaff();
                    showToast('Staff removed successfully');
                }
            } catch (error) {
                console.error('Error deleting staff:', error);
            }
        }
    };



    const closeModal = () => {
        setModalMode(null);
        setSelectedStaff(null);
        setFormErrors({});
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'workingDays') {
            const updatedDays = (formData.workingDays || []).includes(value)
                ? formData.workingDays.filter(d => d !== value)
                : [...(formData.workingDays || []), value];
            setFormData(prev => ({ ...prev, workingDays: updatedDays }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('admin_token');
            const url = modalMode === 'add' 
                ? 'http://localhost:5000/api/admin/staff'
                : `http://localhost:5000/api/admin/staff/${selectedStaff._id || selectedStaff.id}`;
            const method = modalMode === 'add' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    role: 'Staff',
                    password: formData.password || (modalMode === 'add' ? 'Staff@123' : undefined)
                })
            });

            if (response.ok) {
                fetchStaff();
                showToast(modalMode === 'add' ? 'Staff added successfully!' : 'Staff details updated successfully!');
                closeModal();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to save staff');
            }
        } catch (error) {
            console.error('Error saving staff:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Stats ────────────────────────────────────────────────────────────────
    const stats = {
        total: staff.length,
        active: staff.filter(s => s.status === 'Active').length,
        inactive: staff.filter(s => s.status === 'Inactive' || s.status === 'Offline').length,
    };

    const filteredStaff = staff.filter(member => {
        const nameQuery = searchName.toLowerCase().trim();
        const idQuery = searchId.toLowerCase().trim();
        const nicQuery = searchNic.toLowerCase().trim();

        const matchesName = !nameQuery || 
            member.firstName.toLowerCase().includes(nameQuery) ||
            member.lastName.toLowerCase().includes(nameQuery);

        const matchesId = !idQuery || 
            member.staffId?.toLowerCase().includes(idQuery);

        const matchesNic = !nicQuery || 
            member.nic?.toLowerCase().includes(nicQuery);

        const matchesBranch = filterBranch === 'all' || 
            (member.branchIds && member.branchIds.includes(filterBranch)) ||
            (member.branchId === filterBranch);

        return matchesName && matchesId && matchesNic && matchesBranch;
    });

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

            {/* Search & Filter Controls */}
            <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                alignItems: 'center',
                marginBottom: '32px'
            }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input 
                        type="text" 
                        placeholder="Search by staff name..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px 12px 48px',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#1E293B',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s'
                        }}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <Shield size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input 
                        type="text" 
                        placeholder="Search by staff ID..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px 12px 48px',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#1E293B',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s'
                        }}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <Users size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input 
                        type="text" 
                        placeholder="Search by NIC number..."
                        value={searchNic}
                        onChange={(e) => setSearchNic(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px 12px 48px',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#1E293B',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s'
                        }}
                    />
                </div>

                <div className="sm-select-wrap">
                    <select 
                        className="sm-input" 
                        style={{ 
                            padding: '11px 40px 11px 16px',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#1E293B',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                        value={filterBranch}
                        onChange={(e) => setFilterBranch(e.target.value)}
                    >
                        <option value="all">All Branches</option>
                        {ADMIN_BRANCHES.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                    <div className="sm-select-caret" style={{ right: '14px' }}><ChevronDown size={14} /></div>
                </div>
            </div>

            <div className="sm-profiles-grid">
                {filteredStaff.map(member => (
                    <StaffProfileCard
                        key={member._id}
                        member={member}
                        branchName={getBranchNames(member.branchIds || (member.branchId ? [member.branchId] : []))}
                        avatarColor={getAvatarColor(member.firstName)}
                        onView={openView}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                ))}
                {filteredStaff.length === 0 && (
                    <div className="sm-empty-row" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', color: '#64748B', fontWeight: 600 }}>
                        {((searchName || searchId || searchNic) || filterBranch !== 'all') 
                            ? 'No staff members match your chosen filters.' 
                            : 'No staff members found.'}
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
                branches={branches}
                staffList={staff}
            />

            <StaffViewModal
                show={modalMode === 'view'}
                onClose={closeModal}
                staff={selectedStaff}
                branches={ADMIN_BRANCHES}
                branchName={getBranchNames(selectedStaff?.branchIds || (selectedStaff?.branchId ? [selectedStaff.branchId] : []))}
                avatarColor={selectedStaff ? getAvatarColor(selectedStaff.firstName) : ''}
                onUpdate={async (id, updatedData) => {
                    try {
                        const token = sessionStorage.getItem('admin_token');
                        const response = await fetch(`http://localhost:5000/api/admin/staff/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(updatedData)
                        });
                        if (response.ok) {
                            fetchStaff();
                            showToast('Staff details updated successfully!');
                        }
                    } catch (error) {
                        console.error('Error updating staff:', error);
                    }
                }}
                formatDate={formatDate}
            />
        </div>
    );
};

export default StaffManagement;
