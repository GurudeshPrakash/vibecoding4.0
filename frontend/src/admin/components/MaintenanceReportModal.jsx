import React from 'react';
import { X, CheckCircle2, Send, Plus } from 'lucide-react';

const MaintenanceReportModal = ({
    show,
    onClose,
    item,
    statusConfig,
    newStatus,
    setNewStatus,
    reportReason,
    setReportReason,
    reportSubmitted,
    onSubmit,
    reportImages,
    onImageUpload,
    onRemoveImage
}) => {
    if (!show) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0, color: '#1E293B', fontSize: '0.85rem' }}>Update Equipment Status</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.68rem', color: '#64748B' }}>{item?.name} ({item?.id})</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '24px' }}>
                    {reportSubmitted ? (
                        <div style={{ textAlign: 'center', padding: '32px 0' }}>
                            <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: '12px' }} />
                            <h4 style={{ color: '#1E293B', marginBottom: '8px' }}>Status Updated!</h4>
                            <p style={{ color: '#64748B', fontSize: '0.7rem' }}>The equipment status has been updated and a log entry has been created.</p>
                            <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 24px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Done</button>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Set Status</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                    {['Good', 'Maintenance', 'Damaged'].map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setNewStatus(status)}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '0.65rem',
                                                fontWeight: '600',
                                                color: newStatus === status ? (statusConfig[status]?.color || '#475569') : '#475569',
                                                background: newStatus === status ? (statusConfig[status]?.bg || '#F8FAFC') : '#F8FAFC',
                                                border: newStatus === status ? `1px solid ${statusConfig[status]?.color || '#E2E8F0'}` : '1px solid #E2E8F0',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                                <textarea
                                    value={reportReason}
                                    onChange={e => setReportReason(e.target.value)}
                                    placeholder="Describe the issue in detail..."
                                    rows={4}
                                    required
                                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.7rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                />
                            </div>

                            {(newStatus === 'Maintenance' || newStatus === 'Damaged') && (
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Equipment Photos (Up to 20)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
                                        {reportImages.map((img, idx) => (
                                            <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                                                <img src={img.preview} alt={`upload-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveImage(idx)}
                                                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        {reportImages.length < 20 && (
                                            <label style={{
                                                aspectRatio: '1/1', border: '2px dashed #E2E8F0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94A3B8', transition: 'all 0.2s', background: '#F8FAFC'
                                            }}>
                                                <Plus size={20} />
                                                <span style={{ fontSize: '0.55rem', marginTop: '4px', fontWeight: '600' }}>Add Photo</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={onImageUpload}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: '#F1F5F9', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#64748B', fontSize: '0.72rem' }}>Cancel</button>
                                <button type="submit" style={{ flex: 2, padding: '12px', background: '#1E3A5F', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.72rem' }}>
                                    <Send size={16} /> Save Changes
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MaintenanceReportModal;
