import React, { useState, useEffect } from 'react';
import {
    Phone, MapPin, ArrowLeft, User, Package, Clock, Plus, Edit2, Trash2,
    Shield, Loader2, Building2, Eye, Users, DollarSign, Calendar, CheckCircle2, AlertCircle
} from 'lucide-react';

// Shared UI Components
import StatusBadge from '../../shared/components/ui/StatusBadge';
import FieldRow from '../../shared/components/ui/FieldRow';

// Shared Utilities
import { checkStatus } from '../../shared/utils/timeUtils';

// Constants & Mock Data
import { ADMIN_BRANCHES, DEFAULT_STAFF } from '../constants/mockData';

// Feature Components
import BranchCard from '../components/BranchCard';
import BranchFormModal from '../components/BranchFormModal';
import StaffDetailsModal from '../components/StaffDetailsModal';
import BranchDetailsView from '../components/BranchDetailsView';

// Styles
import '../styles/BranchManagement.css';

const BranchManagement = ({ userRole = 'admin', setActiveTab }) => {
    // ─── State ──────────────────────────────────────────────────────────────
    const [selectedGym, setSelectedGym] = useState(null);
    const [currentTime] = useState(new Date());
    const [assignedBranches, setAssignedBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [formData, setFormData] = useState({
        name: '', city: '', type: 'AC', status: 'Active', photo: null,
        phone: '', location: '', adminName: '', adminPhone: '',
        operatingHours: '6:00 AM - 10:00 PM'
    });

    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [showStaffModal, setShowStaffModal] = useState(false);

    // ─── Data Syncing ───────────────────────────────────────────────────────
    const syncBranches = () => {
        setAssignedBranches(ADMIN_BRANCHES);

        try {
            const saved = localStorage.getItem('admin_staff_db');
            setStaffList(saved ? JSON.parse(saved) : DEFAULT_STAFF);
        } catch (e) {
            console.error("Failed to sync staff data", e);
        }
    };

    useEffect(() => {
        syncBranches();
        window.addEventListener('storage', syncBranches);
        return () => window.removeEventListener('storage', syncBranches);
    }, []);

    // ─── Handlers ───────────────────────────────────────────────────────────
    const handleTabAction = (gym, tab) => {
        localStorage.setItem('selected_branch_context', JSON.stringify(gym));

        if (tab === 'staff') {
            const assignedStaff = staffList.find(s => s.branchId === gym._id);
            if (assignedStaff) {
                setSelectedStaff(assignedStaff);
                setShowStaffModal(true);
            } else {
                alert('No staff member assigned to this branch yet.');
            }
            return;
        }

        if (setActiveTab) setActiveTab(tab);
    };

    const handleChange = (e) => {
        if (e.target.name === 'photoFile') {
            setFormData({ ...formData, photo: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSaveModal = async (e) => {
        e.preventDefault();
        alert('Branch data updated locally (Mock)');
        setShowModal(false);
        syncBranches();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this branch?')) return;
        alert('Branch removed (Mock)');
        if (selectedGym && selectedGym._id === id) setSelectedGym(null);
        syncBranches();
    };

    return (
        <div className="admin-dashboard animate-fade-in">
            {selectedGym ? (
                <BranchDetailsView
                    branch={selectedGym}
                    onBack={() => setSelectedGym(null)}
                    onEdit={(gym) => {
                        setEditingBranch(gym);
                        setFormData({ ...gym, photo: gym.photo });
                        setShowModal(true);
                    }}
                    onDelete={handleDelete}
                    userRole={userRole}
                    staffList={staffList}
                    onViewStaff={(member) => {
                        setSelectedStaff(member);
                        setShowStaffModal(true);
                    }}
                />
            ) : (
                <>
                    <header className="sa-header">
                        <div className="sa-welcome">
                            <h1>Branch Management</h1>
                            <p>Manage and monitor all gym branches.</p>
                        </div>

                        <div className="sa-actions">
                            {userRole === 'super_admin' && (
                                <button className="icon-btn" style={{ background: 'var(--color-red)', color: 'white' }} onClick={() => { setEditingBranch(null); setFormData({ name: '', city: '', type: 'AC', status: 'Active', photo: null, phone: '', location: '', adminName: '', adminPhone: '', operatingHours: '6:00 AM - 10:00 PM' }); setShowModal(true); }} title="Add New Branch">
                                    <Plus size={22} />
                                </button>
                            )}
                        </div>
                    </header>

                    <section className="bm-summary-grid">
                        <div className="sa-stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000', margin: 0 }}>
                                    <Building2 size={22} />
                                </div>
                                <div className="sm-stat-body">
                                    <span className="sm-stat-label">Total Branches</span>
                                    <h2 className="sm-stat-value">{assignedBranches.length}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="sa-stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', margin: 0 }}>
                                    <CheckCircle2 size={22} />
                                </div>
                                <div className="sm-stat-body">
                                    <span className="sm-stat-label">AC Branches</span>
                                    <h2 className="sm-stat-value">{assignedBranches.filter(b => b.type === 'AC').length}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="sa-stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', margin: 0 }}>
                                    <AlertCircle size={22} />
                                </div>
                                <div className="sm-stat-body">
                                    <span className="sm-stat-label">Non-AC Branches</span>
                                    <h2 className="sm-stat-value">{assignedBranches.filter(b => b.type === 'Non-AC').length}</h2>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="sa-card" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                        {isLoading ? (
                            <div style={{ padding: '100px', textAlign: 'center' }}><Loader2 className="animate-spin" size={40} color="var(--color-red)" /></div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                                {assignedBranches.map(gym => (
                                    <BranchCard
                                        key={gym._id}
                                        gym={gym}
                                        status={checkStatus(gym.openingHours, currentTime)}
                                        onViewDetails={setSelectedGym}
                                        onAction={handleTabAction}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            <BranchFormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                editingBranch={editingBranch}
                formData={formData}
                onChange={handleChange}
                onSave={handleSaveModal}
            />

            <StaffDetailsModal
                show={showStaffModal}
                onClose={() => setShowStaffModal(false)}
                staff={selectedStaff}
                branches={assignedBranches}
            />
        </div>
    );
};

export default BranchManagement;
