import React, { useState, useEffect } from 'react';
import {
    Loader2, X, Users, Plus, CheckCircle2,
    MapPin, XCircle, Clock
} from 'lucide-react';

// Shared UI Components
import StatusBadge from '../../shared/components/ui/StatusBadge';

// Constants & Mock Data
import {
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
    photo: member?.photo || '',
});

const EMPTY_FORM = {
    firstName: '',
    lastName: '',
    phone: '',
    nic: '',
    branchId: '',
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
    const getBranchName = (branchId) =>
        branches.find(b => b._id === branchId || b.id === branchId)?.name || 'Unassigned';

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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errors = {};
        if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
        if (!formData.branchId) errors.branchId = 'Branch assignment is required';
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
        online: 0,
        branches: branches.length,
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
                        <p className="sm-page-subtitle">Assign and manage staff for your {branches.length} branches.</p>
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
                branches={branches}
                staffList={staff}
            />

            <StaffViewModal
                show={modalMode === 'view'}
                onClose={closeModal}
                staff={selectedStaff}
                branches={branches}
                branchName={getBranchName(selectedStaff?.branchId)}
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
