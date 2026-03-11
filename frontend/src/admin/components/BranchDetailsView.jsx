import React, { useState, useEffect } from 'react';
import { 
    MapPin, Clock, Phone, Mail, Building2, Users, Package, 
    Shield, CheckCircle2, AlertCircle, TrendingUp, DollarSign,
    ArrowLeft, Edit2, Trash2, Mail as MailIcon, Plus, Eye,
    Calendar, UserPlus, CreditCard, Activity, Wrench
} from 'lucide-react';
import { checkStatus } from '../../shared/utils/timeUtils';
import InventoryCard from './InventoryCard';
import { MOCK_INVENTORY, STATUS_CONFIG, DEFAULT_STAFF } from '../constants/mockData';
import BranchUsageChart from './BranchUsageChart';
import FieldRow from '../../shared/components/ui/FieldRow';

const BranchDetailsView = ({ 
    branch, 
    onBack, 
    onEdit, 
    onDelete, 
    userRole,
    staffList = [],
    onViewStaff
}) => {
    const [currentTime] = useState(new Date());
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('admin_inventory_db');
        return saved ? JSON.parse(saved) : MOCK_INVENTORY;
    });

    const status = checkStatus(branch.openingHours, currentTime);
    
    // Filter branch-specific data
    const branchStaff = staffList.filter(s => s.branchId === branch._id);
    const branchEquipment = inventory.filter(i => i.branchId === branch._id);
    
    // Derived Stats
    const stats = {
        totalMembers: 450, // Mock
        activeMembers: 382, // Mock 
        todayCheckins: 124, // Mock
        totalStaff: branchStaff.length,
        totalEquipment: branchEquipment.length,
        maintenanceEquipment: branchEquipment.filter(i => i.status === 'Maintenance').length,
        damagedEquipment: branchEquipment.filter(i => i.status === 'Damaged').length,
    };

    // Tabs for navigation
    const [activeSection, setActiveSection] = useState('overview');
    const [isLoadingSection, setIsLoadingSection] = useState(false);

    const handleSectionChange = (sectionId) => {
        setIsLoadingSection(true);
        setActiveSection(sectionId);
        setTimeout(() => setIsLoadingSection(false), 400); // Functional feel
    };

    const sections = [
        { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
        { id: 'staff', label: 'Staff Team', icon: <Users size={16} /> },
        { id: 'equipment', label: 'Inventory', icon: <Package size={16} /> },
        { id: 'members', label: 'Members', icon: <UserPlus size={16} /> },
        { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={16} /> },
        { id: 'payments', label: 'Payments', icon: <DollarSign size={16} /> },
    ];

    return (
        <div className="branch-details-page animate-fade-in" style={{ padding: '0 0 40px' }}>
            {/* Top Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button className="icon-btn" onClick={onBack} style={{ background: '#fff', border: '1px solid #e2e8f0', width: '40px', height: '40px', borderRadius: '12px' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1E293B', margin: 0, letterSpacing: '-0.03em' }}>{branch.name}</h1>
                        <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem', fontWeight: 500 }}>
                            <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '4px', color: 'var(--color-red)' }} /> {branch.location} • {branch.type} Facility
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {userRole === 'super_admin' && (
                        <>
                            <button className="sm-btn-ghost" onClick={() => onEdit(branch)} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <Edit2 size={16} /> Edit Branch
                            </button>
                            <button className="sm-btn-ghost" style={{ background: '#fff', color: '#EF4444', borderColor: '#FEE2E2', borderRadius: '12px' }} onClick={() => onDelete(branch._id)}>
                                <Trash2 size={16} /> Remove
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <StatCardMini label="Total Members" value={stats.totalMembers} subValue="+12 this month" icon={<Users color="#3B82F6" />} bg="rgba(59, 130, 246, 0.08)" />
                <StatCardMini label="Today Check-ins" value={stats.todayCheckins} subValue="Live Activity" icon={<CheckCircle2 color="#10B981" />} bg="rgba(16, 185, 129, 0.08)" />
                <StatCardMini label="Total Staff" value={stats.totalStaff} subValue="Assigned Team" icon={<Shield color="#8B5CF6" />} bg="rgba(139, 92, 246, 0.08)" />
                <StatCardMini label="Equipment Condition" value={`${stats.totalEquipment - (stats.maintenanceEquipment + stats.damagedEquipment)}/${stats.totalEquipment}`} subValue={`${stats.damagedEquipment} Damaged`} icon={<Wrench color="#F59E0B" />} bg="rgba(245, 158, 11, 0.08)" />
            </div>

            {/* Section Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', overflowX: 'auto', scrollbarWidth: 'none' }}>
                {sections.map(s => (
                    <button 
                        key={s.id} 
                        onClick={() => handleSectionChange(s.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                            borderRadius: '14px', border: 'none', background: activeSection === s.id ? 'var(--color-red)' : 'transparent',
                            color: activeSection === s.id ? '#fff' : '#64748B', fontWeight: 800, fontSize: '0.8rem',
                            cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', whiteSpace: 'nowrap',
                            boxShadow: activeSection === s.id ? '0 10px 20px rgba(239, 68, 68, 0.2)' : 'none'
                        }}
                    >
                        {s.icon} {s.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className={`section-content ${isLoadingSection ? 'loading' : ''}`} style={{ transition: 'opacity 0.3s ease', opacity: isLoadingSection ? 0.5 : 1 }}>
                {activeSection === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
                        <div className="sa-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: '32px' }}>
                            <div style={{ height: '380px', position: 'relative' }}>
                                <img src={branch.photo} alt={branch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '24px', left: '24px', padding: '10px 20px', borderRadius: '100px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', color: '#fff', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(255,255,255,0.2)' }}>
                                    FACILITY IDENTITY
                                </div>
                                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '150px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                                <div style={{ position: 'absolute', bottom: '24px', left: '32px', color: '#fff' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>{branch.name}</h2>
                                    <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>{branch.location} Main Hub</p>
                                </div>
                            </div>
                            <div style={{ padding: '40px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>Core Specifications</h3>
                                    <div style={{ height: '2px', flex: 1, background: '#f1f5f9', margin: '0 24px' }}></div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                    <DetailItem label="Operations" value={status} icon={<Activity size={18} color={status === 'Open' ? '#10B981' : '#EF4444'} />} dot />
                                    <DetailItem label="Gym Type" value={`${branch.type} Facility`} icon={<Building2 size={18} color="var(--color-red)" />} />
                                    <DetailItem label="Operating Hours" value={branch.openingHours} icon={<Clock size={18} color="var(--color-red)" />} />
                                    <DetailItem label="Primary Contact" value="+94 77 123 4567" icon={<Phone size={18} color="var(--color-red)" />} />
                                    <DetailItem label="Official Email" value={`info.${branch.location.toLowerCase()}@powerworld.com`} icon={<MailIcon size={18} color="var(--color-red)" />} />
                                    <DetailItem label="Total Capacity" value="250 Members" icon={<Users size={18} color="var(--color-red)" />} />
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="sa-card" style={{ padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>Facility Gallery</h3>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--color-red)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>View All</button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300" style={{ width: '100%', height: '120px', borderRadius: '20px', objectFit: 'cover', transition: 'all 0.3s ease' }} className="gallery-img" />
                                    <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300" style={{ width: '100%', height: '120px', borderRadius: '20px', objectFit: 'cover', transition: 'all 0.3s ease' }} className="gallery-img" />
                                    <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300" style={{ width: '100%', height: '120px', borderRadius: '20px', objectFit: 'cover', transition: 'all 0.3s ease' }} className="gallery-img" />
                                    <div style={{ width: '100%', height: '120px', borderRadius: '20px', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '1.5rem', cursor: 'pointer', background: '#F8FAFC', transition: 'all 0.3s ease' }} className="gallery-add">
                                        <Plus size={28} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="sa-card" style={{ padding: '32px', background: 'linear-gradient(135deg, var(--color-red) 0%, #B91C1C 100%)', color: '#fff', borderRadius: '32px', border: 'none', boxShadow: '0 20px 40px rgba(239, 68, 68, 0.25)' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '20px', color: '#fff', letterSpacing: '0.01em' }}>Management Actions</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <button className="branch-action-wide" onClick={() => onEdit(branch)}><Clock size={16} /> Update Operations</button>
                                    <button className="branch-action-wide"><UserPlus size={16} /> Strategic Staffing</button>
                                    <button className="branch-action-wide"><Activity size={16} /> Performance Metrics</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'staff' && (
                    <div className="sa-card animate-fade-in" style={{ padding: '40px', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B' }}>Human Resources</h3>
                                <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.85rem' }}>Management and operational staff for {branch.name}</p>
                            </div>
                            <button className="sm-btn-primary" style={{ padding: '12px 24px', fontSize: '0.85rem', borderRadius: '12px' }}><Plus size={18} /> Onboard Staff</button>
                        </div>
                        <div className="sm-table-scroll" style={{ borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                            <table className="sm-table">
                                <thead style={{ background: '#F8FAFC' }}>
                                    <tr>
                                        <th style={{ padding: '20px' }}>Professional</th>
                                        <th>Staff ID</th>
                                        <th>Contact Details</th>
                                        <th>Assigned Since</th>
                                        <th>Live Status</th>
                                        <th className="sm-th-right">Management</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {branchStaff.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{ textAlign: 'center', padding: '100px 40px' }}>
                                                <div style={{ opacity: 0.1, marginBottom: '20px' }}><Users size={64} style={{ margin: '0 auto' }} /></div>
                                                <h4 style={{ margin: 0, fontWeight: 800, color: '#94A3B8' }}>No Personnel Found</h4>
                                                <p style={{ margin: '8px 0 0', color: '#CBD5E1', fontSize: '0.85rem' }}>Start by onboarding new staff to this facility.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        branchStaff.map((member, idx) => (
                                            <tr key={member._id} className="sm-tr" style={{ animationDelay: `${idx * 0.05}s` }}>
                                                <td style={{ padding: '20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                        <div style={{ width: 44, height: 44, borderRadius: '14px', overflow: 'hidden', background: '#f1f5f9', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                                            <img src={member.photo} alt={member.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 900, color: '#1E293B', fontSize: '0.9rem' }}>{member.firstName} {member.lastName}</div>
                                                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>Senior Operations</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="id-pill" style={{ background: '#F1F5F9', color: '#475569', fontWeight: 700 }}>{member.staffId}</span></td>
                                                <td style={{ fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>{member.phone}</td>
                                                <td style={{ fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>{member.joinDate}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', background: '#F8FAFC', padding: '6px 12px', borderRadius: '100px', width: 'fit-content' }}>
                                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#CBD5E1' }}></div> OFFLINE
                                                    </div>
                                                </td>
                                                <td className="sm-th-right">
                                                    <button className="sm-btn-ghost" onClick={() => onViewStaff(member)} style={{ padding: '10px 18px', fontSize: '0.75rem', borderRadius: '10px', background: '#F1F5F9' }}>
                                                        <Eye size={14} /> Profile
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSection === 'equipment' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B' }}>Facility Inventory</h3>
                                <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.85rem' }}>Asset management and maintenance tracking for {branch.location}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="sm-btn-ghost" style={{ borderRadius: '12px' }}><Wrench size={16} /> Maintenance Log</button>
                                <button className="sm-btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }}><Plus size={18} /> Register Asset</button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                            {branchEquipment.length === 0 ? (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', background: '#fff', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ opacity: 0.1, marginBottom: '20px' }}><Package size={64} style={{ margin: '0 auto' }} /></div>
                                    <h4 style={{ margin: 0, fontWeight: 800, color: '#94A3B8' }}>No Equipment Records</h4>
                                    <p style={{ margin: '8px 0 0', color: '#CBD5E1', fontSize: '0.85rem' }}>Physical assets for this branch haven't been registered yet.</p>
                                </div>
                            ) : (
                                branchEquipment.map((item, idx) => (
                                    <div key={item.id} style={{ animationDelay: `${idx * 0.1}s` }} className="animate-fade-in">
                                        <InventoryCard 
                                            item={item} 
                                            statusConfig={STATUS_CONFIG}
                                            onView={() => {}}
                                            onQr={() => {}}
                                            onUpdate={() => {}}
                                            onRemove={() => {}}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'members' && (
                    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '32px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="sa-card" style={{ padding: '32px', borderRadius: '32px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '28px', color: '#1E293B' }}>Membership Composition</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <StatRow label="Active Community" value={stats.activeMembers} color="#10B981" icon={<Users size={16} />} />
                                    <StatRow label="Lapsed Members" value="42" color="#EF4444" icon={<AlertCircle size={16} />} />
                                    <StatRow label="Renewal Pending" value="26" color="#F59E0B" icon={<Clock size={16} />} />
                                    <div style={{ height: '1px', background: '#f1f5f9', margin: '10px 0' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.8rem' }}>NET POPULATION</span>
                                        <span style={{ fontWeight: 950, fontSize: '1.4rem', color: '#1E293B' }}>{stats.totalMembers}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="sa-card" style={{ padding: '32px', borderRadius: '32px', background: '#F8FAFC', border: '1px dashed #E2E8F0' }}>
                                <h4 style={{ margin: '0 0 12px', fontWeight: 800, fontSize: '1rem' }}>Grow {branch.location}</h4>
                                <p style={{ margin: 0, color: '#64748B', fontSize: '0.8rem', lineHeight: 1.5 }}>Review targeted marketing analytics to increase membership conversion by up to 15% this quarter.</p>
                                <button className="sm-btn-ghost" style={{ marginTop: '20px', width: '100%', background: '#fff' }}>Market Insights</button>
                            </div>
                        </div>
                        
                        <div className="sa-card" style={{ padding: '40px', borderRadius: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1E293B' }}>New Registrations</h3>
                                <div style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.1)', color: '#10B981', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800 }}>LIVE LOG</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { name: 'Arjun Perera', id: 'M-1240', date: 'Today', time: '10:30 AM', plan: 'Monthly Elite' },
                                    { name: 'Sarah Mendis', id: 'M-1239', date: 'Today', time: '09:15 AM', plan: 'Annual Pro' },
                                    { name: 'Dilshan Silva', id: 'M-1238', date: 'Yesterday', time: '05:45 PM', plan: 'Quarterly' },
                                    { name: 'Anjali G.', id: 'M-1237', date: 'Yesterday', time: '02:30 PM', plan: 'Monthly Elite' },
                                ].map((m, i) => (
                                    <div key={i} className="member-reg-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#f8fafc', borderRadius: '24px', transition: 'all 0.3s ease', border: '1px solid transparent' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: 44, height: 44, borderRadius: '16px', background: 'var(--color-red)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '0.9rem', boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)' }}>
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 900, fontSize: '1rem', color: '#1E293B' }}>{m.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{m.id} • <span style={{ color: 'var(--color-red)' }}>{m.plan}</span></div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1E293B' }}>{m.date}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>{m.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="view-all-link" style={{ marginTop: '24px', padding: '14px' }}>View Registration Archives</button>
                        </div>
                    </div>
                )}

                {activeSection === 'analytics' && (
                    <div className="sa-card animate-fade-in" style={{ padding: '40px', borderRadius: '32px', height: '550px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#1E293B', letterSpacing: '-0.02em' }}>In-Facility Utilization</h3>
                                <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '4px 0 0', fontWeight: 500 }}>Real-time and historic member density for <span style={{ fontWeight: 800, color: 'var(--color-red)' }}>{branch.name}</span></p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', background: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
                                <button style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#fff', fontWeight: 800, fontSize: '0.7rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>Daily</button>
                                <button style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'transparent', fontWeight: 700, fontSize: '0.7rem', color: '#64748B' }}>Weekly</button>
                            </div>
                        </div>
                        <div style={{ height: '360px', width: '100%' }}>
                            <BranchUsageChart selectedBranch={branch.location} />
                        </div>
                    </div>
                )}

                {activeSection === 'payments' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                            <div className="stat-card-mini" style={{ padding: '32px', borderRadius: '32px', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', border: 'none' }}>
                                <div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Revenue (MTD)</div>
                                    <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#fff', letterSpacing: '-0.03em' }}>Rs. 425k</div>
                                    <div style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <TrendingUp size={14} /> +12.4% <span style={{ opacity: 0.6, color: '#fff' }}>vs Prev Period</span>
                                    </div>
                                </div>
                            </div>
                            <div className="stat-card-mini" style={{ padding: '32px', borderRadius: '32px' }}>
                                <div>
                                    <div style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Settlements</div>
                                    <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#1E293B', letterSpacing: '-0.03em' }}>312</div>
                                    <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 700, marginTop: '8px' }}>92% Compliance Rate</div>
                                </div>
                            </div>
                            <div className="stat-card-mini" style={{ padding: '32px', borderRadius: '32px' }}>
                                <div>
                                    <div style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Receivables</div>
                                    <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#EF4444', letterSpacing: '-0.03em' }}>Rs. 38k</div>
                                    <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 700, marginTop: '8px' }}>26 Outstanding accounts</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="sa-card" style={{ padding: '40px', borderRadius: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1E293B' }}>Settlement History</h3>
                                <button className="sm-btn-ghost" style={{ borderRadius: '10px' }}><ArrowLeft size={16} /> Export CSV</button>
                            </div>
                            <div className="sm-table-scroll" style={{ borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                <table className="sm-table">
                                    <thead style={{ background: '#F8FAFC' }}>
                                        <tr>
                                            <th style={{ padding: '20px' }}>Contributor</th>
                                            <th>Reference</th>
                                            <th>Membership Tier</th>
                                            <th>Process Date</th>
                                            <th>Amount</th>
                                            <th className="sm-th-right">Verification</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { m: 'Arjun Perera', ref: 'PAY-8821', p: 'Monthly Elite', d: '2026-03-10', a: '4,500', s: 'Verified' },
                                            { m: 'Sarah Mendis', ref: 'PAY-8819', p: 'Annual Platinum', d: '2026-03-09', a: '45,000', s: 'Verified' },
                                            { m: 'Dinithi J.', ref: 'PAY-8815', p: 'Quarterly', d: '2026-03-08', a: '12,500', s: 'Verified' },
                                        ].map((t, i) => (
                                            <tr key={i} className="sm-tr">
                                                <td style={{ padding: '20px', fontWeight: 900, color: '#1E293B' }}>{t.m}</td>
                                                <td><span className="id-pill" style={{ fontFamily: 'monospace' }}>{t.ref}</span></td>
                                                <td style={{ fontWeight: 700, color: '#64748B' }}>{t.p}</td>
                                                <td style={{ fontWeight: 600, color: '#64748B' }}>{t.d}</td>
                                                <td style={{ fontWeight: 950, color: '#1E293B' }}>LKR {t.a}</td>
                                                <td className="sm-th-right">
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '50px', background: 'rgba(16,185,129,0.1)', color: '#10B981', fontSize: '0.7rem', fontWeight: 800 }}>
                                                        <CheckCircle2 size={12} /> {t.s}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Sub-components
const StatCardMini = ({ label, value, subValue, icon, bg, style }) => (
    <div className="stat-card-mini" style={{ ...style, cursor: 'default', minHeight: '110px' }}>
        <div className="icon-circle" style={{ 
            background: `linear-gradient(135deg, ${bg} 0%, ${bg.replace('0.08', '0.15')} 100%)`, 
            width: 56, 
            height: 56, 
            margin: 0, 
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: `1px solid ${bg === 'rgba(245, 158, 11, 0.08)' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0,0,0,0.03)'}`
        }}>
            {React.cloneElement(icon, { size: 26 })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '4px' }}>
            <span className="sm-stat-label" style={{ 
                fontSize: '0.68rem', 
                letterSpacing: '0.1em', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                lineHeight: 1,
                marginBottom: '6px',
                color: '#94A3B8'
            }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <h2 className="sm-stat-value" style={{ 
                    fontSize: '1.6rem', 
                    margin: 0, 
                    fontWeight: 950, 
                    color: '#1E293B',
                    lineHeight: 1,
                    letterSpacing: '-0.02em'
                }}>{value}</h2>
            </div>
            <div style={{ 
                fontSize: '0.72rem', 
                color: label === 'Equipment Condition' && value.includes('/') && parseInt(value.split('/')[1]) - parseInt(value.split('/')[0]) > 0 ? '#EF4444' : '#64748B', 
                fontWeight: 700, 
                marginTop: '6px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
            }}>
                {subValue}
            </div>
        </div>
    </div>
);

const DetailItem = ({ label, value, icon, dot }) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '6px 0' }}>
        <div className="detail-item-icon" style={{ 
            width: 48, 
            height: 48, 
            borderRadius: '16px', 
            background: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
        }}>
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                color: '#94A3B8', 
                textTransform: 'uppercase', 
                marginBottom: '2px', 
                letterSpacing: '0.05em',
                lineHeight: 1
            }}>{label}</div>
            <div style={{ 
                fontSize: '1.05rem', 
                fontWeight: 950, 
                color: '#1E293B', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                lineHeight: 1.2
            }}>
                {dot && <div style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    background: value === 'Open' ? '#10B981' : '#EF4444', 
                    boxShadow: `0 0 10px ${value === 'Open' ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'}` 
                }}></div>}
                {value}
            </div>
        </div>
    </div>
);

const StatRow = ({ label, value, color, icon }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '10px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>{label}</span>
        </div>
        <span style={{ fontSize: '1.1rem', fontWeight: 950, color: '#1E293B' }}>{value}</span>
    </div>
);

export default BranchDetailsView;
