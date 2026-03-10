import React from 'react';
import { X, AlertTriangle, CheckCircle2, Wrench, Edit2 } from 'lucide-react';

const EquipmentDetailModal = ({
    item,
    onClose,
    onReportIssue,
    statusConfig
}) => {
    if (!item) return null;

    const cfg = statusConfig[item.status] || { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };

    // Determine icon based on status
    const getStatusIcon = (status) => {
        if (status === 'Maintenance') return <Wrench size={12} />;
        if (status === 'Damaged') return <AlertTriangle size={12} />;
        return <CheckCircle2 size={12} />;
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
                    <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                    <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={16} />
                    </button>
                </div>
                <div style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '4px', fontSize: '0.6rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '600' }}>{item.category} • {item.area}</div>
                    <h2 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: '800', color: '#1E293B' }}>{item.name}</h2>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '20px', fontSize: '0.62rem', fontWeight: '700', background: cfg.bg, color: cfg.color, marginBottom: '20px' }}>
                        {getStatusIcon(item.status)} {item.status}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {[
                            ['Equipment ID', item.id],
                            ['Serial Number', item.serial || '—'],
                            ['Brand', item.brand || '—'],
                            ['Model', item.model || '—'],
                            ['Location', item.area || '—'],
                            ['Category', item.category || '—'],
                            ['Last Maintenance', item.lastMaintenance || '—'],
                            ['Next Maintenance', item.nextMaintenance || '—'],
                        ].map(([label, val]) => (
                            <div key={label} style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.58rem', color: '#94A3B8', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>{label}</div>
                                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1E293B' }}>{val}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#F1F5F9', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#64748B', fontSize: '0.72rem' }}>Close</button>
                        <button onClick={() => { onReportIssue(item); onClose(); }} style={{ flex: 1, padding: '12px', background: 'rgba(59, 130, 246, 0.08)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.72rem' }}>
                            <Edit2 size={16} /> Edit Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetailModal;
