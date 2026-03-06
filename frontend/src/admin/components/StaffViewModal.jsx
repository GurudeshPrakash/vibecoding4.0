import React from 'react';
import { X, Edit2, Shield, Users, MapPin, Phone, Calendar } from 'lucide-react';
import StatusBadge from '../../../shared/components/ui/StatusBadge';
import FieldRow from '../../../shared/components/ui/FieldRow';

const StaffViewModal = ({
    show,
    onClose,
    staff,
    branchName,
    avatarColor,
    onEdit,
    formatDate
}) => {
    if (!show || !staff) return null;

    return (
        <div className="sm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="sm-modal sm-modal-view" style={{ borderRadius: '32px' }}>
                <div
                    className="sm-view-banner"
                    style={{
                        background: `linear-gradient(180deg, ${avatarColor}dd, ${avatarColor}aa)`,
                        height: '240px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 20px',
                        textAlign: 'center'
                    }}
                >
                    <div className="sm-view-avatar" style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        border: '6px solid #fff',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        marginBottom: '16px',
                        overflow: 'hidden',
                        background: '#fff'
                    }}>
                        {staff.photo ? (
                            <img src={staff.photo} alt={staff.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ color: avatarColor, fontSize: '2.5rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                                {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <h2 className="sm-view-name" style={{ margin: '0', fontSize: '1.6rem', color: '#fff', fontWeight: 900 }}>{staff.firstName} {staff.lastName}</h2>
                    <span className="sm-view-id" style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, marginTop: '8px' }}>{staff.staffId}</span>

                    <button className="sm-modal-close" onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(0,0,0,0.1)', border: 'none', color: '#fff' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="sm-view-body" style={{ padding: '24px 32px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <StatusBadge status={staff.status} />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <h3 className="sm-view-section-title">Staff Details</h3>
                        <div className="sm-view-fields">
                            <FieldRow label="Staff ID" value={staff.staffId} icon={<Shield size={13} />} />
                            <FieldRow label="Full Name" value={`${staff.firstName} ${staff.lastName}`} icon={<Users size={13} />} />
                            <FieldRow label="Branch" value={branchName} icon={<MapPin size={13} />} />
                            <FieldRow label="Phone Number" value={staff.phone} icon={<Phone size={13} />} />
                            <FieldRow label="NIC Number" value={staff.nic} icon={<Shield size={13} />} />
                            <FieldRow label="Join Date" value={formatDate(staff.joinDate)} icon={<Calendar size={13} />} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            className="sm-btn-primary"
                            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'var(--color-red)', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            onClick={() => { onClose(); onEdit(staff); }}
                        >
                            <Edit2 size={16} /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffViewModal;
