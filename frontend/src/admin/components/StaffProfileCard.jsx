import React from 'react';
import { MapPin, Phone, Shield } from 'lucide-react';
import StatusBadge from '../../../shared/components/ui/StatusBadge';

const StaffProfileCard = ({
    member,
    branchName,
    avatarColor
}) => {
    return (
        <div className="sm-profile-card">
            <div className="sm-profile-card-inner">
                <div className="sm-profile-photo-wrap">
                    <img
                        src={member.photo || `https://i.pravatar.cc/150?u=${member.staffId}`}
                        alt={member.firstName}
                        className="sm-profile-img"
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=${avatarColor.replace('#', '')}&color=fff`;
                        }}
                    />
                </div>
                <div className="sm-profile-details">
                    <div className="sm-profile-top">
                        <span className="sm-profile-id">{member.staffId}</span>
                        <StatusBadge status={member.status} />
                    </div>
                    <h3 className="sm-profile-name">{member.firstName} {member.lastName}</h3>

                    <div className="sm-profile-info-list">
                        <div className="sm-profile-info-item">
                            <MapPin size={14} />
                            <span>{branchName}</span>
                        </div>
                        <div className="sm-profile-info-item">
                            <Phone size={14} />
                            <span>{member.phone || '—'}</span>
                        </div>
                        <div className="sm-profile-info-item">
                            <Shield size={14} />
                            <span>{member.nic || '—'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffProfileCard;
