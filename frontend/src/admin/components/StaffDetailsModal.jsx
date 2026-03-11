import React from 'react';
import { X, Shield, Users, MapPin, Phone, Calendar, Clock } from 'lucide-react';
import FieldRow from '../../shared/components/ui/FieldRow';
import { AVATAR_COLORS } from '../constants/mockData';

const StaffDetailsModal = ({
    show,
    onClose,
    staff,
    branches = []
}) => {
    if (!show || !staff) return null;

    const getAvatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
    const avatarColor = getAvatarColor(staff.firstName);
    const branchName = branches.find(b => b._id === staff.branchId)?.name || 'Unassigned';

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)',
            zIndex: 10000, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '20px'
        }}>
            <div className="sa-card" style={{
                maxWidth: '420px', width: '100%', padding: 0,
                overflow: 'hidden', background: '#FFFFFF',
                borderRadius: '32px', border: 'none',
                height: 'auto', maxHeight: '90vh',
                display: 'flex', flexDirection: 'column'
            }}>
                {/* Compact Header */}
                <div style={{
                    background: 'var(--color-red)',
                    padding: '8px 20px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    flexShrink: 0
                }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={12} />
                    </button>

                    <div style={{
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
                    
                    <h2 style={{ margin: '0', fontSize: '1.1rem', color: '#fff', fontWeight: 900 }}>{staff.firstName} {staff.lastName}</h2>
                </div>

                {/* Scrollable Details */}
                <div style={{ padding: '24px 32px 32px', overflowY: 'auto', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ width: '4px', height: '18px', background: 'var(--color-red)', borderRadius: '10px' }}></div>
                        <h3 style={{ 
                            fontSize: '0.85rem', 
                            fontWeight: 900, 
                            color: '#1e293b', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.05em',
                            margin: 0
                        }}>Staff Information</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <FieldRow label="Staff ID" value={staff.staffId} icon={<Shield size={13} color="var(--color-red)" />} />
                        <FieldRow label="Full Name" value={`${staff.firstName} ${staff.lastName}`} icon={<Users size={13} color="var(--color-red)" />} />
                        <FieldRow label="Branch" value={branchName} icon={<MapPin size={13} color="var(--color-red)" />} />
                        <FieldRow label="Login Status" value="Offline" icon={<Clock size={13} color="var(--color-red)" />} />
                        <FieldRow label="Phone" value={staff.phone} icon={<Phone size={13} color="var(--color-red)" />} />
                        <FieldRow label="NIC Number" value={staff.nic} icon={<Shield size={13} color="var(--color-red)" />} />
                        <FieldRow label="Join Date" value={staff.joinDate} icon={<Calendar size={13} color="var(--color-red)" />} />
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '14px',
                            marginTop: '24px',
                            borderRadius: '14px',
                            border: 'none',
                            background: 'var(--color-red)',
                            color: 'white',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 6px 20px rgba(239, 68, 68, 0.25)',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem'
                        }}
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffDetailsModal;
