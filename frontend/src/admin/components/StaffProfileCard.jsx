import React from 'react';
import { MapPin, Phone, Shield } from 'lucide-react';

const StaffProfileCard = ({
    member,
    branchName,
    avatarColor,
    onView
}) => {
    return (
        <div className="sm-profile-card">
            <div className="sm-profile-card-inner">
                <div className="sm-profile-photo-wrap">
                    <img
                        src={member.photo || `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=${avatarColor.replace('#', '')}&color=fff&size=150&rounded=true`}
                        alt={member.firstName}
                        className="sm-profile-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                </div>
                <div className="sm-profile-details">
                    <div className="sm-profile-top" style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                        <span className="sm-profile-id">{member.staffId}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '100px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1' }}></div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Offline</span>
                        </div>
                    </div>
                    <h3 className="sm-profile-name">{member.firstName} {member.lastName}</h3>

                    <div className="sm-profile-info-list" style={{ marginTop: '10px' }}>
                        <div className="sm-profile-info-item">
                            <MapPin size={14} color="var(--color-red)" />
                            <span>{branchName}</span>
                        </div>
                        <div className="sm-profile-info-item">
                            <Phone size={14} color="var(--color-red)" />
                            <span>{member.phone || '—'}</span>
                        </div>
                        <div className="sm-profile-info-item">
                            <Shield size={14} color="var(--color-red)" />
                            <span>{member.nic || '—'}</span>
                        </div>
                        <div className="sm-profile-info-item" style={{ marginTop: '8px', opacity: 0.8, fontSize: '0.75rem', borderTop: '1px dashed #e2e8f0', paddingTop: '8px' }}>
                            <span style={{ fontWeight: 700 }}>Join Date:</span>
                            <span style={{ marginLeft: '4px' }}>{member.joinDate || '—'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffProfileCard;
