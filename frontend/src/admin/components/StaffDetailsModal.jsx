import React from 'react';
import { X, Shield, Users, MapPin, Phone, Calendar, Clock, Mail, Home, User as UserIcon } from 'lucide-react';
import { AVATAR_COLORS } from '../constants/mockData';

const StaffDetailsModal = ({
    show,
    onClose,
    staff,
    branches = []
}) => {
    if (!show || !staff) return null;

    const getAvatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
    const avatarColor = getAvatarColor(staff.firstName);
    
    const getBranchNames = () => {
        if (staff.branchIds && staff.branchIds.length > 0) {
            return staff.branchIds
                .map(id => branches.find(b => b._id === id)?.name)
                .filter(Boolean)
                .join(', ');
        }
        return branches.find(b => b._id === staff.branchId)?.name || 'Unassigned';
    };
    const branchName = getBranchNames();

    const role = staff.role || 'Staff';
    const email = staff.email || `${staff.firstName.toLowerCase()}.${staff.lastName.toLowerCase()}@powerworld.com`;
    const address = staff.address || 'Colombo, Sri Lanka';
    const gender = staff.gender || 'Male';

    const DetailItem = ({ icon, label, value }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ color: 'var(--color-red)', background: 'rgba(239, 68, 68, 0.08)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div>
                <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{value}</span>
            </div>
        </div>
    );

    const GridCell = ({ label, value }) => (
        <div style={{ marginBottom: '16px' }}>
            <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{value}</span>
        </div>
    );

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
            zIndex: 10000, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '24px'
        }}>
            <div className="sa-card custom-scrollbar" style={{
                maxWidth: '960px', width: '100%', padding: 0,
                background: '#f8fafc',
                borderRadius: '32px', border: 'none',
                height: 'auto', maxHeight: '90vh',
                display: 'flex', flexDirection: 'row',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflowY: 'auto'
            }}>
                {/* Left Section: Profile Summary */}
                <div style={{
                    width: '320px',
                    background: 'white',
                    padding: '40px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRight: '1px solid #e2e8f0'
                }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            padding: '4px',
                            background: 'white',
                            border: '4px solid rgba(239, 68, 68, 0.1)',
                            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.12)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '24px'
                        }}>
                            {staff.photo ? (
                                <img src={staff.photo} alt={staff.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            ) : (
                                <div style={{ 
                                    width: '100%', height: '100%', borderRadius: '50%',
                                    background: avatarColor, color: 'white', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2.5rem', fontWeight: 900 
                                }}>
                                    {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div style={{
                            position: 'absolute', 
                            bottom: '34px', 
                            right: '12px',
                            width: '18px', 
                            height: '18px', 
                            borderRadius: '50%',
                            background: '#10B981', 
                            border: '3px solid white',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            zIndex: 2
                        }} />
                    </div>

                    <h2 style={{ margin: '0', fontSize: '1.4rem', color: '#1e293b', fontWeight: 900, textAlign: 'center' }}>
                        {staff.firstName} {staff.lastName}
                    </h2>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
                        {role}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, marginTop: '8px' }}>
                        <MapPin size={12} />
                        <span>{branchName}</span>
                    </div>
                    <div style={{ 
                        marginTop: '12px',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        color: staff.status === 'Active' ? '#10B981' : '#64748b', 
                        fontWeight: 800, 
                        fontSize: '0.7rem', 
                        textTransform: 'uppercase',
                        background: staff.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                        padding: '4px 12px',
                        borderRadius: '50px'
                    }}>
                        <div style={{ 
                            width: '6px', 
                            height: '6px', 
                            borderRadius: '50%', 
                            background: staff.status === 'Active' ? '#10B981' : '#64748b' 
                        }} />
                        <span>{staff.status === 'Active' ? 'Online' : 'Offline'}</span>
                    </div>

                    <div style={{ marginTop: '32px', width: '100%' }}>
                        <DetailItem icon={<Phone size={14} />} label="Phone Number" value={staff.phone} />
                        <DetailItem icon={<Mail size={14} />} label="Email Address" value={email} />
                        <DetailItem icon={<Shield size={14} />} label="NIC Number" value={staff.nic} />
                        <DetailItem icon={<Home size={14} />} label="Address" value={address} />
                        <DetailItem icon={<Calendar size={14} />} label="Join Date" value={staff.joinDate} />
                    </div>
                </div>

                {/* Right Section: Detailed Card */}
                <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: '#f1f5f9', border: 'none', color: '#64748b', padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={18} />
                    </button>

                    <div style={{ 
                        background: 'white', 
                        borderRadius: '24px', 
                        padding: '32px 32px 64px', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
                        width: '100%',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#1e293b' }}>{staff.firstName} {staff.lastName}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>{role}</span>
                                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '6px', 
                                        color: staff.status === 'Active' ? '#10B981' : '#EF4444', 
                                        fontWeight: 800, 
                                        fontSize: '0.75rem', 
                                        textTransform: 'uppercase' 
                                    }}>
                                        <div style={{ 
                                            width: '8px', 
                                            height: '8px', 
                                            borderRadius: '50%', 
                                            background: staff.status === 'Active' ? '#10B981' : '#EF4444' 
                                        }} />
                                        <span>{staff.status === 'Active' ? 'Online' : 'Offline'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <GridCell label="Staff ID" value={staff.staffId} />
                            <GridCell label="Assigned Branch" value={branchName} />
                            <GridCell label="Gender" value={gender} />
                            <GridCell label="Phone Number" value={staff.phone} />
                            <GridCell label="Email Address" value={email} />
                            <GridCell label="NIC Number" value={staff.nic} />
                            <GridCell label="Login Time" value={staff.loginTime || '08:15 AM'} />
                            <GridCell 
                                label="Logout Time" 
                                value={staff.status === 'Active' 
                                    ? '-' 
                                    : (staff.logoutTime || '05:30 PM')
                                } 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDetailsModal;
