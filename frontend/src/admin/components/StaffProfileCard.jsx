import React from 'react';
import { MapPin, Phone, Shield, Mail, Clock, Calendar, Building2, Briefcase, ChevronRight, Edit2, Trash2, Eye } from 'lucide-react';

const StaffProfileCard = ({
    member,
    branchName,
    avatarColor,
    onView,
    onDelete
}) => {
    const isOnline = member.status === 'Active';
    const branchCount = member.branchIds?.length || (member.branchId ? 1 : 0);
    const role = member.designation || 'Staff';
    const shift = member.shiftStartTime && member.shiftEndTime 
        ? `${member.shiftStartTime} - ${member.shiftEndTime}`
        : '08:00 AM - 05:00 PM';
    const workingDays = member.workingDays && member.workingDays.length > 0
        ? member.workingDays.map(d => d.substring(0, 3)).join(', ')
        : 'Mon, Tue, Wed, Thu, Fri';
    const experience = member.experience || '3 Years Experience';
    const lastLogin = member.lastLogin || 'Today 08:15 AM';

    return (
        <div className="sm-profile-card">
            <div className="sm-profile-card-inner">
                <div className="sm-profile-photo-wrap" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onView(member)}>
                    <img
                        src={member.photo || `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=${avatarColor.replace('#', '')}&color=fff&size=150&rounded=true`}
                        alt={member.firstName}
                        className="sm-profile-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        width: '14px',
                        height: '14px',
                        backgroundColor: isOnline ? '#10B981' : '#cbd5e1',
                        border: '2.5px solid #fff',
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }} />
                </div>
                <div className="sm-profile-details">
                    <div className="sm-profile-top">
                        <span className="sm-profile-id">{member.staffId}</span>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            background: isOnline ? 'rgba(16, 185, 129, 0.1)' : '#f1f5f9', 
                            padding: '3px 10px', 
                            borderRadius: '100px' 
                        }}>
                            <div style={{ 
                                width: '6px', 
                                height: '6px', 
                                borderRadius: '50%', 
                                background: isOnline ? '#10B981' : '#64748b' 
                            }} />
                            <span style={{ 
                                fontSize: '0.62rem', 
                                fontWeight: 800, 
                                color: isOnline ? '#10B981' : '#64748b', 
                                textTransform: 'uppercase',
                                letterSpacing: '0.02em'
                            }}>
                                {isOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>

                    <h3 className="sm-profile-name" style={{ marginBottom: '2px', cursor: 'pointer' }} onClick={() => onView(member)}>{member.firstName} {member.lastName}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{role}</span>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>{member.gender || '—'}</span>
                    </div>

                    <div className="sm-profile-info-list" style={{ marginTop: '10px' }}>
                        <div className="sm-profile-info-item">
                            <MapPin size={12} color="var(--color-red)" />
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{branchName}</span>
                            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#94a3b8', background: '#f8fafc', padding: '1px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                {branchCount} BRANCH{branchCount !== 1 ? 'ES' : ''}
                            </span>
                        </div>
                        <div className="sm-profile-info-item">
                            <Phone size={12} color="var(--color-red)" />
                            <span>{member.phone || '—'}</span>
                        </div>
                        <div className="sm-profile-info-item">
                            <Mail size={12} color="var(--color-red)" />
                            <span style={{ fontSize: '0.75rem' }}>{member.email || '—'}</span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                            <div className="sm-profile-info-item" style={{ background: '#f8fafc', padding: '6px 10px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                <Clock size={12} color="var(--color-red)" />
                                <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>{shift}</span>
                            </div>
                            <div className="sm-profile-info-item" style={{ background: '#f8fafc', padding: '6px 10px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                <Briefcase size={12} color="var(--color-red)" />
                                <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>{experience}</span>
                            </div>
                        </div>

                        <div className="sm-profile-info-item" style={{ marginTop: '8px' }}>
                            <Calendar size={12} color="var(--color-red)" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>{workingDays}</span>
                        </div>

                        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div onClick={() => onView(member)} style={{ cursor: 'pointer' }}>
                                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Last Login</div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569' }}>{member.lastLogin ? member.lastLogin : (member.status === 'Active' ? lastLogin : 'Never Logged In')}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                    onClick={() => onView(member)}
                                    title="View Staff Details"
                                    style={{
                                        padding: '8px',
                                        background: 'var(--color-red)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Eye size={16} />
                                </button>
                                <button 
                                    onClick={() => onDelete(member._id)}
                                    title="Delete Staff"
                                    style={{
                                        padding: '8px',
                                        background: '#FEE2E2',
                                        color: '#EF4444',
                                        border: 'none',
                                        borderRadius: '100px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffProfileCard;
