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
                branchId: staff.branchId
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
                        background: 'var(--color-red)',
                        padding: '8px 20px 8px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        flexShrink: 0,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    <button className="sm-modal-close" onClick={onClose} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <X size={12} />
                    </button>

                    <div className="sm-view-avatar" style={{
                        width: '55px',
                        height: '55px',
                        borderRadius: '50%',
                        border: '2.5px solid #fff',
                        boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {staff.photo ? (
                            <img src={staff.photo} alt={staff.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ color: 'var(--color-red)', fontSize: '1.4rem', fontWeight: 900 }}>
                                {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                            </div>
                        )}
                    </div>
                    
                    {!isEditing && (
                        <h2 className="sm-view-name" style={{ margin: '0', fontSize: '1.1rem', color: '#fff', fontWeight: 900 }}>{staff.firstName} {staff.lastName}</h2>
                    )}
                    
                    {isEditing && (
                        <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem', margin: '10px 0 0' }}>Edit Staff Profile</h2>
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
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                    <div style={{ width: '4px', height: '20px', background: 'var(--color-red)', borderRadius: '10px' }}></div>
                                    <h3 className="sm-view-section-title" style={{ 
                                        color: '#1e293b', 
                                        fontWeight: 900, 
                                        fontSize: '0.85rem', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.05em',
                                        margin: 0
                                    }}>Staff Details</h3>
                                </div>
                                
                                <div className="sm-view-fields" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <FieldRow label="Staff ID" value={staff.staffId} icon={<Shield size={14} color="var(--color-red)" />} />
                                    <FieldRow label="Full Name" value={`${staff.firstName} ${staff.lastName}`} icon={<Users size={14} color="var(--color-red)" />} />
                                    <FieldRow label="Branch" value={branchName} icon={<MapPin size={14} color="var(--color-red)" />} />
                                    <FieldRow label="Login Status" value="Offline" icon={<Clock size={14} color="var(--color-red)" />} />
                                    <FieldRow label="Phone Number" value={staff.phone} icon={<Phone size={14} color="var(--color-red)" />} />
                                    <FieldRow label="NIC Number" value={staff.nic} icon={<Shield size={14} color="var(--color-red)" />} />
                                    <FieldRow label="Join Date" value={formatDate(staff.joinDate)} icon={<Calendar size={14} color="var(--color-red)" />} />
                                </div>
                            </div>

                            <div style={{ marginTop: '30px' }}>
                                <button
                                    className="sm-btn-primary"
                                    style={{ 
                                        width: '100%', 
                                        padding: '16px', 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        background: 'var(--color-red)', 
                                        color: 'white', 
                                        fontWeight: 800, 
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '10px', 
                                        boxShadow: '0 6px 20px rgba(239, 68, 68, 0.25)',
                                        fontSize: '0.95rem'
                                    }}
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit2 size={18} /> Edit Profile
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="sm-edit-view">
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
                                    style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: 'var(--color-red)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(239, 68, 68, 0.25)' }}
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
