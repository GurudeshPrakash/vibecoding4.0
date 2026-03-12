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
                branchId: staff.branchId,
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
                <div
                    className="sm-view-banner"
                    style={{
                        background: 'linear-gradient(180deg, #FEF2F2 0%, #FFFFFF 100%)',
                        padding: '36px 20px 24px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        flexShrink: 0,
                    }}
                >
                    <button className="sm-modal-close" onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: '#fff', border: '1px solid #F1F5F9', color: '#64748B', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
                        <X size={16} />
                    </button>

                    <div className="sm-view-avatar" style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        border: '4px solid #fff',
                        boxShadow: '0 12px 24px rgba(239, 68, 68, 0.15)',
                        marginBottom: '16px',
                        overflow: 'hidden',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        {staff.photo ? (
                            <img src={staff.photo} alt={staff.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ color: '#EF4444', fontSize: '2rem', fontWeight: 900 }}>
                                {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                            </div>
                        )}
                    </div>
                    
                    {!isEditing && (
                        <>
                            <h2 className="sm-view-name" style={{ margin: '0', fontSize: '1.5rem', color: '#1E293B', fontWeight: 900, letterSpacing: '-0.02em' }}>{staff.firstName} {staff.lastName}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{branchName}</span>
                            </div>
                        </>
                    )}
                    
                    {isEditing && (
                        <h2 style={{ color: '#1E293B', fontWeight: 900, fontSize: '1.5rem', margin: '0' }}>Edit Profile</h2>
                    )}
                </div>

                {/* Scrollable Content Section */}
                <div className="sm-view-scroll-content" style={{ 
                    flex: 1, 
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    padding: '24px 32px 32px'
                }}>
                    {!isEditing ? (
                        <>
                            <div style={{ 
                                background: '#fff', 
                                border: '1px solid #F1F5F9', 
                                borderRadius: '24px', 
                                padding: '12px 24px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                            }}>
                                <div className="sm-view-fields" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <FieldRow label="Staff ID" value={staff.staffId} icon={<Shield size={16} />} />
                                    <FieldRow label="Legal NIC" value={staff.nic} icon={<Shield size={16} />} />
                                    <FieldRow label="Phone" value={staff.phone} icon={<Phone size={16} />} />
                                    <FieldRow label="Login Status" value="Inactive" icon={<Clock size={16} />} />
                                    <FieldRow label="Joined On" value={formatDate(staff.joinDate)} icon={<Calendar size={16} />} />
                                </div>
                            </div>

                            <div style={{ marginTop: '24px' }}>
                                <button
                                    className="sm-btn-primary"
                                    style={{ 
                                        width: '100%', 
                                        padding: '16px', 
                                        borderRadius: '16px', 
                                        border: '1px solid #FEE2E2', 
                                        background: '#FEF2F2', 
                                        color: '#EF4444', 
                                        fontWeight: 800, 
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '10px', 
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit2 size={18} /> Modify Staff Access
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
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Assigned Branch</label>
                                    <select name="branchId" value={editForm.branchId} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 700, background: '#fff', fontSize: '0.9rem' }}>
                                        {branches.map(b => (
                                            <option key={b._id} value={b._id}>{b.name}</option>
                                        ))}
                                    </select>
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
