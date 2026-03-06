import React from 'react';
import { MapPin, Clock, Eye, Users, Shield, Package, DollarSign } from 'lucide-react';

const BranchCard = ({
    gym,
    status,
    onViewDetails,
    onAction
}) => {
    return (
        <div className="branch-premium-card">
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
                    <button className="branch-action-pill btn-details" onClick={() => onViewDetails(gym)}>
                        <Eye size={16} /> View Details
                    </button>
                    <button className="branch-action-pill btn-members" onClick={() => onAction(gym, 'members')}>
                        <Users size={16} /> Members
                    </button>
                    <button className="branch-action-pill btn-staff" onClick={() => onAction(gym, 'staff')}>
                        <Shield size={16} /> Staff Info
                    </button>
                    <button className="branch-action-pill btn-equipment" onClick={() => onAction(gym, 'inventory')}>
                        <Package size={16} /> Equipment
                    </button>
                    <button className="branch-action-pill btn-payments-wide" onClick={() => onAction(gym, 'payments')}>
                        <DollarSign size={16} /> Branch Payment Records
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BranchCard;
