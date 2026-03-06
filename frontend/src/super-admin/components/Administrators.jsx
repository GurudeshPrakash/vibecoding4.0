import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Search, Plus, Loader2, X, Trash2, Edit2, Shield, Eye, EyeOff, Users, ClipboardList, Activity, ArrowUpRight, CheckCircle2, AlertCircle, RefreshCcw, UserMinus, UserPlus, ArrowLeft, Clock } from 'lucide-react';
import '../styles/Administrators.css';
import AdminLogs from './AdminLogs';

const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text)' }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
    );
};

const Administrators = ({ userRole = 'super_admin' }) => {
    const isSuperAdmin = userRole === 'super_admin';
    const initBranches = () => {
        let saved = JSON.parse(localStorage.getItem('mock_branches_db') || '[]');
        if (saved.length < 24) {
            const branchNames = [
                'Colombo City Gym', 'Kandy Fitness Center', 'Galle Power Hub', 'Negombo Fitness',
                'Mount Lavinia Branch', 'Jaffna Health Center', 'Trincomalee Fitness', 'Batticaloa Iron Works',
                'Kurunegala Power House', 'Ratnapura Gym', 'Badulla Peak Fitness', 'Anuradhapura Fit',
                'Polonnaruwa Body Hub', 'Matara Extreme', 'Panadura Vitality', 'Moratuwa Fitness',
                'Nugegoda Elite', 'Maharagama Muscles', 'Dehiwala Active', 'Wattala Max fitness',
                'Gampaha Health', 'Avissawella Power Gym', 'Chilaw Beach Gym', 'Puttalam Sun Gym'
            ];
            saved = branchNames.map((name, idx) => ({ _id: `b${idx + 1}`, name }));
            localStorage.setItem('mock_branches_db', JSON.stringify(saved));
        }
        return saved;
    };

    const initAdmins = () => {
        let saved = JSON.parse(localStorage.getItem('mock_admins_db') || '[]');
        if (saved.length < 4) {
            saved = [
                { _id: 'a1', firstName: 'John', lastName: 'Doe', email: 'admin1@powerworld.com', role: 'Admin', status: 'Active', assignedBranches: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'], phone: '0771111111' },
                { _id: 'a2', firstName: 'Jane', lastName: 'Smith', email: 'admin2@powerworld.com', role: 'Admin', status: 'Active', assignedBranches: ['b7', 'b8', 'b9', 'b10', 'b11', 'b12'], phone: '0772222222' },
                { _id: 'a3', firstName: 'Mike', lastName: 'Johnson', email: 'admin3@powerworld.com', role: 'Admin', status: 'Active', assignedBranches: ['b13', 'b14', 'b15', 'b16', 'b17', 'b18'], phone: '0773333333' },
                { _id: 'a4', firstName: 'Sarah', lastName: 'Williams', email: 'admin4@powerworld.com', role: 'Admin', status: 'Inactive', assignedBranches: ['b19', 'b20', 'b21', 'b22', 'b23', 'b24'], phone: '0774444444' }
            ];
            localStorage.setItem('mock_admins_db', JSON.stringify(saved));
        }
        return saved;
    };

    const initStaff = (branchesList) => {
        let saved = JSON.parse(localStorage.getItem('admin_staff_db') || '[]');
        if (saved.length < 24) {
            saved = branchesList.map((b, i) => ({
                id: `s${i + 1}`,
                name: `Staff ${i + 1}`,
                branchId: b._id,
                branchName: b.name,
                status: 'Active'
            }));
            localStorage.setItem('admin_staff_db', JSON.stringify(saved));
        }
        return saved;
    };

    const [viewTab, setViewTab] = useState('accounts');
    const [searchQuery, setSearchQuery] = useState('');
    const [branches, setBranches] = useState(initBranches);
    const [admins, setAdmins] = useState(initAdmins);
    const [staff, setStaff] = useState(() => initStaff(initBranches()));
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Admin',
        assignedBranches: [],
        sendInvite: true,
        tempPassword: Math.random().toString(36).slice(-8).toUpperCase()
    });

    const getOtherAdminsBranches = () => {
        let assignedOthers = [];
        admins.forEach(a => {
            if (editingAdmin && a._id === editingAdmin._id) return;
            if (a.assignedBranches) {
                assignedOthers = [...assignedOthers, ...a.assignedBranches];
            }
        });
        return assignedOthers;
    };

    const handleBranchToggle = (branchId) => {
        setFormData(prev => {
            const isSelected = prev.assignedBranches.includes(branchId);
            if (isSelected) {
                return { ...prev, assignedBranches: prev.assignedBranches.filter(id => id !== branchId) };
            } else {
                if (prev.assignedBranches.length >= 6) return prev;
                return { ...prev, assignedBranches: [...prev.assignedBranches, branchId] };
            }
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            status: editingAdmin ? editingAdmin.status : 'Active',
            lastLogin: editingAdmin ? editingAdmin.lastLogin : 'Never'
        };

        const savedMock = JSON.parse(localStorage.getItem('mock_admins_db') || '[]');
        if (editingAdmin) {
            const updated = savedMock.map(a => a._id === editingAdmin._id ? { ...a, ...submitData } : a);
            localStorage.setItem('mock_admins_db', JSON.stringify(updated));
            setAdmins(updated);
        } else {
            const newItem = { ...submitData, _id: 'mock_' + Date.now() };
            savedMock.push(newItem);
            localStorage.setItem('mock_admins_db', JSON.stringify(savedMock));
            setAdmins(savedMock);
        }

        setShowModal(false);
        setEditingAdmin(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'Admin',
            assignedBranches: [],
            sendInvite: true,
            tempPassword: Math.random().toString(36).slice(-8).toUpperCase()
        });
        setShowPassword(false);
    };

    const handleToggleStatus = async (admin) => {
        const newStatus = admin.status === 'Active' ? 'Inactive' : 'Active';
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        const savedMock = JSON.parse(localStorage.getItem('mock_admins_db') || '[]');
        const updated = savedMock.map(a => a._id === admin._id ? { ...a, status: newStatus } : a);
        localStorage.setItem('mock_admins_db', JSON.stringify(updated));
        setAdmins(updated);

        if (newStatus === 'Inactive') {
            // Notification logic can be hooked up here
            alert(`Admin ${admin.firstName} is now Inactive.`);
        }
    };

    const handleResetPassword = async (email) => {
        if (!window.confirm(`Send password reset email to ${email}?`)) return;
        alert(`Invitation reset sent to ${email}`);
    };

    const openEdit = (a) => {
        setEditingAdmin(a);
        setFormData({
            firstName: a.firstName || '',
            lastName: a.lastName || '',
            email: a.email || '',
            phone: a.phone || '',
            role: a.role || 'Admin',
            assignedBranches: a.assignedBranches || [],
            sendInvite: false,
            tempPassword: ''
        });
        setShowModal(true);
    };

    const filteredAdmins = Array.isArray(admins) ? admins.filter(a => {
        const isSearchMatch = `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.email.toLowerCase().includes(searchQuery.toLowerCase());
        const isAdminRole = a.role === 'Admin' || a.role === 'Branch Admin';
        return isSearchMatch && isAdminRole;
    }) : [];

    const totalAdmins = filteredAdmins.length;
    const activeAdmins = filteredAdmins.filter(a => a.status === 'Active' || !a.status).length;
    const nonActiveAdmins = filteredAdmins.filter(a => a.status === 'Inactive').length;

    return (
        <div className="super-admin-dashboard">
            <header className="sa-header">
                <div className="sa-welcome">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Administrators
                    </h1>
                    <p style={{ margin: 0, marginTop: '4px' }}>Manage and monitor all administrators.</p>
                </div>

                <div className="sa-actions">
                    {isSuperAdmin && (
                        <button className="icon-btn" style={{ background: 'var(--color-red)', color: 'white' }} onClick={() => { setEditingAdmin(null); resetForm(); setShowModal(true); }} title="Register New Admin">
                            <Plus size={22} />
                        </button>
                    )}

                    <div className="sa-search-bar" style={{ width: '350px' }}>
                        <Search className="sa-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '24px' }}>
                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000', margin: 0 }}>
                            <Shield size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Total Admins</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{totalAdmins}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', margin: 0 }}>
                            <CheckCircle2 size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Active Admins</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{activeAdmins}</h2>
                        </div>
                    </div>
                </div>

                <div className="sa-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', margin: 0 }}>
                            <AlertCircle size={22} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="label" style={{ margin: 0 }}>Non-Active Admins</span>
                            <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{nonActiveAdmins}</h2>
                        </div>
                    </div>
                </div>
            </section>

            {viewTab === 'accounts' ? (
                <div className="sa-dashboard-layout" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="sa-card" style={{ padding: '0', overflow: 'hidden' }}>
                        {isLoading ? (
                            <div style={{ padding: '100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                <Loader2 className="animate-spin" size={40} color="var(--color-red)" />
                                <span style={{ color: 'var(--color-text-dim)', fontWeight: 600 }}>Syncing Admin Database...</span>
                            </div>
                        ) : admins.error ? (
                            <div style={{ padding: '100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Shield size={40} color="var(--color-red)" />
                                </div>
                                <span style={{ color: 'var(--color-text)', fontSize: '1.25rem', fontWeight: 800 }}>{admins.error}</span>
                            </div>
                        ) : (
                            <div className="sa-table-container">
                                <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--color-red)' }}>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>No</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Name</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Email</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Role</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Branch</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Staff</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Status</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Last Login</th>
                                            <th style={{ padding: '16px 24px', fontSize: '0.68rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAdmins.map((a, index) => (
                                            <tr key={a._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>
                                                    {String(index + 1).padStart(2, '0')}
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Shield size={18} color="var(--color-red)" />
                                                        </div>
                                                        <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>{a.firstName} {a.lastName}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{a.email}</td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--color-red)', background: 'rgba(255,0,0,0.08)', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                                                        {a.role || 'Admin'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                    {a.assignedBranches?.length > 0 ? (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                            {a.assignedBranches.map(bid => {
                                                                const b = branches.find(branch => branch._id === bid);
                                                                return b ? <span key={bid} style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>{b.name}</span> : null;
                                                            })}
                                                        </div>
                                                    ) : 'No Branches Assigned'}
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Users size={12} color="var(--color-red)" />
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                                                            {a.assignedBranches ? a.assignedBranches.length : 0}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.status === 'Inactive' ? '#EF4444' : '#10B981' }} />
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: a.status === 'Inactive' ? '#EF4444' : '#10B981' }}>{a.status || 'Active'}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{a.lastLogin || 'Never'}</td>
                                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                    {isSuperAdmin ? (
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                            <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => openEdit(a)} title="Edit Details"><Edit2 size={14} /></button>
                                                            <button className="icon-btn" style={{ width: 32, height: 32, color: a.status === 'Inactive' ? '#10B981' : '#EF4444' }} onClick={() => handleToggleStatus(a)} title={a.status === 'Inactive' ? 'Activate' : 'Disable'}><UserMinus size={14} /></button>
                                                            <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => handleResetPassword(a.email)} title="Reset Password"><RefreshCcw size={14} /></button>
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>View Only</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredAdmins.length === 0 && (
                                    <div style={{ padding: '80px', textAlign: 'center', color: 'var(--color-text-dim)', fontWeight: 600 }}>
                                        No administrators found.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="sa-card" style={{ border: '1px solid var(--border-color)' }}>
                    <div className="sa-card-header">
                        <h3>Session Historical Logs</h3>
                        <button className="view-all-link-top" onClick={() => setViewTab('accounts')}>Back to Accounts</button>
                    </div>
                    <AdminLogs embedded={true} />
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.3s ease' }}>
                    <div className="sa-card" style={{ maxWidth: '650px', width: '100%', padding: '32px', background: '#FFFFFF', border: '1px solid var(--border-color)', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserPlus size={22} color="var(--color-red)" />
                                </div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
                                    {editingAdmin ? 'Update Administrator' : 'Add New Administrator'}
                                </h2>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: '#f5f5fa', border: 'none', color: '#666', borderRadius: '10px', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {/* Basic Info */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <h4 style={{ margin: '0 0 16px 0', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Information</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text)' }}>First Name <span style={{ color: 'red' }}>*</span></label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} placeholder="e.g. John" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text)' }}>Last Name <span style={{ color: 'red' }}>*</span></label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} placeholder="e.g. Doe" />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 1' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text)' }}>Email Address <span style={{ color: 'red' }}>*</span></label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} placeholder="john@gymsys.com" />
                                </div>

                                <div style={{ gridColumn: 'span 1' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Phone Number <span style={{ color: 'var(--color-text-dim)', fontWeight: 500 }}>(Optional)</span></label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600 }} placeholder="+94 77 000 0000" />
                                </div>

                                {/* Branch Assignment */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <h4 style={{ margin: '12px 0 16px 0', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Branch Assignment</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Assign Branches (Max 6)</label>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: formData.assignedBranches.length === 6 ? '#EF4444' : '#10B981' }}>{formData.assignedBranches.length} / 6</span>
                                            </div>
                                            <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', height: '150px', overflowY: 'auto', background: '#F9FAFB', padding: '8px' }}>
                                                {branches.map(b => {
                                                    const isAssignedToOther = getOtherAdminsBranches().includes(b._id);
                                                    const isSelected = formData.assignedBranches.includes(b._id);
                                                    const isDisabled = isAssignedToOther || (!isSelected && formData.assignedBranches.length >= 6);

                                                    return (
                                                        <div key={b._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', opacity: isDisabled ? 0.5 : 1 }}>
                                                            <input
                                                                type="checkbox"
                                                                id={`branch-${b._id}`}
                                                                checked={isSelected}
                                                                disabled={isDisabled}
                                                                onChange={() => handleBranchToggle(b._id)}
                                                                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                                            />
                                                            <label htmlFor={`branch-${b._id}`} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)', cursor: isDisabled ? 'not-allowed' : 'pointer', flex: 1 }}>{b.name}</label>
                                                            {isAssignedToOther && <span style={{ fontSize: '0.6rem', color: '#EF4444', fontWeight: 800 }}>Assigned</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Setup */}
                                {!editingAdmin && (
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <h4 style={{ margin: '12px 0 16px 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Setup</h4>
                                        <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-dim)', marginBottom: '4px' }}>Temporary Password</span>
                                                    <span style={{ fontSize: '0.88rem', fontWeight: 900, color: 'var(--color-red)', letterSpacing: '0.1em' }}>{formData.tempPassword}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <input type="checkbox" id="si" name="sendInvite" checked={formData.sendInvite} onChange={handleChange} />
                                                    <label htmlFor="si" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Send Invite Link</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'white', fontWeight: 800, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--color-red)', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,0,0,0.2)' }}>
                                    {editingAdmin ? 'Update Administrator' : 'Create Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Administrators;
