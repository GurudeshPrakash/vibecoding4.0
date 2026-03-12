import React from 'react';
import { X, AlertTriangle, CheckCircle2, Wrench, Edit2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const EquipmentDetailModal = ({
    item,
    onClose,
    onUpdate,
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
            <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', position: 'relative' }}>
                
                {/* Image Section */}
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                    <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                    <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10 }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '32px' }}>
                    {/* Header with QR Code */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: '6px', fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>{item.category} • {item.area}</div>
                            <h2 style={{ margin: '0 0 12px', fontSize: '1.25rem', fontWeight: '900', color: '#1E293B', lineHeight: '1.2' }}>{item.name}</h2>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800', background: cfg.bg, color: cfg.color }}>
                                {getStatusIcon(item.status)} {item.status.toUpperCase()}
                            </div>
                        </div>
                        <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <QRCodeCanvas
                                value={item.id}
                                size={80}
                                level={"H"}
                                bgColor={"#F8FAFC"}
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                            <div key={label} style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid transparent', transition: 'all 0.2s' }}>
                                <div style={{ fontSize: '0.6rem', color: '#94A3B8', marginBottom: '6px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</div>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1E293B' }}>{val}</div>
                            </div>
                        ))}
                    </div>

                    {/* Footer - Update Button only */}
                    <div style={{ marginTop: '32px' }}>
                        <button 
                            onClick={() => { onUpdate(item); onClose(); }} 
                            style={{ 
                                width: '100%',
                                padding: '16px', 
                                background: '#1E3A5F', 
                                border: 'none', 
                                borderRadius: '14px', 
                                cursor: 'pointer', 
                                fontWeight: '800', 
                                color: '#fff', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '12px', 
                                fontSize: '0.9rem', 
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(30, 58, 95, 0.2)'
                            }}
                        >
                            <Wrench size={20} /> Update Equipment Status
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetailModal;
