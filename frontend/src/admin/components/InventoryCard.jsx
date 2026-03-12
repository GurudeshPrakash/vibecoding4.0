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
        <div className="equipment-card-premium">
            <div className="card-image-container">
                <img
                    src={item.photo || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800'}
                    alt={item.name}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800'; }}
                />
                <div
                    className="status-badge-overlay"
                    style={{ background: statusCfg.bg, color: statusCfg.color, borderColor: statusCfg.color }}
                >
                    {statusCfg.icon}
                    <span>{item.status}</span>
                </div>
            </div>

            <div className="card-body-premium">
                <div className="meta-info-caps">
                    {item.category?.toUpperCase()} • {item.area?.toUpperCase() || 'MAIN ZONE'}
                </div>
                <h3 className="equipment-title-large">{item.name}</h3>
                <div className="sub-meta-line">
                    ID: <strong>{item.id}</strong> | Brand: <strong>{item.brand || 'Hammer Strength'}</strong>
                </div>

                <div className="service-info-grid">
                    <div className="service-box">
                        <span className="service-label">Last Service</span>
                        <div className="service-date">{item.lastMaintenance || '—'}</div>
                    </div>
                    <div className="service-box">
                        <span className="service-label">Next Service</span>
                        <div className="service-date">{item.nextMaintenance || '—'}</div>
                    </div>
                </div>
            </div>

            <div className="card-actions-row">
                <button onClick={() => onView(item)} className="action-btn-premium btn-view">
                    <Eye size={16} />
                    <span>View</span>
                </button>
                <button onClick={() => onUpdate(item)} className="action-btn-premium btn-update">
                    <Wrench size={16} />
                    <span>Update</span>
                </button>
                <button onClick={() => onRemove(item.id)} className="action-btn-premium btn-remove-p" title="Delete Equipment">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default InventoryCard;
