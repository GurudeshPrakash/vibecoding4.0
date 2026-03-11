/**
 * @module StaffModule
 * @status STABLE - LOCKED
 * @description This module is development-complete. Avoid modifications unless specifically requested.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, CheckSquare, DollarSign, Clock, UserCheck, ChevronRight, CheckCircle2, Wrench, AlertTriangle } from 'lucide-react';
import '../styles/StaffDashboard.css';

const StaffDashboard = ({ setActiveTab, inventoryData = [], stats = {} }) => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState(inventoryData.length > 0 ? inventoryData : []);
    const [checkinCount, setCheckinCount] = useState(0);
    const [pendingPaymentsCount, setPendingPaymentsCount] = useState(18);

    const todayCheckins = [
        { no: 1, id: 'M-1024', name: 'Arjun Perera', arrival: '08:15 AM', leave: '09:40 AM', status: 'Completed' },
        { no: 2, id: 'M-1056', name: 'Sarah Mendis', arrival: '08:45 AM', leave: '10:00 AM', status: 'Completed' },
        { no: 3, id: 'M-1089', name: 'Dilshan Silva', arrival: '09:05 AM', leave: '--', status: 'Active' },
        { no: 4, id: 'M-1102', name: 'Anjali Gunawardena', arrival: '09:30 AM', leave: '--', status: 'Active' },
        { no: 5, id: 'M-1115', name: 'Kasun Rajapaksa', arrival: '10:00 AM', leave: '11:15 AM', status: 'Completed' },
    ];

    const expiringMembers = [
        { id: 'M-1115', name: 'Kasun Rajapaksa', start: '2025-02-10', expire: '2026-02-10', status: 'Expired' },
        { id: 'M-1120', name: 'Lakmini Silva', start: '2025-02-28', expire: '2026-02-28', status: 'Expired' },
        { id: 'M-1102', name: 'Anjali Gunawardena', start: '2025-03-05', expire: '2026-03-05', status: 'Expiring Soon' },
    ];

    const pendingPaymentsList = [
        { id: 'M-1130', name: 'Damith Perera', amount: 'LKR 12,000', due: '2026-03-01', status: 'Overdue' },
        { id: 'M-1089', name: 'Dilshan Silva', amount: 'LKR 12,000', due: '2026-03-03', status: 'Overdue' },
    ];

    // Initial load and dynamic updates
    useEffect(() => {
        // Today Check-ins Logic
        const todayStr = new Date().toISOString().split('T')[0];
        const lastCheckinDate = localStorage.getItem('dev_checkin_date');
        let currentCheckins = parseInt(localStorage.getItem('dev_today_checkins') || '124');

        if (lastCheckinDate !== todayStr) {
            currentCheckins = 0; // Midnight reset
            localStorage.setItem('dev_checkin_date', todayStr);
            localStorage.setItem('dev_today_checkins', '0');
        }
        setCheckinCount(currentCheckins);

        // Pending Payments Logic
        const payments = parseInt(localStorage.getItem('dev_pending_payments') || '18');
        setPendingPaymentsCount(payments);

        // Equipment Stats Logic
        const rawInventory = inventoryData.length > 0 ? inventoryData : []; // Would use MOCK if empty in a real scenario
        const overrides = JSON.parse(localStorage.getItem('dev_status_overrides') || '{}');

        let availableCount = 0;
        let maintenanceCount = 0;
        let damagedCount = 0;

        // Apply overrides and calculate counts
        const updatedInventory = rawInventory.map(item => {
            const id = item.id || item._id;
            const status = overrides[id] || item.status || 'Good';

            if (status === 'Good') availableCount++;
            else if (status === 'Maintenance') maintenanceCount++;
            else if (status === 'Damaged') damagedCount++;

            return { ...item, status };
        });

        setInventory(updatedInventory);
    }, [inventoryData]);

    const handleNavigation = (tab) => {
        if (setActiveTab) {
            setActiveTab(tab);
        } else {
            navigate(`/${tab}`);
        }
    };

    const moreBtnStyle = {
        background: '#EF4444',
        color: 'white',
        border: 'none',
        padding: '3px 10px', // Significantly reduced padding
        borderRadius: '4px',
        fontSize: '0.65rem', // Even smaller text
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        minWidth: '50px', // Smaller min-width
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    };

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h1>Dashboard</h1>
                        <span style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            color: '#EF4444', 
                            fontSize: '0.65rem', 
                            padding: '4px 12px', 
                            borderRadius: '100px', 
                            fontWeight: '800',
                            letterSpacing: '0.05em',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>GALLE BRANCH</span>
                    </div>
                    <p>Welcome to your daily shift overview. Have a great day!</p>
                </div>
                {/* Date and Time section removed */}
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Users size={20} /></div>
                    <div className="card-data">
                        <span className="label">Total Members</span>
                        <h2 className="value">842</h2>
                    </div>
                </div>

                {/* Position 2: Today Check-ins (Replacing Active Members) */}
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><UserCheck size={20} /></div>
                    <div className="card-data">
                        <span className="label">Today Check-ins</span>
                        <h2 className="value">{checkinCount}</h2>
                    </div>
                </div>

                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}><CheckSquare size={20} /></div>
                    <div className="card-data">
                        <span className="label">Total Equipment</span>
                        <h2 className="value">{inventory.filter(i => i.status === 'Good' || i.status === 'Available').length || 23}</h2>
                    </div>
                </div>

                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0bff' }}><Wrench size={20} /></div>
                    <div className="card-data">
                        <span className="label">Equipment Under Maintenance</span>
                        <h2 className="value">{inventory.filter(i => i.status === 'Maintenance').length || '04'}</h2>
                    </div>
                </div>

                {/*Damaged (New Live Card) */}
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><AlertTriangle size={20} /></div>
                    <div className="card-data">
                        <span className="label">Damaged</span>
                        <h2 className="value">{inventory.filter(i => i.status === 'Damaged').length || '01'}</h2>
                    </div>
                </div>

                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><DollarSign size={20} /></div>
                    <div className="card-data">
                        <span className="label">Pending Payments</span>
                        <h2 className="value">{pendingPaymentsCount}</h2>
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
                            style={moreBtnStyle}
                            onMouseOver={(e) => e.target.style.background = '#DC2626'}
                            onMouseOut={(e) => e.target.style.background = '#EF4444'}
                        >
                            More
                        </button>
                    </div>
                    {/* ... (table content kept same) */}
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
                            style={moreBtnStyle}
                            onMouseOver={(e) => e.target.style.background = '#DC2626'}
                            onMouseOut={(e) => e.target.style.background = '#EF4444'}
                        >
                            More
                        </button>
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '280px' }}>
                        {[
                            { status: 'Available', count: inventory.filter(i => i.status === 'Good' || i.status === 'Available').length || 18, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle2 size={16} /> },
                            { status: 'Maintenance', count: inventory.filter(i => i.status === 'Maintenance').length || 4, color: '#f59e0bff', bg: 'rgba(245, 158, 11, 0.1)', icon: <Clock size={16} /> },
                            { status: 'Damaged', count: inventory.filter(i => i.status === 'Damaged').length || 1, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <AlertTriangle size={16} /> },
                        ].map((eq, index) => (
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

            {/* Section 3: Membership Alerts (reduced more button) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="sa-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '800' }}>
                            Membership Alerts
                        </h3>
                        <button
                            onClick={() => handleNavigation('members')}
                            style={moreBtnStyle}
                            onMouseOver={(e) => e.target.style.background = '#DC2626'}
                            onMouseOut={(e) => e.target.style.background = '#EF4444'}
                        >
                            More
                        </button>
                    </div>
                    {/* ... table kept same */}
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

            {/* Section 4: Pending Payments (reduced more button) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="sa-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: '800' }}>Pending Payments</h3>
                        <button
                            onClick={() => handleNavigation('payments')}
                            style={moreBtnStyle}
                            onMouseOver={(e) => e.target.style.background = '#DC2626'}
                            onMouseOut={(e) => e.target.style.background = '#EF4444'}
                        >
                            More
                        </button>
                    </div>
                    {/* ... table kept same */}
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
