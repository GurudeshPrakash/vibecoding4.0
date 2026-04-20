import React, { useState, useEffect } from 'react';
import { X, Edit2, Shield, Users, MapPin, Phone, Calendar, Save, RotateCcw, Clock } from 'lucide-react';
import FieldRow from '../../shared/components/ui/FieldRow';

const StaffViewModal = ({
    show,
    onClose,
    staff,
    branches,
    branchName,
    avatarColor,
    onUpdate,
    formatDate
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        if (staff) {
            setEditForm({
                firstName: staff.firstName,
                lastName: staff.lastName,
                phone: staff.phone,
                branchIds: staff.branchIds || (staff.branchId ? [staff.branchId] : []),
                photo: staff.photo || ''
            });
            setIsEditing(false);
        }
    }, [staff, show]);

    if (!show || !staff) return null;

    const handleSave = () => {
        onUpdate(staff._id, editForm);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="sm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="sm-modal sm-modal-view" style={{ 
                borderRadius: '32px', 
                overflow: 'hidden', 
                background: '#fff',
                height: '90vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Fixed Header */}
                {/* Modern Profile Header */}
                <div style={{ 
                    padding: '32px 32px 24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '24px',
                    borderBottom: '1px solid #F1F5F9'
                }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            padding: '4px',
                            background: '#fff',
                            border: '3px solid rgba(239, 68, 68, 0.1)',
                            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.12)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {staff.photo ? (
                                <img src={staff.photo} alt={staff.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            ) : (
                                <div style={{ 
                                    width: '100%', height: '100%', borderRadius: '50%',
                                    background: avatarColor || 'var(--color-red)', color: 'white', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem', fontWeight: 900 
                                }}>
                                    {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#1E293B', fontWeight: 900 }}>
                                {staff.firstName} {staff.lastName}
                            </h2>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                background: staff.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                padding: '4px 12px',
                                borderRadius: '50px',
                                color: staff.status === 'Active' ? '#10B981' : '#64748B',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                textTransform: 'uppercase'
                            }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: staff.status === 'Active' ? '#10B981' : '#64748B' }} />
                                {staff.status === 'Active' ? 'Online' : 'Offline'}
                            </div>
                        </div>
                        <div style={{ marginTop: '4px', fontSize: '0.9rem', fontWeight: 700, color: '#EF4444' }}>
                            {staff.designation || 'Staff'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: '#64748B', fontSize: '0.8rem', fontWeight: 600 }}>
                            <MapPin size={14} color="#EF4444" />
                            {branchName}
                        </div>
                    </div>

                    <button 
                        onClick={onClose} 
                        style={{ 
                            alignSelf: 'flex-start',
                            background: '#F1F5F9', 
                            border: 'none', 
                            color: '#64748B', 
                            width: '36px', 
                            height: '36px', 
                            borderRadius: '50%', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content Section */}
                <div className="sm-view-scroll-content custom-scrollbar" style={{ 
                    flex: 1, 
                    overflowY: 'auto',
                    padding: '32px'
                }}>
                    {!isEditing ? (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {/* Left Column */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {[
                                        { label: 'Staff ID', value: staff.staffId, icon: <Shield size={16} /> },
                                        { label: 'Phone Number', value: staff.phone, icon: <Phone size={16} /> },
                                        { label: 'NIC Number', value: staff.nic, icon: <Shield size={16} /> }
                                    ].map((field, idx) => (
                                        <div key={idx} style={{ 
                                            background: '#fff', 
                                            padding: '16px', 
                                            borderRadius: '16px', 
                                            border: '1px solid #F1F5F9',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                        }}>
                                            <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>{field.label}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ color: '#EF4444' }}>{field.icon}</div>
                                                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B' }}>{field.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Right Column */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {[
                                        { label: 'Assigned Branch', value: branchName, icon: <MapPin size={16} /> },
                                        { label: 'Login Status', value: staff.status === 'Active' ? 'Online' : 'Offline', icon: <Clock size={16} /> },
                                        { label: 'Join Date', value: formatDate(staff.joinDate), icon: <Calendar size={16} /> }
                                    ].map((field, idx) => (
                                        <div key={idx} style={{ 
                                            background: '#fff', 
                                            padding: '16px', 
                                            borderRadius: '16px', 
                                            border: '1px solid #F1F5F9',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                        }}>
                                            <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>{field.label}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ color: '#EF4444' }}>{field.icon}</div>
                                                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B' }}>{field.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: '32px' }}>
                                <button
                                    className="sm-btn-primary"
                                    style={{ 
                                        width: '100%', 
                                        padding: '16px', 
                                        borderRadius: '16px', 
                                        background: '#EF4444', 
                                        color: '#fff', 
                                        fontWeight: 800, 
                                        border: 'none',
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '10px', 
                                        boxShadow: '0 8px 20px rgba(239, 68, 68, 0.2)',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit2 size={18} /> Edit Staff Profile
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="sm-edit-view">
                            {/* Profile Photo Edit */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                                <div style={{ position: 'relative' }}>
                                    <div 
                                        style={{ 
                                            width: '100px', 
                                            height: '100px', 
                                            borderRadius: '50%', 
                                            overflow: 'hidden', 
                                            border: '3px solid #fff', 
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                            background: '#F8FAFC',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => document.getElementById('view-staff-photo-upload').click()}
                                    >
                                        {editForm.photo ? (
                                            <img src={editForm.photo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                        ) : (
                                            <div style={{ color: '#94A3B8', fontSize: '1.2rem', fontWeight: 900 }}>
                                                {editForm.firstName?.charAt(0)}{editForm.lastName?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        id="view-staff-photo-upload" 
                                        hidden 
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setEditForm(prev => ({ ...prev, photo: reader.result }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    {editForm.photo && (
                                        <button
                                            type="button"
                                            onClick={() => setEditForm(prev => ({ ...prev, photo: '' }))}
                                            style={{ position: 'absolute', bottom: '0', right: '0', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)' }}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
                                <div className="sm-input-group">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>First Name</label>
                                    <input type="text" name="firstName" value={editForm.firstName} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 700, fontSize: '0.9rem' }} />
                                </div>
                                <div className="sm-input-group">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Last Name</label>
                                    <input type="text" name="lastName" value={editForm.lastName} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 700, fontSize: '0.9rem' }} />
                                </div>
                                <div className="sm-input-group">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Phone Number</label>
                                    <input type="text" name="phone" value={editForm.phone} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 700, fontSize: '0.9rem' }} />
                                </div>
                                <div className="sm-input-group">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Assigned Branches</label>
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '1fr 1fr', 
                                        gap: '8px',
                                        background: '#f8fafc',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        maxHeight: '150px',
                                        overflowY: 'auto'
                                    }} className="custom-scrollbar">
                                        {branches.map(branch => {
                                            const isSelected = editForm.branchIds?.includes(branch._id);
                                            return (
                                                <div 
                                                    key={branch._id}
                                                    onClick={() => {
                                                        const newIds = isSelected 
                                                            ? editForm.branchIds.filter(id => id !== branch._id)
                                                            : [...(editForm.branchIds || []), branch._id];
                                                        setEditForm(prev => ({ ...prev, branchIds: newIds }));
                                                    }}
                                                    style={{
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        background: isSelected ? 'rgba(239, 68, 68, 0.05)' : '#fff',
                                                        border: isSelected ? '1.5px solid #EF4444' : '1px solid #e2e8f0',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        color: isSelected ? '#EF4444' : '#475569',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSelected ? '#EF4444' : '#cbd5e1' }} />
                                                    {branch.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '14px' }}>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '2px solid #e2e8f0', background: 'transparent', color: '#64748b', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                >
                                    <RotateCcw size={18} /> Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1.5px solid #FEE2E2', background: '#FEF2F2', color: '#EF4444', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)' }}
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffViewModal;
