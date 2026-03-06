import { useNavigate } from 'react-router-dom';
import { Users, Activity, CheckSquare, DollarSign, Clock, UserCheck, ChevronRight, CheckCircle2, Wrench, AlertTriangle } from 'lucide-react';
import '../styles/StaffDashboard.css';

const StaffDashboard = ({ setActiveTab }) => {
    const navigate = useNavigate();

    const handleNavigation = (tab) => {
        if (setActiveTab) {
            setActiveTab(tab);
        } else {
            navigate(`/${tab}`);
        }
    };

    const todayCheckins = [
        { no: 1, id: 'M-1024', name: 'Arjun Perera', arrival: '08:15 AM', leave: '09:40 AM', status: 'Completed' },
        { no: 2, id: 'M-1056', name: 'Sarah Mendis', arrival: '08:45 AM', leave: '10:00 AM', status: 'Completed' },
        { no: 3, id: 'M-1089', name: 'Dilshan Silva', arrival: '09:05 AM', leave: '--', status: 'Active' },
        { no: 4, id: 'M-1102', name: 'Anjali Gunawardena', arrival: '09:30 AM', leave: '--', status: 'Active' },
        { no: 5, id: 'M-1115', name: 'Kasun Rajapaksa', arrival: '10:00 AM', leave: '11:15 AM', status: 'Completed' },
        { no: 6, id: 'M-1128', name: 'Nirosha Fernando', arrival: '10:15 AM', leave: '--', status: 'Active' },
        { no: 7, id: 'M-1140', name: 'Pathum Nissanka', arrival: '10:30 AM', leave: '12:00 PM', status: 'Completed' },
        { no: 8, id: 'M-1152', name: 'Kusal Mendis', arrival: '11:00 AM', leave: '--', status: 'Active' },
        { no: 9, id: 'M-1165', name: 'Wanidu Hasaranga', arrival: '11:15 AM', leave: '12:45 PM', status: 'Completed' },
        { no: 10, id: 'M-1178', name: 'Maheesh Theekshana', arrival: '11:45 AM', leave: '--', status: 'Active' },
        { no: 11, id: 'M-1190', name: 'Charith Asalanka', arrival: '12:15 PM', leave: '01:30 PM', status: 'Completed' },
        { no: 12, id: 'M-1202', name: 'Dasun Shanaka', arrival: '12:45 PM', leave: '--', status: 'Active' },
        { no: 13, id: 'M-1215', name: 'Chamika Karunaratne', arrival: '01:15 PM', leave: '02:45 PM', status: 'Completed' },
        { no: 14, id: 'M-1228', name: 'Dushmantha Chameera', arrival: '01:45 PM', leave: '--', status: 'Active' },
        { no: 15, id: 'M-1240', name: 'Lahiru Kumara', arrival: '02:15 PM', leave: '03:30 PM', status: 'Completed' },
    ];

    const equipmentSummary = [
        { status: 'Available', count: 61, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle2 size={16} /> },
        { status: 'Maintenance', count: 3, color: '#f59e0bff', bg: 'rgba(245, 158, 11, 0.1)', icon: <Clock size={16} /> },
        { status: 'Damaged', count: 0, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <AlertTriangle size={16} /> },
    ];

    const expiringMembers = [
        { id: 'M-1115', name: 'Kasun Rajapaksa', start: '2025-02-10', expire: '2026-02-10', status: 'Expired' },
        { id: 'M-1120', name: 'Lakmini Silva', start: '2025-02-28', expire: '2026-02-28', status: 'Expired' },
        { id: 'M-1102', name: 'Anjali Gunawardena', start: '2025-03-05', expire: '2026-03-05', status: 'Expiring Soon' },
        { id: 'M-1024', name: 'Arjun Perera', start: '2025-03-10', expire: '2026-03-10', status: 'Expiring Soon' },
        { id: 'M-1089', name: 'Dilshan Silva', start: '2025-03-15', expire: '2026-03-15', status: 'Expiring Soon' },
        { id: 'M-1250', name: 'Saman Kumara', start: '2025-03-20', expire: '2026-03-20', status: 'Active' },
        { id: 'M-1260', name: 'Nuwan Perera', start: '2025-03-25', expire: '2026-03-25', status: 'Active' },
        { id: 'M-1270', name: 'Thilina Prasad', start: '2025-04-01', expire: '2026-04-01', status: 'Active' },
        { id: 'M-1280', name: 'Ruwan Kumara', start: '2025-04-05', expire: '2026-04-05', status: 'Active' },
        { id: 'M-1290', name: 'Priyantha De Silva', start: '2025-04-10', expire: '2026-04-10', status: 'Active' },
    ];

    const pendingPaymentsList = [
        { id: 'M-1130', name: 'Damith Perera', amount: 'LKR 12,000', due: '2026-03-01', status: 'Overdue' },
        { id: 'M-1089', name: 'Dilshan Silva', amount: 'LKR 12,000', due: '2026-03-03', status: 'Overdue' },
        { id: 'M-1102', name: 'Anjali Gunawardena', amount: 'LKR 4,500', due: '2026-03-05', status: 'Pending' },
        { id: 'M-1024', name: 'Arjun Perera', amount: 'LKR 4,500', due: '2026-03-10', status: 'Pending' },
        { id: 'M-1280', name: 'Gihan Fernando', amount: 'LKR 6,000', due: '2026-03-12', status: 'Pending' },
        { id: 'M-1290', name: 'Ruwan Wijesinghe', amount: 'LKR 3,000', due: '2026-03-15', status: 'Pending' },
        { id: 'M-1300', name: 'Chathura Perera', amount: 'LKR 4,500', due: '2026-03-18', status: 'Pending' },
        { id: 'M-1310', name: 'Asanka Gurusinghe', amount: 'LKR 12,000', due: '2026-03-20', status: 'Pending' },
    ];

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>Dashboard</h1>
                    <p>Welcome to your daily shift overview. Have a great day!</p>
                </div>
                <div className="sa-actions">
                    <div className="date-time-display">
                        <Clock size={18} />
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Users /></div>
                    <div className="card-data">
                        <span className="label">Total Members</span>
                        <h2 className="value">842</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><UserCheck /></div>
                    <div className="card-data">
                        <span className="label">Active Members</span>
                        <h2 className="value">756</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><Activity /></div>
                    <div className="card-data">
                        <span className="label">Today Check-ins</span>
                        <h2 className="value">124</h2>
                    </div>
                </div>

                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}><CheckSquare /></div>
                    <div className="card-data">
                        <span className="label">Total Equipment</span>
                        <h2 className="value">64</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0bff' }}><Clock /></div>
                    <div className="card-data">
                        <span className="label">Equipment Under Maintenance</span>
                        <h2 className="value">03</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><DollarSign /></div>
                    <div className="card-data">
                        <span className="label">Pending Payments</span>
                        <h2 className="value">18</h2>
                    </div>
                </div>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* Section 1: Recent Check-ins */}
                <div className="sa-card" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
                    <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: '800' }}>Recent Check-ins</h3>
                        <button
                            onClick={() => handleNavigation('members')}
                            style={{ background: '#EF4444', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseOver={(e) => e.target.style.background = '#DC2626'}
                            onMouseOut={(e) => e.target.style.background = '#EF4444'}
                        >
                            More
                        </button>
                    </div>
                    <div className="table-responsive" style={{ padding: '0 20px 20px', flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.65rem', textTransform: 'uppercase', textAlign: 'left', fontWeight: '800' }}>
                                    <th style={{ padding: '12px 8px' }}>No</th>
                                    <th style={{ padding: '12px 8px' }}>ID</th>
                                    <th style={{ padding: '12px 8px' }}>Name</th>
                                    <th style={{ padding: '12px 8px' }}>Arrival Time</th>
                                    <th style={{ padding: '12px 8px' }}>Leave Time</th>
                                    <th style={{ padding: '12px 8px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todayCheckins.map((checkin, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '12px 8px', color: '#64748B', fontSize: '0.75rem', fontWeight: '600' }}>{checkin.no}</td>
                                        <td style={{ padding: '12px 8px', color: '#64748B', fontSize: '0.75rem', fontWeight: '600' }}>{checkin.id}</td>
                                        <td style={{ padding: '12px 8px', fontWeight: '700', color: '#1E293B', fontSize: '0.75rem' }}>{checkin.name}</td>
                                        <td style={{ padding: '12px 8px', color: '#64748B', fontSize: '0.75rem', fontWeight: '600' }}>{checkin.arrival}</td>
                                        <td style={{ padding: '12px 8px', color: '#64748B', fontSize: '0.75rem', fontWeight: '600' }}>{checkin.leave}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.65rem',
                                                fontWeight: '800',
                                                background: checkin.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: checkin.status === 'Completed' ? '#10B981' : '#EF4444'
                                            }}>
                                                {checkin.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Section 2: Equipment Status Summary */}
                <div className="sa-card" style={{ height: '350px' }}>
                    <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: '800' }}>Equipment Status Summary</h3>
                        <button
                            onClick={() => handleNavigation('inventory')}
                            style={{ background: '#EF4444', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseOver={(e) => e.target.style.background = '#DC2626'}
                            onMouseOut={(e) => e.target.style.background = '#EF4444'}
                        >
                            More
                        </button>
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '280px' }}>
                        {equipmentSummary.map((eq, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: eq.bg, color: eq.color
                                    }}>
                                        {eq.icon}
                                    </div>
                                    <span style={{ fontWeight: '700', color: '#334155', fontSize: '0.75rem' }}>{eq.status}</span>
                                </div>
                                <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1E293B' }}>{eq.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section 3: Membership Alerts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="sa-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '800' }}>
                            Membership Alerts
                        </h3>
                        <button
                            onClick={() => handleNavigation('members')}
                            style={{ background: '#EF4444', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseOver={(e) => e.target.style.background = '#DC2626'}
                            onMouseOut={(e) => e.target.style.background = '#EF4444'}
                        >
                            More
                        </button>
                    </div>
                    <div className="table-responsive" style={{ padding: '0 20px 20px', flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.65rem', textTransform: 'uppercase', textAlign: 'left', fontWeight: '800' }}>
                                    <th style={{ padding: '12px 8px' }}>ID</th>
                                    <th style={{ padding: '12px 8px' }}>Name</th>
                                    <th style={{ padding: '12px 8px' }}>Start Date</th>
                                    <th style={{ padding: '12px 8px' }}>Expiry Date</th>
                                    <th style={{ padding: '12px 8px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expiringMembers.map((member, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '12px 8px', color: '#64748B', fontSize: '0.75rem', fontWeight: '600' }}>{member.id}</td>
                                        <td style={{ padding: '12px 8px', fontWeight: '700', color: '#1E293B', fontSize: '0.75rem' }}>{member.name}</td>
                                        <td style={{ padding: '12px 8px', color: '#334155', fontSize: '0.75rem', fontWeight: '600' }}>{member.start}</td>
                                        <td style={{ padding: '12px 8px', color: '#64748B', fontSize: '0.75rem', fontWeight: '600' }}>{member.expire}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.65rem',
                                                fontWeight: '800',
                                                background: member.status === 'Expired' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: member.status === 'Expired' ? '#EF4444' : '#F59E0B'
                                            }}>
                                                {member.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Section 4: Pending Payments */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="sa-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: '800' }}>Pending Payments</h3>
                        <button
                            onClick={() => handleNavigation('payments')}
                            style={{ background: '#EF4444', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseOver={(e) => e.target.style.background = '#DC2626'}
                            onMouseOut={(e) => e.target.style.background = '#EF4444'}
                        >
                            More
                        </button>
                    </div>
                    <div className="table-responsive" style={{ padding: '0 20px 20px', flex: 1, overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.65rem', textTransform: 'uppercase', textAlign: 'left', fontWeight: '800' }}>
                                    <th style={{ padding: '12px 8px' }}>ID</th>
                                    <th style={{ padding: '12px 8px' }}>Name</th>
                                    <th style={{ padding: '12px 8px' }}>Amount</th>
                                    <th style={{ padding: '12px 8px' }}>Due Date</th>
                                    <th style={{ padding: '12px 8px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingPaymentsList.map((payment, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '12px 8px', color: '#64748B', fontSize: '0.75rem', fontWeight: '600' }}>{payment.id}</td>
                                        <td style={{ padding: '12px 8px', fontWeight: '700', color: '#1E293B', fontSize: '0.75rem' }}>{payment.name}</td>
                                        <td style={{ padding: '12px 8px', color: '#1E293B', fontWeight: '800', fontSize: '0.75rem' }}>{payment.amount}</td>
                                        <td style={{ padding: '12px 8px', color: '#64748B', fontSize: '0.75rem', fontWeight: '600' }}>{payment.due}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.65rem',
                                                fontWeight: '800',
                                                background: payment.status === 'Overdue' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: payment.status === 'Overdue' ? '#EF4444' : '#F59E0B'
                                            }}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
