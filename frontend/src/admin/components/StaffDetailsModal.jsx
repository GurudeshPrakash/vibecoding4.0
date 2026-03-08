import React from 'react';
import { X, Shield, Users, MapPin, Phone, Calendar } from 'lucide-react';
import StatusBadge from '../../shared/components/ui/StatusBadge';
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
                maxWidth: '480px', width: '100%', padding: 0,
                overflow: 'hidden', background: '#FFFFFF',
                borderRadius: '32px', border: 'none'
            }}>
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
                        {staff.photo ? (
                            <img src={staff.photo} alt={staff.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ color: avatarColor, fontSize: '2.5rem', fontWeight: 900 }}>
                                {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <h2 style={{ margin: '0', fontSize: '1.5rem', color: '#fff', fontWeight: 900 }}>{staff.firstName} {staff.lastName}</h2>
                    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, marginTop: '8px', color: '#fff' }}>{staff.staffId}</span>

                    <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ padding: '24px 32px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <StatusBadge status={staff.status} />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px', borderBottom: '2px solid var(--color-red)', display: 'inline-block' }}>Staff Information</h3>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <FieldRow label="Staff ID" value={staff.staffId} icon={<Shield size={13} />} />
                            <FieldRow label="Full Name" value={`${staff.firstName} ${staff.lastName}`} icon={<Users size={13} />} />
                            <FieldRow label="Branch" value={branchName} icon={<MapPin size={13} />} />
                            <FieldRow label="Phone" value={staff.phone} icon={<Phone size={13} />} />
                            <FieldRow label="NIC Number" value={staff.nic} icon={<Shield size={13} />} />
                            <FieldRow label="Join Date" value={staff.joinDate} icon={<Calendar size={13} />} />
                        </div>
                    </div>

                    <button
                        onClick={onClose}
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

export default StaffDetailsModal;
