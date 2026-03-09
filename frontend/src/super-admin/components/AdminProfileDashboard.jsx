import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Building2, TrendingUp, DollarSign, Phone, Mail, CreditCard } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AdminProfileDashboard = ({ admin, onBack }) => {
    const DEFAULT_AVATAR = '/MDH_8729webqualitysquare.webp';

    const [staffData, setStaffData] = useState([]);

    useEffect(() => {
        const savedStaff = localStorage.getItem('mock_staff_db');
        if (savedStaff) {
            setStaffData(JSON.parse(savedStaff));
        } else {
            // Mock if no staff_db available
            setStaffData([
                { firstName: 'John', surname: 'Silva', role: 'Staff', branchId: 'b1' },
                { firstName: 'Sarah', surname: 'Perera', role: 'Staff', branchId: 'b1' },
                { firstName: 'Nimal', surname: 'Fernando', role: 'Staff', branchId: 'b2' },
                { firstName: 'Ashen', surname: 'Jayasinghe', role: 'Staff', branchId: 'b2' },
            ]);
        }
    }, []);

    // Get staff for assigned branches (mock assignment: map branch names to IDs or just random staff if branches don't match exactly)
    // We'll just generate realistic dummy staff based on the assigned branches names
    const getBranchStaff = (branchName) => {
        // Here we just map some staff to the branch deterministically based on branchName
        const names = [
            ['John Silva', 'Sarah Perera'],
            ['Nimal Fernando', 'Ashen Jayasinghe'],
            ['Kamal Silva', 'Kasun Perera'],
            ['Saman Kumara', 'Pasan Fernando'],
            ['Malithi Silva', 'Dinithi Perera'],
            ['Isuru Silva', 'Charith Jayasinghe']
        ];
        let hash = 0;
        for (let i = 0; i < branchName.length; i++) {
            hash = branchName.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = Math.abs(hash);
        return names[hash % names.length];
    };

    const branchPerformances = admin.assignedBranches.map(branchName => ({
        name: branchName.replace('Branch ', 'B'),
        revenue: Math.floor(Math.random() * 500000) + 100000,
        members: Math.floor(Math.random() * 500) + 100
    }));

    const memberGrowthMock = [
        { month: 'Jan', members: 120 },
        { month: 'Feb', members: 140 },
        { month: 'Mar', members: 200 },
        { month: 'Apr', members: 210 },
        { month: 'May', members: 250 },
        { month: 'Jun', members: 310 }
    ];

    const totalRevenue = branchPerformances.reduce((acc, b) => acc + b.revenue, 0);
    const totalMembers = branchPerformances.reduce((acc, b) => acc + b.members, 0);
    const totalStaff = admin.assignedBranches.length * 2; // ~2 staff per branch

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: '#f1f5f9',
                        border: 'none',
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748b',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#333'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0, color: '#1e293b' }}>Admin Profile Dashboard</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '32px', alignItems: 'flex-start' }}>

                {/* LEFT PROFILE SECTION */}
                <div className="sa-card" style={{ padding: '30px', position: 'sticky', top: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '4px solid #f8fafc',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                            marginBottom: '16px',
                            background: '#f1f5f9'
                        }}>
                            <img src={admin.profilePic || DEFAULT_AVATAR} alt={admin.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
                        </div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b', margin: '0 0 4px 0' }}>{admin.firstName} {admin.lastName}</h2>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-red)', background: 'rgba(255,0,0,0.06)', padding: '4px 12px', borderRadius: '20px' }}>
                            {admin._id || 'ADM-000'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 10px', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <Phone size={16} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Phone</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{admin.phone || 'N/A'}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <Mail size={16} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Email</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{admin.email || 'N/A'}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <CreditCard size={16} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>NIC</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{admin.nic || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                        <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '16px', textTransform: 'uppercase' }}>Assigned Branches</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {admin.assignedBranches && admin.assignedBranches.length > 0 ? admin.assignedBranches.map((branch, idx) => (
                                <span key={idx} style={{
                                    fontSize: '0.75rem', fontWeight: 700, color: '#1e293b', background: '#f8fafc', border: '1px solid #cbd5e1',
                                    padding: '6px 12px', borderRadius: '8px'
                                }}>
                                    {branch}
                                </span>
                            )) : (
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No branches assigned</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT OVERVIEW SECTION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Performance Overview Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        <div className="sa-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Building2 size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Total Branches</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b' }}>{admin.assignedBranches.length}</div>
                            </div>
                        </div>
                        <div className="sa-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Users size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Total Staff</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b' }}>{totalStaff}</div>
                            </div>
                        </div>
                        <div className="sa-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Total Members</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b' }}>{totalMembers}</div>
                            </div>
                        </div>
                        <div className="sa-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <DollarSign size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Monthly Rev</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b' }}>{(totalRevenue / 1000).toFixed(0)}K</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '24px', alignItems: 'stretch' }}>
                        {/* Visual Charts */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="sa-card" style={{ padding: '24px', flex: 1 }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '20px' }}>Branch Performance Chart</h3>
                                <div style={{ height: '200px', width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={branchPerformances} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} cursor={{ fill: '#f1f5f9' }} />
                                            <Bar dataKey="revenue" fill="var(--color-red)" radius={[4, 4, 0, 0]} barSize={32} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="sa-card" style={{ padding: '24px', flex: 1 }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '20px' }}>Member Growth Chart</h3>
                                <div style={{ height: '200px', width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={memberGrowthMock} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <Line type="monotone" dataKey="members" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Branch Staff Information */}
                        <div className="sa-card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Branch Staff Information</h3>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0' }}>Staff working in assigned branches</p>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '550px' }} className="custom-scrollbar">
                                {admin.assignedBranches.length > 0 ? admin.assignedBranches.map((branch, idx) => {
                                    const staffMembers = getBranchStaff(branch);
                                    return (
                                        <div key={idx} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Building2 size={16} color="var(--color-red)" /> {branch}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                <span style={{ fontWeight: 700, color: '#475569' }}>Staff:</span> {staffMembers.join(', ')}
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                                        No branches assigned to view staff.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminProfileDashboard;
