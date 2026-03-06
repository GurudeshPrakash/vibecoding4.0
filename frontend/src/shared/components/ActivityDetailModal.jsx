import React from 'react';
import { X, User, Mail, MapPin, Clock, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import '../styles/LogoutModal.css'; // Reuse existing modal styles

const ActivityDetailModal = ({ isOpen, onClose, log }) => {
    if (!isOpen || !log) return null;

    return (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '500px',
                padding: '0',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)'
            }}>
                <div style={{
                    padding: '20px',
                    background: 'var(--color-surface)',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Session <span className="highlight-red">Details</span></h2>
                    <button onClick={onClose} style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-dim)',
                        cursor: 'pointer'
                    }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(255,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <User size={24} color="var(--color-red)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{log.staffName}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
                                <Mail size={14} />
                                {log.staffEmail}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div className="info-item">
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '4px', textTransform: 'uppercase' }}>Branch</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={16} color="var(--color-red)" />
                                <span>{log.branch}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-dim)', marginBottom: '4px', textTransform: 'uppercase' }}>Status</label>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background: log.status === 'Active' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                                color: log.status === 'Active' ? '#4caf50' : '#ff4444',
                                fontSize: '0.85rem'
                            }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                                {log.status === 'Active' ? 'Active (Logged In)' : 'Ended (Logged Out)'}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                            <div className="timeline-icon" style={{ marginTop: '4px' }}>
                                <Clock size={16} color="#4caf50" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Login Time</label>
                                <span style={{ fontWeight: '500' }}>{new Date(log.loginTimestamp).toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div className="timeline-icon" style={{ marginTop: '4px' }}>
                                <Activity size={16} color={log.logoutTimestamp ? "#ff4444" : "var(--color-text-dim)"} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Logout Time</label>
                                <span style={{ fontWeight: '500' }}>
                                    {log.logoutTimestamp ? new Date(log.logoutTimestamp).toLocaleString() : 'Session still active'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '20px',
                    background: 'rgba(255,255,255,0.02)',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={onClose}
                        className="confirm-btn"
                        style={{ padding: '8px 24px' }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetailModal;
