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

    // ─── Render Sub-Views ──────────────────────────────────────────────────
    if (selectedGym) {
        const status = checkStatus(selectedGym.openingHours, currentTime);
        return (
            <div className="super-admin-dashboard animate-fade-in">
                <header className="sa-header">
                    <div className="sa-welcome">
                        <button className="icon-btn" onClick={() => setSelectedGym(null)} style={{ marginBottom: '16px' }}><ArrowLeft size={20} /></button>
                        <h1>{selectedGym.name}</h1>
                        <p><MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> {selectedGym.location}</p>
                    </div>
                    <div className="sa-actions">
                        {userRole === 'super_admin' && (
                            <>
                                <button className="icon-btn" onClick={() => { setEditingBranch(selectedGym); setFormData({ ...selectedGym, photo: selectedGym.photo }); setShowModal(true); }}><Edit2 size={20} /></button>
                                <button className="icon-btn" style={{ color: '#EF4444' }} onClick={() => handleDelete(selectedGym._id)}><Trash2 size={20} /></button>
                            </>
                        )}
                    </div>
                </header>

                <div className="sa-dashboard-layout" style={{ gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div className="sa-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <img src={selectedGym.photo} alt={selectedGym.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <div style={{ padding: '8px 16px', borderRadius: '100px', background: status === 'Open' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: status === 'Open' ? '#10B981' : '#EF4444', fontWeight: 800, fontSize: '0.7rem' }}>
                                        ● {status.toUpperCase()}
                                    </div>
                                    <span style={{ color: 'var(--color-text-dim)', fontSize: '0.65rem', fontWeight: 600 }}>{selectedGym.openingHours}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="icon-circle" style={{ width: 40, height: 40, background: 'rgba(255,0,0,0.05)' }}><User size={20} color="var(--color-red)" /></div>
                                        <div><span className="label">Branch Details</span><div style={{ fontWeight: 700 }}>Management Info</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Branch Inventory</h3>
                        </div>
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-dim)' }}>
                            Detailed inventory list and equipment status...
                        </div>
                    </div>
                </div>

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
    }

    // ─── Main View ──────────────────────────────────────────────────────────
    return (
        <div className="super-admin-dashboard">
            <header className="sa-header">
                <div className="sa-welcome">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Branch Management
                    </h1>
                    <p style={{ marginTop: '4px' }}>Manage and monitor all gym branches.</p>
                </div>

                <div className="sa-actions">
                    {userRole === 'super_admin' && (
                        <button className="icon-btn" style={{ background: 'var(--color-red)', color: 'white' }} onClick={() => { setEditingBranch(null); setFormData({ name: '', city: '', type: 'AC', status: 'Active', photo: null, phone: '', location: '', adminName: '', adminPhone: '', operatingHours: '6:00 AM - 10:00 PM' }); setShowModal(true); }} title="Add New Branch">
                            <Plus size={22} />
                        </button>
                    )}
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '24px' }}>
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
