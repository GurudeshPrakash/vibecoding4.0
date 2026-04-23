import React, { useState, useEffect } from 'react';
import {
    Phone, MapPin, ArrowLeft, User, Package, Clock, Plus, Edit2, Trash2,
    Shield, Loader2, Building2, Eye, Users, DollarSign, Calendar, CheckCircle2, AlertCircle,
    Search, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
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
        openingTime: '', closingTime: '', address: '', 
        contactNumber: '', email: '', maxCapacity: '', 
        staffAssigned: '', parkingAvailable: 'No', facilities: []
    });

    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [showStaffModal, setShowStaffModal] = useState(false);

    // ─── Filter State ───────────────────────────────────────────────────────────
    const [searchName, setSearchName] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterCity, setFilterCity] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterTime, setFilterTime] = useState('all');

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

    // ─── Filtering Logic ────────────────────────────────────────────────────
    const uniqueCities = [...new Set(assignedBranches.map(b => b.city))].filter(Boolean);

    const filteredBranches = assignedBranches.filter(branch => {
        const matchesName = !searchName || branch.name.toLowerCase().includes(searchName.toLowerCase());
        const matchesType = filterType === 'all' || branch.type === filterType;
        const matchesCity = filterCity === 'all' || branch.city === filterCity;
        
        // Status & Time Check
        const branchStatus = checkStatus(branch.openingHours || (branch.openingTime && branch.closingTime ? `${branch.openingTime} - ${branch.closingTime}` : null), currentTime);
        const matchesStatus = filterStatus === 'all' || 
            (filterStatus === 'open' && branchStatus === 'Open') || 
            (filterStatus === 'closed' && branchStatus === 'Closed');

        // Simple Time Period Filtering
        let matchesTimePeriod = filterTime === 'all';
        if (filterTime === 'open_now') matchesTimePeriod = branchStatus === 'Open';
        else if (filterTime !== 'all') {
            const [op, cl] = (branch.openingTime && branch.closingTime) ? [branch.openingTime, branch.closingTime] : [null, null];
            if (op && cl) {
                const opH = parseInt(op.split(':')[0]);
                const clH = parseInt(cl.split(':')[0]);
                if (filterTime === 'morning') matchesTimePeriod = opH <= 11;
                if (filterTime === 'afternoon') matchesTimePeriod = opH <= 16 && clH >= 12;
                if (filterTime === 'evening') matchesTimePeriod = clH >= 17;
            }
        }

        return matchesName && matchesType && matchesCity && matchesStatus && matchesTimePeriod;
    });

    // ─── Handlers ───────────────────────────────────────────────────────────
    const handleTabAction = (gym, tab) => {
        localStorage.setItem('selected_branch_context', JSON.stringify(gym));

        if (tab === 'staff') {
            const assignedStaff = staffList.find(s => 
                s.branchId === gym._id || 
                (s.branchIds && s.branchIds.includes(gym._id))
            );
            if (assignedStaff) {
                setSelectedStaff(assignedStaff);
                setShowStaffModal(true);
            } else {
                alert('No staff member assigned to this branch yet.');
            }
            return;
        }

        if (tab === 'inventory') {
            navigate('/admin/inventory');
            return;
        }

        if (setActiveTab) setActiveTab(tab);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'photoFile') {
            setFormData({ ...formData, photo: e.target.files[0] });
        } else if (name === 'facilities') {
            const updatedFacilities = formData.facilities.includes(value)
                ? formData.facilities.filter(f => f !== value)
                : [...formData.facilities, value];
            setFormData({ ...formData, facilities: updatedFacilities });
        } else {
            setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
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
                            <button 
                                className="sm-btn-add" 
                                onClick={() => { 
                                    setEditingBranch(null); 
                                    setFormData({ 
                                        name: '', city: '', type: 'AC', status: 'Active', 
                                        photo: null, phone: '', location: '', 
                                        adminName: '', adminPhone: '', 
                                        openingTime: '', closingTime: '', address: '', 
                                        contactNumber: '', email: '', maxCapacity: '', 
                                        staffAssigned: '', parkingAvailable: 'No', facilities: []
                                    }); 
                                    setShowModal(true); 
                                }}
                            >
                                <Plus size={18} /> Add Branch
                            </button>
                        </div>
                    </header>

                    <section className="sa-summary-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        <div className="live-card" style={{ padding: '16px 20px' }}>
                            <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000' }}><Building2 size={20} /></div>
                            <div className="card-data">
                                <span className="label">TOTAL BRANCHES</span>
                                <h2 className="value">{assignedBranches.length}</h2>
                            </div>
                        </div>

                        <div className="live-card" style={{ padding: '16px 20px' }}>
                            <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><CheckCircle2 size={20} /></div>
                            <div className="card-data">
                                <span className="label">AC BRANCHES</span>
                                <h2 className="value">{assignedBranches.filter(b => b.type === 'AC').length}</h2>
                            </div>
                        </div>

                        <div className="live-card" style={{ padding: '16px 20px' }}>
                            <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><AlertCircle size={20} /></div>
                            <div className="card-data">
                                <span className="label">NON-AC BRANCHES</span>
                                <h2 className="value">{assignedBranches.filter(b => b.type === 'Non-AC').length}</h2>
                            </div>
                        </div>
                    </section>

                    {/* Filter Section */}
                    <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '16px',
                        alignItems: 'center',
                        marginBottom: '32px'
                    }}>
                        {/* Search Branch */}
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                            <input 
                                type="text" 
                                placeholder="Search by branch name..."
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
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}
                            />
                        </div>

                        {/* Branch Type */}
                        <div className="sm-select-wrap">
                            <select 
                                className="sm-input" 
                                style={{ 
                                    paddingLeft: '40px',
                                    background: '#FFFFFF',
                                    border: '1px solid #CBD5E1',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">All Branches</option>
                                <option value="AC">AC Branches</option>
                                <option value="Non-AC">Non-AC Branches</option>
                            </select>
                            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}><Shield size={16} /></div>
                            <div className="sm-select-caret" style={{ right: '14px' }}><ChevronDown size={14} /></div>
                        </div>

                        {/* Open Status Filter */}
                        <div className="sm-select-wrap">
                            <select 
                                className="sm-input" 
                                style={{ 
                                    paddingLeft: '40px',
                                    background: '#FFFFFF',
                                    border: '1px solid #CBD5E1',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open Now</option>
                                <option value="closed">Closed</option>
                            </select>
                            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}><Clock size={16} /></div>
                            <div className="sm-select-caret" style={{ right: '14px' }}><ChevronDown size={14} /></div>
                        </div>

                        {/* Time Period Filter */}
                        <div className="sm-select-wrap">
                            <select 
                                className="sm-input" 
                                style={{ 
                                    paddingLeft: '40px',
                                    background: '#FFFFFF',
                                    border: '1px solid #CBD5E1',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}
                                value={filterTime}
                                onChange={(e) => setFilterTime(e.target.value)}
                            >
                                <option value="all">All Time</option>
                                <option value="open_now">Open Now</option>
                                <option value="morning">Morning (6AM-12PM)</option>
                                <option value="afternoon">Afternoon (12PM-5PM)</option>
                                <option value="evening">Evening (5PM-11PM)</option>
                            </select>
                            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}><Calendar size={16} /></div>
                            <div className="sm-select-caret" style={{ right: '14px' }}><ChevronDown size={14} /></div>
                        </div>
                    </div>

                    <div className="sa-card" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                        {isLoading ? (
                            <div style={{ padding: '100px', textAlign: 'center' }}><Loader2 className="animate-spin" size={40} color="var(--color-red)" /></div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                                {filteredBranches.map(gym => (
                                    <BranchCard
                                        key={gym._id}
                                        gym={gym}
                                        status={checkStatus(gym.openingHours || (gym.openingTime && gym.closingTime ? `${gym.openingTime} - ${gym.closingTime}` : null), currentTime)}
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
