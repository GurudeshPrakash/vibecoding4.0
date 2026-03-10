import React from 'react';
import { Eye, QrCode, Wrench, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

const InventoryCard = ({
    item,
    statusConfig,
    onView,
    onQr,
    onUpdate,
    onRemove
}) => {
    const cfg = statusConfig[item.status] || { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };

    // Determine icon based on status
    const getStatusIcon = (status) => {
        if (status === 'Maintenance') return <Wrench size={12} />;
        if (status === 'Damaged') return <AlertTriangle size={12} />;
        return <CheckCircle2 size={12} />;
    };

    return (
        <div className="sa-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            <div style={{ height: '130px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={item.photo}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }}
                />
                <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '4px 10px', borderRadius: '20px',
                    background: cfg.bg, color: cfg.color,
                    fontSize: '0.58rem', fontWeight: '700',
                    backdropFilter: 'blur(4px)',
                    zIndex: 2
                }}>
                    {getStatusIcon(item.status)} {item.status}
                </div>
            </div>

            <div style={{ padding: '16px' }}>
                <div style={{ marginBottom: '4px', fontSize: '0.58rem', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.category} • {item.area || 'Main Area'}
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: '700', color: '#1E293B' }}>{item.name}</h4>
                <div style={{ fontSize: '0.65rem', color: '#64748B', marginBottom: '12px' }}>
                    ID: <strong>{item.id}</strong> &nbsp;|&nbsp; Brand: <strong>{item.brand}</strong>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.62rem', marginBottom: '16px' }}>
                    <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#94A3B8', marginBottom: '2px' }}>Last Service</div>
                        <div style={{ fontWeight: '600', color: '#334155' }}>{item.lastMaintenance || '—'}</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#94A3B8', marginBottom: '2px' }}>Next Service</div>
                        <div style={{ fontWeight: '600', color: '#334155' }}>{item.nextMaintenance || '—'}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => onView(item)}
                        style={{ flex: 1, padding: '8px', background: '#F1F5F9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                        <Eye size={12} /> View
                    </button>
                    <button
                        onClick={() => onQr(item)}
                        style={{ flex: 1, padding: '8px', background: 'rgba(59, 130, 246, 0.08)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '600', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                        <QrCode size={12} /> QR
                    </button>
                    <button
                        onClick={() => onUpdate(item)}
                        style={{ flex: 1, padding: '8px', background: 'rgba(16, 185, 129, 0.08)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '600', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryCard;
