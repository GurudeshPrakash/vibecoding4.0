import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Phone, MapPin, ArrowLeft, User, Package, Clock, Plus, Edit2, Trash2, X,
    Shield, Loader2, Camera, CheckCircle2, AlertCircle, Building2, Eye, Users, DollarSign, Calendar
} from 'lucide-react';
import '../styles/BranchManagement.css';

// ─── Constants (Synchronized with Staff Management) ────────────────────────
const ADMIN_BRANCHES = [
    { _id: 'b1', name: 'Colombo City Gym', location: 'Colombo', openingHours: '6:00 AM - 11:00 PM', photo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80', type: 'AC' },
    { _id: 'b2', name: 'Kandy Fitness Center', location: 'Kandy', openingHours: '6:00 AM - 11:00 PM', photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', type: 'AC' },
    { _id: 'b3', name: 'Galle Power Hub', location: 'Galle', openingHours: '6:00 AM - 10:00 PM', photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', type: 'AC' },
    { _id: 'b4', name: 'Negombo Fitness', location: 'Negombo', openingHours: '6:00 AM - 10:00 PM', photo: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80', type: 'Non-AC' },
    { _id: 'b5', name: 'Kurunegala Gym', location: 'Kurunegala', openingHours: '6:00 AM - 10:00 PM', photo: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80', type: 'Non-AC' },
    { _id: 'b6', name: 'Jaffna Fitness', location: 'Jaffna', openingHours: '6:00 AM - 10:00 PM', photo: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80', type: 'Non-AC' },
];

const checkStatus = (hours, now) => {
    if (!hours) return 'Closed';
    try {
        const [start, end] = hours.split(' - ');
        if (!start || !end) return 'Closed';

        const parseTime = (timeStr) => {
            const [time, modifier] = timeStr.split(' ');
            let [h, m] = time.split(':');
            let hr = parseInt(h, 10);
            if (hr === 12) hr = 0;
            if (modifier === 'PM') hr += 12;
            return hr * 60 + parseInt(m, 10);
        };

        const startMinutes = parseTime(start);
        const endMinutes = parseTime(end);
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        return currentMinutes >= startMinutes && currentMinutes <= endMinutes ? 'Open' : 'Closed';
    } catch (e) {
        return 'Closed';
    }
};

const BranchManagement = ({ userRole = 'admin', setActiveTab }) => {
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

    const AVATAR_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    const getAvatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

    const StatusBadge = ({ status }) => (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.62rem',
            fontWeight: 800,
            padding: '4px 11px',
            borderRadius: '50px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            color: status === 'Active' ? '#059669' : '#DC2626',
            background: status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'
        }}>
            <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                flexShrink: 0,
                background: status === 'Active' ? '#10B981' : '#EF4444'
            }} />
            {status}
        </span>
    );

    const FieldRow = ({ label, value, icon }) => (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #F1F5F9'
        }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.8rem', color: '#1E293B' }}>
                {icon && <span style={{ color: 'var(--color-red)', display: 'flex' }}>{icon}</span>}
                <span>{value || '—'}</span>
            </div>
        </div>
    );

    const handleTabAction = (gym, tab) => {
        // Carry branch context over to the target tab
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

    const syncBranches = () => {
        // Branches are permanently 6, so we always show the full list
        setAssignedBranches(ADMIN_BRANCHES);

        // Sync Staff Data
        try {
            const DEFAULT_STAFF = [
                { _id: 's1', staffId: 'STF-0001', firstName: 'Niluka', lastName: 'Perera', phone: '+94 77 111 2233', branchId: 'b1', joinDate: '2024-01-15', status: 'Active', nic: '958822334V', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80' },
                { _id: 's2', staffId: 'STF-9763', firstName: 'Mithula', lastName: 'Kuganesan', phone: '+94 76 112 7146', branchId: 'b2', joinDate: '2024-03-10', status: 'Active', nic: '985533445V', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
                { _id: 's3', staffId: 'STF-5987', firstName: 'Sugirtha', lastName: 'Kuganesan', phone: '+94 76 112 7146', branchId: 'b3', joinDate: '2023-11-05', status: 'Active', nic: '974455667V', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=400&q=80' },
                { _id: 's4', staffId: 'STF-9750', firstName: 'Vithushi', lastName: 'Kuganesan', phone: '+94 76 112 7146', branchId: 'b4', joinDate: '2025-01-20', status: 'Active', nic: '996677889V', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
                { _id: 's5', staffId: 'STF-7115', firstName: 'Guru', lastName: 'Praksh', phone: '+94 76 112 7146', branchId: 'b5', joinDate: '2024-08-01', status: 'Active', nic: '921100223V', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
                { _id: 's6', staffId: 'STF-7980', firstName: 'Kuganesan', lastName: 'Kandasamy', phone: '+94 76 112 7146', branchId: 'b6', joinDate: '2024-05-12', status: 'Active', nic: '752233445V', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
            ];
            const saved = localStorage.getItem('admin_staff_db');
            setStaffList(saved ? JSON.parse(saved) : DEFAULT_STAFF);
        } catch (e) {
            console.error("Failed to sync staff data", e);
        }
    };

    useEffect(() => {
        syncBranches();
        // Still listen for storage if we want to show reactive staff info later, 
        // but for now, the list itself is static at 6.
        window.addEventListener('storage', syncBranches);
        return () => window.removeEventListener('storage', syncBranches);
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'photoFile') {
            setFormData({ ...formData, photo: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSaveModal = async (e) => {
        e.preventDefault();
        // Mock save logic for now as requested to maintain data logic
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

    const renderFormModal = () => (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="sa-card" style={{ maxWidth: '650px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MapPin size={22} color="var(--color-red)" />
                        </div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: '#1a1a1a' }}>
                            {editingBranch ? 'Update Branch' : 'Add New Branch'}
                        </h2>
                    </div>
                    <button onClick={() => setShowModal(false)} style={{ background: '#f5f5fa', border: 'none', color: '#666', borderRadius: '10px', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <form onSubmit={handleSaveModal}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Branch Name <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Colombo City Gym" required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>City <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Colombo" required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, cursor: 'pointer', fontSize: '0.78rem' }}>
                                <option value="AC">AC</option>
                                <option value="Non-AC">Non-AC</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Cover Photo</label>
                            <div style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center', background: '#F9FAFB' }}>
                                <Camera size={24} style={{ marginBottom: '8px', color: '#94a3b8' }} />
                                <input type="file" name="photoFile" accept="image/*" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                        <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'white', fontWeight: 800, cursor: 'pointer', color: '#333' }}>
                            Cancel
                        </button>
                        <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--color-red)', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,0,0,0.2)' }}>
                            {editingBranch ? 'Update Branch' : 'Create Branch'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const renderStaffModal = () => {
        if (!selectedStaff) return null;
        const avatarColor = getAvatarColor(selectedStaff.firstName);
        const branchName = assignedBranches.find(b => b._id === selectedStaff.branchId)?.name || 'Unassigned';

        return (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div className="sa-card" style={{ maxWidth: '480px', width: '100%', padding: 0, overflow: 'hidden', background: '#FFFFFF', borderRadius: '32px', border: 'none' }}>
                    <div style={{
                        background: `linear-gradient(180deg, ${avatarColor}dd, ${avatarColor}aa)`,
                        height: '220px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 20px',
                        textAlign: 'center',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: '110px',
                            height: '110px',
                            borderRadius: '50%',
                            border: '6px solid #fff',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            marginBottom: '16px',
                            overflow: 'hidden',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {selectedStaff.photo ? (
                                <img src={selectedStaff.photo} alt={selectedStaff.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ color: avatarColor, fontSize: '2.5rem', fontWeight: 900 }}>
                                    {selectedStaff.firstName.charAt(0)}{selectedStaff.lastName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <h2 style={{ margin: '0', fontSize: '1.5rem', color: '#fff', fontWeight: 900 }}>{selectedStaff.firstName} {selectedStaff.lastName}</h2>
                        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, marginTop: '8px', color: '#fff' }}>{selectedStaff.staffId}</span>

                        <button onClick={() => setShowStaffModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ padding: '24px 32px 32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <StatusBadge status={selectedStaff.status} />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px', borderBottom: '2px solid var(--color-red)', display: 'inline-block' }}>Staff Information</h3>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <FieldRow label="Staff ID" value={selectedStaff.staffId} icon={<Shield size={13} />} />
                                <FieldRow label="Full Name" value={`${selectedStaff.firstName} ${selectedStaff.lastName}`} icon={<Users size={13} />} />
                                <FieldRow label="Branch" value={branchName} icon={<MapPin size={13} />} />
                                <FieldRow label="Phone" value={selectedStaff.phone} icon={<Phone size={13} />} />
                                <FieldRow label="NIC Number" value={selectedStaff.nic} icon={<Shield size={13} />} />
                                <FieldRow label="Join Date" value={selectedStaff.joinDate} icon={<Calendar size={13} />} />
                            </div>
                        </div>

                        <button
                            onClick={() => setShowStaffModal(false)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '14px',
                                border: 'none',
                                background: 'var(--color-red)',
                                color: 'white',
                                fontWeight: 800,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(255,0,0,0.2)',
                                transition: 'all 0.2s'
                            }}
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        );
    };

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
                {showModal && renderFormModal()}
                {showStaffModal && renderStaffModal()}
            </div>
        );
    }

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
                        {assignedBranches.map(gym => {
                            const status = checkStatus(gym.openingHours, currentTime);
                            return (
                                <div key={gym._id} className="branch-premium-card">
                                    <div className="branch-card-media">
                                        <img src={gym.photo} alt={gym.name} className="branch-card-image" />
                                        <div className="branch-status-floating">
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: status === 'Open' ? '#10B981' : '#EF4444' }}></div>
                                            <span style={{ color: status === 'Open' ? '#10B981' : '#EF4444' }}>{status.toUpperCase()}</span>
                                        </div>
                                        <div className="branch-type-tag">
                                            {gym.type.toUpperCase()} PREMISES
                                        </div>
                                    </div>

                                    <div className="branch-card-body">
                                        <div className="branch-main-info">
                                            <h3>{gym.name}</h3>
                                            <div className="branch-meta-row">
                                                <div className="branch-meta-item"><MapPin size={14} /> {gym.location}</div>
                                                <div className="branch-meta-item"><Clock size={14} /> {gym.openingHours}</div>
                                            </div>
                                        </div>

                                        <div className="branch-actions-grid">
                                            <button className="branch-action-pill btn-details" onClick={() => setSelectedGym(gym)}>
                                                <Eye size={16} /> View Details
                                            </button>
                                            <button className="branch-action-pill btn-members" onClick={() => handleTabAction(gym, 'members')}>
                                                <Users size={16} /> Members
                                            </button>
                                            <button className="branch-action-pill btn-staff" onClick={() => handleTabAction(gym, 'staff')}>
                                                <Shield size={16} /> Staff Info
                                            </button>
                                            <button className="branch-action-pill btn-equipment" onClick={() => handleTabAction(gym, 'inventory')}>
                                                <Package size={16} /> Equipment
                                            </button>
                                            <button className="branch-action-pill btn-payments-wide" onClick={() => handleTabAction(gym, 'payments')}>
                                                <DollarSign size={16} /> Branch Payment Records
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {showModal && renderFormModal()}
            {showStaffModal && renderStaffModal()}
        </div>
    );
};

export default BranchManagement;
