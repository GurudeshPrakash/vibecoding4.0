import React from 'react';
import { Eye, QrCode, Wrench, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

const InventoryCard = ({
    item,
    onView,
    onQr,
    onUpdate,
    onRemove
}) => {
    // Determine style based on status
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Maintenance':
                return { icon: <Wrench size={14} />, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
            case 'Damaged':
                return { icon: <AlertTriangle size={14} />, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' };
            case 'Good':
            case 'Available':
            default:
                return { icon: <CheckCircle2 size={14} />, color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
        }
    };

    const statusCfg = getStatusConfig(item.status);

    return (
        <div className="inventory-card-premium">
            {/* Header Image Section */}
            <div className="card-media-wrapper">
        <div className="sa-card sa-inventory-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            <div className="sa-card-img-wrapper" style={{ overflow: 'hidden', position: 'relative' }}>
                <img
                    src={item.photo || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'}
                    alt={item.name}
                    className="card-media-img"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'; }}
                    className="sa-card-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }}
                />
                <div 
                    className="floating-status-badge" 
                    style={{ background: statusCfg.bg, color: statusCfg.color, borderColor: statusCfg.color }}
                >
                    {statusCfg.icon}
                    <span>{item.status}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="card-content-premium">
                <div className="category-breadcrumbs">
                    {item.category?.toUpperCase()} • {item.area?.toUpperCase() || 'MAIN ZONE'}
                </div>
                <h3 className="equipment-name-title">{item.name}</h3>
                <div className="equipment-meta-line">
                    ID: <span className="meta-val">{item.id}</span> | Brand: <span className="meta-val">{item.brand}</span>
                </div>

                {/* Service Grid */}
                <div className="service-info-grid">
                    <div className="service-data-box">
                        <span className="service-label">Last Service</span>
                        <span className="service-value">{item.lastMaintenance || '—'}</span>
                    </div>
                    <div className="service-data-box">
                        <span className="service-label">Next Service</span>
                        <span className="service-value">{item.nextMaintenance || '—'}</span>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="card-actions-row">
                    <button onClick={() => onView(item)} className="btn-action-prem btn-view">
                        <Eye size={16} />
                        <span>View</span>
                    </button>
                    <button onClick={() => onQr(item)} className="btn-action-prem btn-qr">
                        <QrCode size={16} />
                        <span>QR</span>
                    </button>
                    <button onClick={() => onUpdate(item)} className="btn-action-prem btn-update">
                        <Wrench size={16} />
                        <span>Update</span>
                    </button>
                    <button onClick={() => onRemove(item.id)} className="btn-action-delete-hint" title="Delete Equipment">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryCard;
